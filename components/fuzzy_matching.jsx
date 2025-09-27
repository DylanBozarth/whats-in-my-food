import { normalizeIngredient, criticalAlternateNames } from "./food_list"

// ---------------- Levenshtein + Similarity ----------------

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
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
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

// ---------------- Normalization ----------------

export function normalizeForMatching(text) {
  let normalized = normalizeIngredient(text)

  normalized = normalized
    .replace(/[^\w\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ")    // normalize spaces
    .trim()
    .toLowerCase()

  return normalized
}

// ---------------- Helpers ----------------

function isReasonableTypoLength(str1, str2, maxLengthDifference = 3) {
  return Math.abs(str1.length - str2.length) <= maxLengthDifference
}

// NEW: simplified check → does the search term appear as whole words in the target?
function containsWholeWord(searchTerm, targetText) {
  const normalizedSearch = normalizeForMatching(searchTerm)
  const normalizedTarget = normalizeForMatching(targetText)

  const searchWords = normalizedSearch.split(" ").filter(Boolean)
  const targetWords = normalizedTarget.split(" ").filter(Boolean)

  return searchWords.every((word) => targetWords.includes(word))
}

// ---------------- Fuzzy Match ----------------

export function fuzzyMatch(searchTerm, targetText, options = {}) {
  const {
    exactMatchThreshold = 0.85,
    enableWordOrder = true,
    enableAlternates = true,
    maxTypoDistance = 2,
    maxLengthDifference = 3,
  } = options

  const normalizedSearch = normalizeForMatching(searchTerm)
  const normalizedTarget = normalizeForMatching(targetText)

  // 1. Alternate names
  if (enableAlternates) {
    const searchLower = searchTerm.toLowerCase().trim()
    const targetLower = targetText.toLowerCase().trim()

    if (
      criticalAlternateNames[searchLower] &&
      normalizeForMatching(criticalAlternateNames[searchLower]) === normalizedTarget
    ) {
      return { match: true, score: 1.0, strategy: "alternate-name" }
    }

    if (
      criticalAlternateNames[targetLower] &&
      normalizeForMatching(criticalAlternateNames[targetLower]) === normalizedSearch
    ) {
      return { match: true, score: 1.0, strategy: "alternate-name" }
    }
  }

  // 2. Exact match
  if (normalizedSearch === normalizedTarget) {
    return { match: true, score: 1.0, strategy: "exact" }
  }

  // 3. Whole-word containment
  if (containsWholeWord(searchTerm, targetText)) {
    return { match: true, score: 0.95, strategy: "contains-whole-word" }
  }

  // 4. Typo correction for whole terms
  if (isReasonableTypoLength(normalizedSearch, normalizedTarget, maxLengthDifference)) {
    const distance = levenshteinDistance(normalizedSearch, normalizedTarget)
    if (distance <= maxTypoDistance) {
      const similarity = calculateSimilarity(normalizedSearch, normalizedTarget)
      if (similarity >= exactMatchThreshold) {
        return { match: true, score: similarity, strategy: "typo-correction" }
      }
    }
  }

  // 5. Multi-word fuzzy typo handling (optional but still useful)
  if (enableWordOrder) {
    const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 2)
    const targetWords = normalizedTarget.split(" ").filter((w) => w.length > 2)

    if (searchWords.length > 1 && targetWords.length > 1) {
      let matchedWords = 0
      let totalScore = 0

      for (const searchWord of searchWords) {
        let bestWordMatch = 0
        for (const targetWord of targetWords) {
          if (isReasonableTypoLength(searchWord, targetWord, 2)) {
            const distance = levenshteinDistance(searchWord, targetWord)
            if (distance <= 1) {
              const similarity = calculateSimilarity(searchWord, targetWord)
              bestWordMatch = Math.max(bestWordMatch, similarity)
            }
          }
        }
        if (bestWordMatch >= 0.8) {
          matchedWords++
          totalScore += bestWordMatch
        }
      }

      const wordMatchRatio = matchedWords / searchWords.length
      if (wordMatchRatio >= 0.7 && matchedWords >= 2) {
        const avgScore = totalScore / matchedWords
        return { match: true, score: avgScore, strategy: "multi-word-typo" }
      }
    }
  }

  // 6. No match
  return { match: false, score: 0, strategy: "no-match" }
}

// ---------------- Bulk Matching ----------------

export function findIngredientMatches(lookingForIngredients, scannedIngredients, options = {}) {
  const matches = []
  const safe = []

  const defaultOptions = {
    exactMatchThreshold: 0.85,
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
