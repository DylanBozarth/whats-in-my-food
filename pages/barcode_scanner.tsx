"use client"

import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { useState, useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useGlobalState } from "../components/global_variables"

export const StartCamera = ({ navigation }: { navigation: any }) => {
  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [scanningEnabled, setScanningEnabled] = useState(true)
  const lastScanned = useRef<number>(0) // Ref to track the last scanned timestamp
  const { setLastScanBarcode } = useGlobalState()

  useFocusEffect(() => {
    // Reset states when screen gains focus
    lastScanned.current = 0
    setScanningEnabled(true) // Re-enable scanning when returning to this screen
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

  const handleBarCodeScanned = (barcode: number) => {
    // Simple debounce to prevent multiple scans
    const now = Date.now()
    if (now - lastScanned.current < 1000 || !scanningEnabled) {
      return
    }

    // Immediately disable scanning and update timestamp
    lastScanned.current = now
    setScanningEnabled(false)

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

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.fullscreenCamera}
        facing={facing}
        onBarcodeScanned={
          scanningEnabled
            ? (data: any) => {
                handleBarCodeScanned(data.data)
              }
            : undefined
        }
      >
        <View style={styles.overlay}>
          <View style={styles.scannerGuide}>
            <Text style={styles.scannerText}>Align barcode within frame</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
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

