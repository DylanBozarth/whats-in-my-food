"use client"

import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { useState, useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useGlobalState } from "../components/global_variables"

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

  const handleBarCodeScanned = async (barcode: number) => {
    const now = Date.now()
    if (now - lastScanned.current < 2000) {
      //console.log('Skipping scan due to debounce');
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

      // Simulate fetching ingredient data
      // In a real app, you would call your API here
      try {
        // Example: const ingredients = await MakeApiCalls.getIngredients(barcode);

        // For testing, let's simulate an API call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate some ingredient data (replace with your actual API call)
        const mockIngredients = ["Water", "Sugar", "Natural Flavors", "Citric Acid", "Sodium Citrate"]

        // Set the ingredients in the global state
        setLastScanResult(mockIngredients)

        // Navigate to results screen
        navigation.navigate("Results")
      } catch (apiError) {
        console.error("Error fetching ingredients:", apiError)
        // Still navigate to results, the error handling is there
        setLastScanResult([])
        navigation.navigate("Results")
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

