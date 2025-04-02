"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect, useRef } from "react"
import { useGlobalState } from "../components/global_variables"
import { Check, X, AlertTriangle, RefreshCw } from "react-native-feather"

interface ResultsState {
  matchedIngredients: string[]
  safeIngredients: string[]
  productName: string
}

const ResultsScreen = ({ route }: any) => {
  const navigation = useNavigation()
  const { lookingForThings, lastScanResult, lastScanBarcode } = useGlobalState()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [results, setResults] = useState<ResultsState>({
    matchedIngredients: [],
    safeIngredients: [],
    productName: "Scanned Product",
  })

  // Use a ref to track if we've processed data
  const hasProcessedData = useRef(false)

  // Debug logging
  console.log("Component rendered with state:", {
    isLoading,
    error,
    hasProcessedData: hasProcessedData.current,
    lastScanResultLength: lastScanResult?.length || 0,
    lookingForThingsLength: lookingForThings?.length || 0,
  })

  useEffect(() => {
    console.log("Effect running, loading:", isLoading)

    // Only set up the timeout if we're still loading and haven't processed data
    if (isLoading && !hasProcessedData.current) {
      console.log("Setting up timeout")

      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log("Timeout triggered after 10 seconds")
        if (isLoading && !hasProcessedData.current) {
          console.log("Still loading after timeout, showing error")
          setIsLoading(false)
          setError(true)
        }
      }, 10000) // 10 second timeout

      // Clear timeout if component unmounts or if loading completes
      return () => {
        console.log("Clearing timeout")
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading])

  // Separate effect to process data
  useEffect(() => {
    console.log("Data processing effect running")

    // Don't process if we're not loading or already processed
    if (!isLoading || hasProcessedData.current) {
      console.log("Skipping processing - not loading or already processed")
      return
    }

    try {
      // Check if we have scan results
      if (lastScanResult && lastScanResult.length > 0) {
        console.log("Processing scan results:", lastScanResult.length)

        // Process the ingredients
        const matched: string[] = []
        const safe: string[] = []

        // Check which ingredients from lookingForThings are in lastScanResult
        if (lookingForThings && lookingForThings.length > 0) {
          console.log("Processing lookingForThings:", lookingForThings.length)

          lookingForThings.forEach((ingredient: string) => {
            // Check if any of the scanned ingredients contain this ingredient
            // Using lowercase for case-insensitive comparison
            const found = lastScanResult.some((itemIngredient: string) =>
              itemIngredient.toLowerCase().includes(ingredient.toLowerCase()),
            )

            if (found) {
              matched.push(ingredient)
            } else {
              safe.push(ingredient)
            }
          })

          console.log("Matched ingredients:", matched.length)
          console.log("Safe ingredients:", safe.length)
        }

        setResults({
          matchedIngredients: matched,
          safeIngredients: safe,
          productName: `Product ${lastScanBarcode || ""}`,
        })

        // Mark as processed and stop loading
        hasProcessedData.current = true
        setIsLoading(false)
        console.log("Data processed successfully, loading complete")
      } else {
        console.log("No scan results yet, continuing to wait")
        // Keep loading, don't set error yet
      }
    } catch (err) {
      console.error("Error processing ingredients:", err)
      setIsLoading(false)
      setError(true)
    }
  }, [lastScanResult, lookingForThings, lastScanBarcode, isLoading])

  const handleRetry = () => {
    console.log("Retry button pressed")
    // Reset state for retry
    hasProcessedData.current = false
    setIsLoading(true)
    setError(false)

    // Simulate a fresh load by waiting a moment before checking global state again
    setTimeout(() => {
      console.log("Retry timeout complete, checking data")
      if (lastScanResult && lastScanResult.length > 0) {
        console.log("Data available for retry")
        // Re-run the analysis logic
        const matched: string[] = []
        const safe: string[] = []

        if (lookingForThings && lookingForThings.length > 0) {
          lookingForThings.forEach((ingredient: string) => {
            const found = lastScanResult.some((itemIngredient: string) =>
              itemIngredient.toLowerCase().includes(ingredient.toLowerCase()),
            )

            if (found) {
              matched.push(ingredient)
            } else {
              safe.push(ingredient)
            }
          })
        }

        setResults({
          matchedIngredients: matched,
          safeIngredients: safe,
          productName: `Product ${lastScanBarcode || ""}`,
        })

        hasProcessedData.current = true
        setIsLoading(false)
      } else {
        console.log("No data available after retry")
        setIsLoading(false)
        setError(true)
      }
    }, 1000)
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361EE" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Analyzing ingredients...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle width={48} height={48} color="#FF4D6D" />
          <Text style={styles.errorTitle}>Unable to analyze ingredients</Text>
          <Text style={styles.errorText}>We couldn't process the ingredient data. This might be because:</Text>
          <View style={styles.errorList}>
            <Text style={styles.errorListItem}>• No ingredients were detected</Text>
            <Text style={styles.errorListItem}>• The scan was incomplete</Text>
            <Text style={styles.errorListItem}>• There was a connection issue</Text>
          </View>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <RefreshCw width={20} height={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Ingredient Check Results</Text>
          <Text style={styles.subtitle}>{results.productName}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          {results.matchedIngredients.length > 0 ? (
            <View style={styles.warningContainer}>
              <AlertTriangle width={32} height={32} color="#FF4D6D" />
              <Text style={styles.warningText}>
                This product contains {results.matchedIngredients.length} ingredient
                {results.matchedIngredients.length !== 1 ? "s" : ""} you're watching for
              </Text>
            </View>
          ) : (
            <View style={styles.safeContainer}>
              <Check width={32} height={32} color="#4CC9BE" />
              <Text style={styles.safeText}>This product doesn't contain any ingredients you're watching for</Text>
            </View>
          )}
        </View>

        {/* All Ingredients Section */}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>All Ingredients</Text>
          <View style={styles.ingredientsList}>
            {lastScanResult &&
              lastScanResult.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Matched Ingredients Section */}
        {results.matchedIngredients.length > 0 && (
          <View style={styles.matchedContainer}>
            <Text style={styles.sectionTitle}>Found Ingredients You're Watching For</Text>
            <View style={styles.ingredientsList}>
              {results.matchedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.matchedItem}>
                  <X width={20} height={20} color="#FF4D6D" />
                  <Text style={styles.matchedText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Safe Ingredients Section */}
        {results.safeIngredients.length > 0 && (
          <View style={styles.safeIngredientsContainer}>
            <Text style={styles.sectionTitle}>Not Found in This Product</Text>
            <View style={styles.ingredientsList}>
              {results.safeIngredients.map((ingredient, index) => (
                <View key={index} style={styles.safeItem}>
                  <Check width={20} height={20} color="#4CC9BE" />
                  <Text style={styles.safeItemText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Text style={styles.secondaryButtonText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#495057",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#495057",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#495057",
    textAlign: "center",
    marginBottom: 16,
  },
  errorList: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  errorListItem: {
    fontSize: 15,
    color: "#495057",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#4361EE",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#4361EE",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  backButtonText: {
    color: "#4361EE",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(255, 77, 109, 0.1)",
    borderRadius: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4D6D",
    marginLeft: 12,
    flex: 1,
  },
  safeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(76, 201, 190, 0.1)",
    borderRadius: 12,
  },
  safeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CC9BE",
    marginLeft: 12,
    flex: 1,
  },
  ingredientsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchedContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  safeIngredientsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 16,
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 15,
    color: "#495057",
  },
  matchedItem: {
    backgroundColor: "rgba(255, 77, 109, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  matchedText: {
    fontSize: 15,
    color: "#FF4D6D",
    marginLeft: 8,
    fontWeight: "500",
  },
  safeItem: {
    backgroundColor: "rgba(76, 201, 190, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  safeItemText: {
    fontSize: 15,
    color: "#4CC9BE",
    marginLeft: 8,
    fontWeight: "500",
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4361EE",
  },
  secondaryButtonText: {
    color: "#4361EE",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ResultsScreen

