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

// Enhanced fuzzy matching with alternate name support
export function fuzzyMatch(searchTerm, targetText, options = {}) {
  const {
    exactMatchThreshold = 0.9,
    partialMatchThreshold = 0.75,
    enableSubstring = true,
    enableWordOrder = true,
    enableAlternates = true,
  } = options

  // Normalize both terms (this handles alternate names automatically)
  const normalizedSearch = normalizeForMatching(searchTerm)
  const normalizedTarget = normalizeForMatching(targetText)

  // Strategy 0: Check if either term has an alternate name that matches exactly
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

  // Strategy 1: Exact substring match
  if (enableSubstring) {
    if (normalizedTarget.includes(normalizedSearch) || normalizedSearch.includes(normalizedTarget)) {
      return { match: true, score: 1.0, strategy: "substring" }
    }
  }

  // Strategy 2: Word-based matching
  if (enableWordOrder) {
    const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 2)
    const targetWords = normalizedTarget.split(" ").filter((w) => w.length > 2)

    if (searchWords.length > 0 && targetWords.length > 0) {
      let matchedWords = 0

      for (const searchWord of searchWords) {
        for (const targetWord of targetWords) {
          const similarity = calculateSimilarity(searchWord, targetWord)
          if (similarity >= partialMatchThreshold) {
            matchedWords++
            break
          }
        }
      }

      const wordMatchScore = matchedWords / Math.max(searchWords.length, targetWords.length)
      if (wordMatchScore >= partialMatchThreshold) {
        return { match: true, score: wordMatchScore, strategy: "word-based" }
      }
    }
  }

  // Strategy 3: Overall string similarity
  const overallSimilarity = calculateSimilarity(normalizedSearch, normalizedTarget)

  if (overallSimilarity >= exactMatchThreshold) {
    return { match: true, score: overallSimilarity, strategy: "exact-fuzzy" }
  } else if (overallSimilarity >= partialMatchThreshold) {
    return { match: true, score: overallSimilarity, strategy: "partial-fuzzy" }
  }

  return { match: false, score: overallSimilarity, strategy: "no-match" }
}

// Enhanced ingredient matching function
export function findIngredientMatches(lookingForIngredients, scannedIngredients, options = {}) {
  const matches = []
  const safe = []

  for (const searchIngredient of lookingForIngredients) {
    let bestMatch = null
    let bestScore = 0

    for (const scannedIngredient of scannedIngredients) {
      const result = fuzzyMatch(searchIngredient, scannedIngredient, options)

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
