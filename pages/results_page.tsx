"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import { useGlobalState } from "@/components/global_variables"
import { useFocusEffect } from "@react-navigation/native"

export default function ResultsPage({ navigation }: { navigation: any }) {
  const {
    foundIngredients,
    setFoundIngredients,
    lookingForThings,
    lastScanResult,
    setLastScanResult,
    lastScanBarcode,
    setLastScanBarcode,
  } = useGlobalState()

  const previousBarcode = useRef<number | null>(null)
  const [productImage, setProductImage] = useState<string>("")
  const [productName, setProductName] = useState<string>("")
  const [productBrand, setProductBrand] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedIngredients, setParsedIngredients] = useState<string[]>([])

  const makeGetRequest = async (barcode: number) => {
    setIsLoading(true)
    setError(null)
    const url: string = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`

    try {
      const response = await axios.get(url, { timeout: 8000 })

      if (response.status === 200 && response.data.status === 1) {
        const product = response.data.product

        // Set product details
        setProductName(product.product_name || "Unknown Product")
        setProductBrand(product.brands || "")
        setProductImage(product.image_front_url || product.image_small_url || "")

        // Set ingredients text
        const ingredientsText = product.ingredients_text || ""
        await new Promise<void>((resolve) => {
          setLastScanResult(ingredientsText)
          resolve()
        })

        // Parse ingredients into an array
        parseIngredientsText(ingredientsText)

        setIsLoading(false)
        return true
      } else {
        setError("Product not found in database")
        setIsLoading(false)
        return false
      }
    } catch (e) {
      console.error("Error during request:", e)
      setError("Failed to fetch product information")
      setIsLoading(false)
      return false
    }
  }

  const parseIngredientsText = (text: string) => {
    if (!text) {
      setParsedIngredients([])
      return
    }

    // Split by common ingredient separators
    const ingredients = text
      .replace(/$$[^)]*$$/g, "") // Remove content in parentheses
      .split(/,|;|\.|•/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    setParsedIngredients(ingredients)
  }

  const findMatches = () => {
    if (!lastScanResult || !lookingForThings.length) {
      setFoundIngredients([])
      return
    }

    const lookingForLower = lookingForThings.map((item: any) => item.toLowerCase())

    // Check each ingredient against our filter list
    const matches = lookingForLower.filter((ingredient: any) => {
      // Check if the ingredient is in the full text
      const inFullText = lastScanResult.toLowerCase().includes(ingredient)

      // Check if it's in any of the parsed ingredients
      const inParsedIngredients = parsedIngredients.some((item) => item.toLowerCase().includes(ingredient))

      return inFullText || inParsedIngredients
    })

    const uniqueMatches = [...new Set(matches)]
    setFoundIngredients(uniqueMatches)
  }

  useEffect(() => {
    if (lastScanResult !== undefined) {
      findMatches()
    }
  }, [lastScanResult, parsedIngredients, lookingForThings])

  useFocusEffect(
    React.useCallback(() => {
      if (lastScanBarcode !== previousBarcode.current) {
        previousBarcode.current = lastScanBarcode
        if (lastScanBarcode) {
          makeGetRequest(lastScanBarcode)
        }
      }
      return () => {}
    }, [lastScanBarcode]),
  )

  const scanAgain = () => {
    navigation.navigate("Scanner")
  }

  const goHome = () => {
    navigation.navigate("Home")
  }

  const renderIngredientItem = (ingredient: string, index: number) => {
    const isMatched = foundIngredients.some((match: string) => ingredient.toLowerCase().includes(match.toLowerCase()))

    return (
      <View key={`${ingredient}-${index}`} style={[styles.ingredientItem, isMatched && styles.matchedIngredient]}>
        <Text style={[styles.ingredientText, isMatched && styles.matchedIngredientText]}>
          {ingredient}
          {isMatched && <Text style={styles.warningText}> (⚠️ Flagged)</Text>}
        </Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching product information...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={scanAgain}>
          <Text style={styles.actionButtonText}>Scan Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={goHome}>
          <Text style={styles.secondaryButtonText}>Go Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (!lastScanBarcode) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="barcode-outline" size={64} color="#8E8E93" />
        <Text style={styles.emptyTitle}>No Scan Results</Text>
        <Text style={styles.emptyText}>Scan a product barcode to see results</Text>
        <TouchableOpacity style={styles.actionButton} onPress={scanAgain}>
          <Text style={styles.actionButtonText}>Scan a Product</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goHome}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Results</Text>
          <TouchableOpacity style={styles.scanButton} onPress={scanAgain}>
            <Ionicons name="scan-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            {productImage ? (
              <Image source={{ uri: productImage }} style={styles.productImage} resizeMode="contain" />
            ) : (
              <View style={styles.noImageContainer}>
                <Ionicons name="image-outline" size={40} color="#8E8E93" />
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{productName}</Text>
              {productBrand ? <Text style={styles.productBrand}>{productBrand}</Text> : null}
              <Text style={styles.barcodeText}>Barcode: {lastScanBarcode}</Text>
            </View>
          </View>

          <View style={styles.resultSummary}>
            {foundIngredients.length > 0 ? (
              <View style={styles.warningContainer}>
                <Ionicons name="warning-outline" size={24} color="#FF9500" />
                <Text style={styles.warningTitle}>
                  Found {foundIngredients.length} flagged {foundIngredients.length === 1 ? "ingredient" : "ingredients"}
                </Text>
              </View>
            ) : lookingForThings.length > 0 ? (
              <View style={styles.safeContainer}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#34C759" />
                <Text style={styles.safeTitle}>No flagged ingredients found</Text>
              </View>
            ) : (
              <View style={styles.infoContainer}>
                <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                <Text style={styles.infoTitle}>No ingredients are being filtered</Text>
              </View>
            )}
          </View>

          {foundIngredients.length > 0 && (
            <View style={styles.matchesContainer}>
              <Text style={styles.sectionTitle}>Flagged Ingredients:</Text>
              {foundIngredients.map((ingredient: any, index: number) => (
                <View key={index} style={styles.matchItem}>
                  <Ionicons name="alert-circle" size={20} color="#FF9500" />
                  <Text style={styles.matchText}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {parsedIngredients.length > 0 ? (
              parsedIngredients.map((ingredient, index) => renderIngredientItem(ingredient, index))
            ) : lastScanResult ? (
              <Text style={styles.rawIngredientsText}>{lastScanResult}</Text>
            ) : (
              <Text style={styles.noIngredientsText}>No ingredients information available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  scanButton: {
    padding: 8,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  barcodeText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  resultSummary: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  warningTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
  },
  safeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  safeTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#34C759",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  matchesContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFF9EB",
    borderWidth: 1,
    borderColor: "#FFE4B5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  matchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  matchText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: "#f8f8f8",
  },
  matchedIngredient: {
    backgroundColor: "#FFF9EB",
    borderWidth: 1,
    borderColor: "#FFE4B5",
  },
  ingredientText: {
    fontSize: 14,
  },
  matchedIngredientText: {
    fontWeight: "500",
  },
  warningText: {
    color: "#FF9500",
    fontWeight: "600",
  },
  rawIngredientsText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  noIngredientsText: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

