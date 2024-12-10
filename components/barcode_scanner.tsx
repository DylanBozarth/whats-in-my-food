import { Camera, useCameraDevice, useFrameProcessor, CameraPermissionStatus } from 'react-native-vision-camera';
import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { useState, useEffect } from 'react';
import 'react-native-reanimated';

/**
 * Custom hook to scan barcodes using Vision Camera
 * Handles camera permission before starting the scanner
 * @returns {Object} - { device, barcode, ScanningComponent, hasPermission }
 */
export const useBarcodeScanner = () => {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const device = useCameraDevice('back');

  // Frame processor to scan barcodes
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const barcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS]);

    if (barcodes.length > 0) {
      const scannedValue = barcodes[0]?.displayValue;
      if (scannedValue) {
        setBarcode(scannedValue);
      }
    }
  }, []);

  // Check and request camera permissions
  useEffect(() => {
    (async () => {
      const status: CameraPermissionStatus = await Camera.getCameraPermissionStatus();
      if (status === 'not-determined' || status === 'denied') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      } else {
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  const ScanningComponent = () => {
    if (!hasPermission) {
      return null; // No camera permission
    }

    return device ? (
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
    ) : null;
  };

  return { device, barcode, ScanningComponent, hasPermission };
};
