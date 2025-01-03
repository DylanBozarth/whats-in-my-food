import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MakeApiCalls } from './api';

export const StartCamera = ({ navigation }: { navigation: any }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const scanning = useRef(false); // Ref to track scanning state
  const lastScanned = useRef<number>(0); // Ref to track the last scanned timestamp

  useFocusEffect(() => {
    scanning.current = false; // Reset scanning state when screen gains focus
    lastScanned.current = 0; // Reset timestamp for debouncing
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async (barcode: Number) => {
    const now = Date.now();

    // Debounce: Allow scans only every 2 seconds
    if (now - lastScanned.current < 2000) {
      console.log("Skipping scan due to debounce");
      return;
    }

    if (scanning.current) {
      console.log("Scan already in progress, skipping...");
      return;
    }

    lastScanned.current = now; // Update last scanned time
    scanning.current = true; // Lock scanning

    try {
      console.log("Barcode scanned:", barcode);
      await MakeApiCalls(barcode); // Call the API
      navigation.navigate('Results'); // Navigate to Results
    } catch (error) {
      console.error('Error scanning barcode:', error);
    } finally {
      scanning.current = false; // Unlock scanning after completion
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.fullscreenCamera}
        facing={facing}
        onBarcodeScanned={(data: any) => {
          handleBarCodeScanned(data.data);
        }}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  fullscreenCamera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
