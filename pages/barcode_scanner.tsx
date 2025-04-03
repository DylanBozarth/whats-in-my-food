"use client"

import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { useState, useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useGlobalState } from "../components/global_variables"

// Import axios at the top of the file with other imports
import axios from "axios"

export const StartCamera = ({ navigation }: { navigation: any }) => {
  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [isProcessing, setIsProcessing] = useState(false)
  const scanning = useRef(false) // Ref to track scanning state
  const lastScanned = useRef<number>(0) // Ref to track the last scanned timestamp
  const {
    foundIngredients,
    setFoundIngredients,
    lookingForThings,
    setLookingForThings,
    lastScanResult,
    setLastScanResult,
    lastScanBarcode,
    setLastScanBarcode,
  } = useGlobalState()

  useFocusEffect(() => {
    scanning.current = false // Reset scanning state when screen gains focus
    lastScanned.current = 0 // Reset timestamp for debouncing
    setIsProcessing(false) // Reset processing state
  })

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    )
  }

  // Replace the handleBarCodeScanned function with this implementation
  const handleBarCodeScanned = async (barcode: number) => {
    const now = Date.now()
    if (now - lastScanned.current < 2000) {
      return
    }

    if (scanning.current) {
      console.log("Scan already in progress, skipping...")
      return
    }

    lastScanned.current = now
    scanning.current = true // Lock scanning
    setIsProcessing(true) // Show loading indicator

    try {
      console.log("Barcode scanned:", barcode)
      setLastScanBarcode(barcode)

      // Make the actual API call to OpenFoodFacts
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`

      try {
        console.log("Making API request to OpenFoodFacts")
        const response = await axios.get(url, { timeout: 4000 })

        if (response.status === 200 && response.data.status === 1) {
          console.log("API request successful")

          // Extract the ingredients from the API response
          let ingredients = []

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
            ingredients = response.data.product.ingredients.map((ing: any) => ing.text || ing.id).filter((text: string) => text)
          }

          console.log("Extracted ingredients:", ingredients)

          // Store just the ingredients array in global state
          setLastScanResult(ingredients)

          // Navigate to results screen
          navigation.navigate("Results")
        } else {
          console.warn("API request failed or product not found:", response.status)
          setLastScanResult([])
          navigation.navigate("Results") // Still navigate to results for error handling
        }
      } catch (apiError) {
        console.error("Error fetching ingredients:", apiError)
        setLastScanResult([])
        navigation.navigate("Results") // Still navigate to results, the error handling is there
      }
    } catch (error) {
      console.error("Error scanning barcode:", error)
      setIsProcessing(false)
    } finally {
      scanning.current = false // Unlock scanning after completion
      // Don't set isProcessing to false here, let the Results screen handle it
    }
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.fullscreenCamera}
        facing={facing}
        onBarcodeScanned={
          isProcessing
            ? undefined
            : (data: any) => {
                handleBarCodeScanned(data.data)
              }
        }
      >
        <View style={styles.overlay}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.processingText}>Processing barcode...</Text>
            </View>
          ) : (
            <View style={styles.scannerGuide}>
              <Text style={styles.scannerText}>Align barcode within frame</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isProcessing && styles.disabledButton]}
            onPress={toggleCameraFacing}
            disabled={isProcessing}
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "#FFFFFF",
  },
  fullscreenCamera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 20,
    marginTop: 100,
  },
  processingText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 10,
  },
  scannerGuide: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  scannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 4,
  },
})

