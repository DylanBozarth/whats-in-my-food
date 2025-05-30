import { normalizeIngredient, criticalAlternateNames } from "./food_list"

// Levenshtein distance calculation for fuzzy matching
export function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Calculate similarity percentage
export function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1

  const distance = levenshteinDistance(str1, str2)
  return (maxLength - distance) / maxLength
}

// Enhanced normalization for fuzzy matching
export function normalizeForMatching(text) {
  // First apply the ingredient normalization (handles alternates)
  let normalized = normalizeIngredient(text)

  // Additional fuzzy matching prep
  normalized = normalized
    .replace(/[^\w\s]/g, "") // Remove remaining punctuation
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  return normalized
}

// Check if two strings are similar enough in length to be typos
function isReasonableTypoLength(str1, str2, maxLengthDifference = 3) {
  return Math.abs(str1.length - str2.length) <= maxLengthDifference
}

// Check if search term appears as complete words in target (not partial words)
function isCompleteWordMatch(searchTerm, targetText) {
  const normalizedSearch = normalizeForMatching(searchTerm)
  const normalizedTarget = normalizeForMatching(targetText)

  // Split into words
  const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 0)
  const targetWords = normalizedTarget.split(" ").filter((w) => w.length > 0)

  // Check if all search words appear as complete words in target
  return searchWords.every((searchWord) => targetWords.some((targetWord) => targetWord === searchWord))
}

// Check if target contains search term with only acceptable modifiers
function isIngredientWithModifiers(searchTerm, targetText) {
  const normalizedSearch = normalizeForMatching(searchTerm)
  const normalizedTarget = normalizeForMatching(targetText)

  // Common acceptable modifiers that don't change the ingredient identity
  const acceptableModifiers = [
    "organic",
    "natural",
    "refined",
    "unrefined",
    "cold pressed",
    "virgin",
    "extra virgin",
    "raw",
    "roasted",
    "unsalted",
    "salted",
    "fresh",
    "dried",
    "powdered",
    "liquid",
    "concentrated",
    "pure",
    "filtered",
    "unfiltered",
    "pasteurized",
    "unpasteurized",
    "whole",
    "skim",
    "low fat",
    "non fat",
    "reduced fat",
    "light",
    "dark",
    "white",
    "brown",
    "red",
    "green",
    "yellow",
    "black",
  ]

  // If search term appears as complete words in target
  if (isCompleteWordMatch(searchTerm, targetText)) {
    // Get the extra words (potential modifiers)
    const searchWords = normalizedSearch.split(" ")
    const targetWords = normalizedTarget.split(" ")
    const extraWords = targetWords.filter((word) => !searchWords.includes(word))

    // Check if all extra words are acceptable modifiers
    return extraWords.every(
      (word) => acceptableModifiers.includes(word) || word.length <= 2, // Allow short words like "no", "lo", etc.
    )
  }

  return false
}

// Enhanced fuzzy matching with smart substring detection
export function fuzzyMatch(searchTerm, targetText, options = {}) {
  const {
    exactMatchThreshold = 0.85,
    partialMatchThreshold = 0.75,
    enableWordOrder = true,
    enableAlternates = true,
    maxTypoDistance = 2,
    maxLengthDifference = 3,
  } = options

  // Normalize both terms (this handles alternate names automatically)
  const normalizedSearch = normalizeForMatching(searchTerm)
  const normalizedTarget = normalizeForMatching(targetText)

  // Strategy 1: Check if either term has an alternate name that matches exactly
  if (enableAlternates) {
    const searchLower = searchTerm.toLowerCase().trim()
    const targetLower = targetText.toLowerCase().trim()

    // Check if search term is an alternate for target
    if (
      criticalAlternateNames[searchLower] &&
      normalizeForMatching(criticalAlternateNames[searchLower]) === normalizedTarget
    ) {
      return { match: true, score: 1.0, strategy: "alternate-name" }
    }

    // Check if target is an alternate for search term
    if (
      criticalAlternateNames[targetLower] &&
      normalizeForMatching(criticalAlternateNames[targetLower]) === normalizedSearch
    ) {
      return { match: true, score: 1.0, strategy: "alternate-name" }
    }
  }

  // Strategy 2: Exact match (after normalization)
  if (normalizedSearch === normalizedTarget) {
    return { match: true, score: 1.0, strategy: "exact" }
  }

  // Strategy 3: Smart ingredient with modifiers matching
  // This catches "sunflower oil" in "organic sunflower oil" but not "sugar" in "powdered sugar"
  if (isIngredientWithModifiers(searchTerm, targetText)) {
    return { match: true, score: 0.95, strategy: "ingredient-with-modifiers" }
  }

  // Strategy 4: Reverse check - if target is the base ingredient of search term
  if (isIngredientWithModifiers(targetText, searchTerm)) {
    return { match: true, score: 0.95, strategy: "base-ingredient" }
  }

  // Strategy 5: Precise typo detection for whole terms
  // Only match if the strings are similar in length (reasonable for typos)
  if (isReasonableTypoLength(normalizedSearch, normalizedTarget, maxLengthDifference)) {
    const distance = levenshteinDistance(normalizedSearch, normalizedTarget)

    // Only consider it a match if the edit distance is small (indicating a typo)
    if (distance <= maxTypoDistance) {
      const similarity = calculateSimilarity(normalizedSearch, normalizedTarget)
      if (similarity >= exactMatchThreshold) {
        return { match: true, score: similarity, strategy: "typo-correction" }
      }
    }
  }

  // Strategy 6: Word-based matching for multi-word ingredients
  if (enableWordOrder) {
    const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 2)
    const targetWords = normalizedTarget.split(" ").filter((w) => w.length > 2)

    // Only proceed if both have multiple words
    if (searchWords.length > 1 && targetWords.length > 1) {
      let matchedWords = 0
      let totalScore = 0

      for (const searchWord of searchWords) {
        let bestWordMatch = 0

        for (const targetWord of targetWords) {
          // Only consider word matches if they're reasonable typo candidates
          if (isReasonableTypoLength(searchWord, targetWord, 2)) {
            const distance = levenshteinDistance(searchWord, targetWord)
            if (distance <= 1) {
              // Very strict for individual words
              const similarity = calculateSimilarity(searchWord, targetWord)
              bestWordMatch = Math.max(bestWordMatch, similarity)
            }
          }
        }

        if (bestWordMatch >= 0.8) {
          // High threshold for word matching
          matchedWords++
          totalScore += bestWordMatch
        }
      }

      // Require most words to match for multi-word matching
      const wordMatchRatio = matchedWords / searchWords.length
      if (wordMatchRatio >= 0.7 && matchedWords >= 2) {
        const avgScore = totalScore / matchedWords
        return { match: true, score: avgScore, strategy: "multi-word-typo" }
      }
    }
  }

  // No match found
  return { match: false, score: 0, strategy: "no-match" }
}

// Enhanced ingredient matching function
export function findIngredientMatches(lookingForIngredients, scannedIngredients, options = {}) {
  const matches = []
  const safe = []

  // Default options optimized for precise typo detection
  const defaultOptions = {
    exactMatchThreshold: 0.85,
    partialMatchThreshold: 0.75,
    enableWordOrder: true,
    enableAlternates: true,
    maxTypoDistance: 2,
    maxLengthDifference: 3,
    ...options,
  }

  for (const searchIngredient of lookingForIngredients) {
    let bestMatch = null
    let bestScore = 0

    for (const scannedIngredient of scannedIngredients) {
      const result = fuzzyMatch(searchIngredient, scannedIngredient, defaultOptions)

      if (result.match && result.score > bestScore) {
        bestMatch = {
          searchTerm: searchIngredient,
          foundIn: scannedIngredient,
          score: result.score,
          strategy: result.strategy,
        }
        bestScore = result.score
      }
    }

    if (bestMatch) {
      matches.push(bestMatch)
    } else {
      safe.push(searchIngredient)
    }
  }

  return { matches, safe }
}
