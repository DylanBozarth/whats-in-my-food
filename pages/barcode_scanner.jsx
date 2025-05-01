"use client"

import React, { useState, useRef } from "react"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useGlobalState } from "../components/global_variables"

export const StartCamera = ({ navigation }) => {
  const [facing, setFacing] = useState("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [scanningEnabled, setScanningEnabled] = useState(true)
  const lastScanned = useRef(0) // Ref to track the last scanned timestamp
  const { setLastScanBarcode } = useGlobalState()

  // Reset function to enable scanning again
  const resetScannerState = () => {
    console.log("Resetting scanner state - enabling scanning")
    lastScanned.current = 0
    setScanningEnabled(true)
    // DO NOT reset the lastScanBarcode here - that would break the results page
  }

  // Use useFocusEffect to reset scanner when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log("Scanner screen focused via useFocusEffect")
      resetScannerState()

      return () => {
        console.log("Scanner screen unfocused via useFocusEffect")
      }
    }, []),
  )

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
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.fullscreenCamera}
        facing={facing}
        onBarcodeScanned={
          scanningEnabled
            ? (data) => {
                handleBarCodeScanned(data.data)
              }
            : undefined
        }
      >
        <View style={styles.overlay}>
          <View style={styles.scannerStatus}>
            <Text style={styles.statusText}>Scanner {scanningEnabled ? "Ready" : "Disabled"}</Text>
          </View>

          <View style={styles.scannerGuide}>
            <Text style={styles.scannerText}>Align barcode within frame</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>

            {!scanningEnabled && (
              <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={manualReset}>
                <Text style={styles.text}>Reset Scanner</Text>
              </TouchableOpacity>
            )}
          </View>
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
})
