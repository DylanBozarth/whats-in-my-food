import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGlobalState } from './global_variables';

export const StartCamera = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false); // State to toggle camera
  const { lastScanResult, setLastScanResult } = useGlobalState();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setLastScanResult(data);
    console.log(data);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleCameraVisibility = () => {
    setCameraVisible(!cameraVisible);
  };

  interface BarcodeScanningResult {
    data: string;
    type: string;
  }

  return (
    <View style={styles.container}>
      {cameraVisible ? (
        <CameraView
          style={styles.fullscreenCamera} // Fullscreen style
          facing={facing}
          onBarcodeScanned={(scanningResult: BarcodeScanningResult) => {
            handleBarCodeScanned(scanningResult.data);
          }}
        >
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCameraVisibility}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <Button title="Open Camera" onPress={toggleCameraVisibility} />
      )}
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
