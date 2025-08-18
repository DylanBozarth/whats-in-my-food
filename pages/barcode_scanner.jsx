"use client"

import React, { useState, useRef, useEffect } from "react"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Button, StyleSheet, Text, TouchableOpacity, View, Platform, ActivityIndicator } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useGlobalState } from "../components/global_variables"

export const StartCamera = ({ navigation }) => {
  const [facing, setFacing] = useState("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [scanningEnabled, setScanningEnabled] = useState(true)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const lastScanned = useRef(0) // Ref to track the last scanned timestamp
  const { setLastScanBarcode } = useGlobalState()
  const cameraViewRef = useRef(null)
  const mountTimeoutRef = useRef(null)

  // Reset function to enable scanning again
  const resetScannerState = () => {
    console.log("Resetting scanner state - enabling scanning")
    lastScanned.current = 0
    setScanningEnabled(true)
    // DO NOT reset the lastScanBarcode here - that would break the results page
  }

  // Handle camera ready state
  const onCameraReady = () => {
    console.log("Camera is ready")
    setIsCameraReady(true)
    if (mountTimeoutRef.current) {
      clearTimeout(mountTimeoutRef.current)
      mountTimeoutRef.current = null
    }
  }

  // Initialize camera with delay for Android
  const initializeCamera = () => {
    console.log("Initializing camera...")
    setIsCameraReady(false)

    // Clear any existing timeout
    if (mountTimeoutRef.current) {
      clearTimeout(mountTimeoutRef.current)
    }

    // Set a timeout to detect if camera fails to initialize
    mountTimeoutRef.current = setTimeout(() => {
      if (!isCameraReady) {
        console.log("Camera initialization timed out, retrying...")
        setIsVisible(false)

        // Wait a moment and try again
        setTimeout(() => {
          setIsVisible(true)
        }, 500)
      }
    }, 3000)
  }

  // Use useFocusEffect to reset scanner when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log("Scanner screen focused via useFocusEffect")
      resetScannerState()
      setIsVisible(true)

      // For Android, we need to delay camera initialization slightly
      if (Platform.OS === "android") {
        setTimeout(() => {
          initializeCamera()
        }, 300)
      } else {
        initializeCamera()
      }

      return () => {
        console.log("Scanner screen unfocused via useFocusEffect")
        setIsVisible(false)
        if (mountTimeoutRef.current) {
          clearTimeout(mountTimeoutRef.current)
          mountTimeoutRef.current = null
        }
      }
    }, []),
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current)
      }
    }
  }, [])

  const handleBarCodeScanned = (barcode) => {
    // Simple debounce to prevent multiple scans
    const now = Date.now()
    if (now - lastScanned.current < 1000 || !scanningEnabled) {
      console.log("Scan ignored: debounce or scanning disabled", {
        timeSinceLastScan: now - lastScanned.current,
        scanningEnabled,
      })
      return
    }

    // Immediately disable scanning and update timestamp
    lastScanned.current = now
    setScanningEnabled(false)
    console.log("Scanning disabled after successful scan")

    // Set the barcode in global state
    console.log("Barcode scanned:", barcode)
    setLastScanBarcode(barcode)

    // Navigate immediately to results page
    // The results page will handle the API call and loading state
    navigation.navigate("Results")
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  // Add a manual reset button for testing
  const manualReset = () => {
    console.log("Manual reset triggered")
    resetScannerState()
    setIsVisible(false)
    setTimeout(() => {
      setIsVisible(true)
      initializeCamera()
    }, 500)
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4361EE" />
        <Text style={styles.message}>Please grant camera permission so that we can scan barcodes.</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please grant camera permission in order to scan barcodes</Text>
        <Button onPress={requestPermission} title="Continue" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isVisible && (
        <CameraView
          ref={cameraViewRef}
          style={styles.fullscreenCamera}
          facing={facing}
          onCameraReady={onCameraReady}
          onBarcodeScanned={
            scanningEnabled && isCameraReady
              ? (data) => {
                  handleBarCodeScanned(data.data)
                }
              : undefined
          }
        >
          <View style={styles.overlay}>
            <View style={styles.scannerStatus}>
              <Text style={styles.statusText}>Scanner {isCameraReady ? "Ready" : "Initializing..."}</Text>
            </View>

            <View style={styles.scannerGuide}>
              <Text style={styles.scannerText}>Align barcode within frame</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>

              {!isCameraReady && (
                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={manualReset}>
                  <Text style={styles.text}>Reset Camera</Text>
                </TouchableOpacity>
              )}

              {!scanningEnabled && isCameraReady && (
                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetScannerState}>
                  <Text style={styles.text}>Reset Scanner</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CameraView>
      )}

      {!isVisible && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361EE" />
          <Text style={styles.loadingText}>Preparing camera...</Text>
        </View>
      )}
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
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
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
  scannerStatus: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 4,
    marginTop: 40,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  },
  text: {
    fontSize: 18,
    color: "white",
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
  retryButton: {
    backgroundColor: "#4361EE",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "80%",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
  },
})
