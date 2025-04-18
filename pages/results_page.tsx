"use client"

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect, useRef, useCallback } from "react"
import { useGlobalState } from "../components/global_variables"
import { Check, X, AlertTriangle, RefreshCw, Image as ImageIcon } from "react-native-feather"
import axios from "axios"

interface ResultsState {
  matchedIngredients: string[]
  safeIngredients: string[]
  productName: string
  imageUrl: string | null
}

const ResultsScreen = ({ route }: any) => {
  const navigation = useNavigation()
  const { lookingForThings, lastScanResult, setLastScanResult, lastScanBarcode, setLastScanBarcode } = useGlobalState()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [results, setResults] = useState<ResultsState>({
    matchedIngredients: [],
    safeIngredients: [],
    productName: "Scanned Product",
    imageUrl: null,
  })

  // Use a ref to track if we've processed data for the CURRENT barcode
  const processedBarcodeRef = useRef<number | null>(null)

  // Debug logging
  console.log("Results component rendered with state:", {
    isLoading,
    error,
    refreshing,
    processedBarcode: processedBarcodeRef.current,
    lastScanBarcode,
    lastScanResultLength: lastScanResult?.length || 0,
    lookingForThingsLength: lookingForThings?.length || 0,
  })

  // Reset state when a new barcode is detected
  useEffect(() => {
    if (lastScanBarcode && lastScanBarcode !== processedBarcodeRef.current) {
      console.log("New barcode detected, resetting state:", lastScanBarcode)
      setIsLoading(true)
      setError(false)
      setImageError(false)
      setResults({
        matchedIngredients: [],
        safeIngredients: [],
        productName: "Scanned Product",
        imageUrl: null,
      })
    }
  }, [lastScanBarcode])

  // Function to fetch product data
  const fetchProductData = async () => {
    if (!lastScanBarcode) return

    try {
      console.log("Making API request for barcode:", lastScanBarcode)
      const url = `https://world.openfoodfacts.org/api/v0/product/${lastScanBarcode}.json`
      const response = await axios.get(url, { timeout: 4000 })

      if (response.status === 200 && response.data.status === 1) {
        console.log("API request successful")

        // Extract the ingredients from the API response
        let ingredients = []
        let productName = `Product ${lastScanBarcode}`
        let imageUrl = null

        // Get product name if available
        if (response.data.product && response.data.product.product_name) {
          productName = response.data.product.product_name
        }

        // Get product image if available
        if (response.data.product) {
          // Try to get the front image first
          if (response.data.product.image_front_url) {
            imageUrl = response.data.product.image_front_url
          }
          // Fall back to the main image
          else if (response.data.product.image_url) {
            imageUrl = response.data.product.image_url
          }
          // Try other image fields if available
          else if (response.data.product.selected_images?.front?.display?.url) {
            imageUrl = response.data.product.selected_images.front.display.url
          } else if (response.data.product.selected_images?.front?.small?.url) {
            imageUrl = response.data.product.selected_images.front.small.url
          }
        }

        console.log("Product image URL:", imageUrl)

        // Check if the product has ingredients_text
        if (response.data.product && response.data.product.ingredients_text) {
          // Split the ingredients text by commas and clean up each ingredient
          ingredients = response.data.product.ingredients_text
            .split(",")
            .map((ingredient: string) => ingredient.trim())
            .filter((ingredient: string) => ingredient.length > 0)
        }
        // If no ingredients_text, try to get from ingredients array
        else if (
          response.data.product &&
          response.data.product.ingredients &&
          Array.isArray(response.data.product.ingredients)
        ) {
          ingredients = response.data.product.ingredients
            .map((ing: any) => ing.text || ing.id)
            .filter((text: string) => text)
        }

        console.log("Extracted ingredients:", ingredients)

        // Store the ingredients in global state
        setLastScanResult(ingredients)

        // Process the ingredients using the existing logic
        processData(ingredients, productName, imageUrl)

        // Mark this barcode as processed
        processedBarcodeRef.current = lastScanBarcode
      } else {
        console.warn("API request failed or product not found")
        setIsLoading(false)
        setRefreshing(false)
        setError(true)
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch product data. Please check your connection and try again.", [
        { text: "OK" },
      ])
      console.error("Error fetching product data:", err)
      setIsLoading(false)
      setRefreshing(false)
      setError(true)
    }
  }

  // Fetch product data when the screen loads or when barcode changes
  useEffect(() => {
    console.log("Results effect running, loading:", isLoading, "barcode:", lastScanBarcode)

    // Only fetch if we have a barcode and haven't processed THIS barcode yet
    if (lastScanBarcode && processedBarcodeRef.current !== lastScanBarcode && isLoading) {
      fetchProductData()

      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log("Timeout triggered after 10 seconds")
        if (isLoading) {
          console.log("Still loading after timeout, showing error")
          setIsLoading(false)
          setRefreshing(false)
          setError(true)
        }
      }, 10000) // 10 second timeout

      // Clear timeout if component unmounts or if loading completes
      return () => {
        console.log("Clearing timeout")
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, lastScanBarcode])

  // Process the data once we have ingredients
  const processData = (ingredients: string[], productName: string, imageUrl: string | null) => {
    try {
      console.log("Processing ingredients:", ingredients.length)

      // Process the ingredients
      const matched: string[] = []
      const safe: string[] = []

      // Check which ingredients from lookingForThings are in the ingredients list
      if (lookingForThings && lookingForThings.length > 0) {
        console.log("Processing lookingForThings:", lookingForThings.length)

        lookingForThings.forEach((ingredient: string) => {
          // Check if any of the scanned ingredients contain this ingredient
          // Using lowercase for case-insensitive comparison
          const found = ingredients.some((itemIngredient: string) =>
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
        productName: productName,
        imageUrl: imageUrl,
      })

      // Stop loading
      setIsLoading(false)
      setRefreshing(false)
      console.log("Data processed successfully, loading complete")
    } catch (err) {
      Alert.alert("Error", "Failed to process ingredients data.", [{ text: "OK" }])
      console.error("Error processing ingredients:", err)
      setIsLoading(false)
      setRefreshing(false)
      setError(true)
    }
  }

  const handleScanAnother = () => {
    console.log("Scan Another button pressed")
    // Reset the processed barcode ref so we can scan the same item again if needed
    processedBarcodeRef.current = null
    navigation.goBack()
  }

  const handleRetry = () => {
    // Reset processing state
    processedBarcodeRef.current = null
    setIsLoading(true)
    setError(false)
  }

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    console.log("Pull to refresh triggered")
    setRefreshing(true)
    // Reset the processed barcode ref so we can fetch the same barcode again
    processedBarcodeRef.current = null
    setImageError(false)

    // If we have a barcode, fetch the data again
    if (lastScanBarcode) {
      fetchProductData()
    } else {
      // If no barcode, just stop refreshing
      setRefreshing(false)
    }
  }, [lastScanBarcode])

  // Check if we need to show the "scan something" screen
  if (!lastScanBarcode && !isLoading && !error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <AlertTriangle width={48} height={48} color="#4361EE" />
          <Text style={styles.emptyStateTitle}>No Product Scanned</Text>
          <Text style={styles.emptyStateText}>You need to scan something first to see ingredient analysis.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleScanAnother}>
            <Text style={styles.retryButtonText}>Scan a Product</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (isLoading && !refreshing) {
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
          <TouchableOpacity style={styles.backButton} onPress={handleScanAnother}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4361EE"]}
            tintColor="#4361EE"
            title="Pull to refresh..."
            titleColor="#6c757d"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ingredient Check Results</Text>
          <Text style={styles.subtitle}>{results.productName}</Text>
          <Text style={styles.barcodeText}>Barcode: {lastScanBarcode}</Text>
        </View>

        {/* Product Image */}
        {results.imageUrl && !imageError ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: results.imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <ImageIcon width={48} height={48} color="#6c757d" />
            <Text style={styles.noImageText}>No product image available</Text>
          </View>
        )}

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

        {/* All Ingredients Section */}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>All Ingredients</Text>
          <View style={styles.ingredientsList}>
            {lastScanResult && lastScanResult.length > 0 ? (
              lastScanResult.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noIngredientsText}>No ingredients information available</Text>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleScanAnother}>
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
    marginBottom: 16,
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
    marginBottom: 4,
    textAlign: "center",
  },
  barcodeText: {
    fontSize: 14,
    color: "#6c757d",
  },
  imageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  noImageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noImageText: {
    marginTop: 12,
    color: "#6c757d",
    fontSize: 16,
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
  noIngredientsText: {
    fontSize: 15,
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
    padding: 12,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#495057",
    textAlign: "center",
    marginBottom: 24,
  },
})

export default ResultsScreen
