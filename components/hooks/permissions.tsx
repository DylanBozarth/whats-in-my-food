/*import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { useEffect, useState } from 'react';

export function useCameraPermission() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  // Check current permission status
  const checkPermission = async () => {
    const status: CameraPermissionStatus = await Camera.getCameraPermissionStatus();
    setHasPermission(status === 'granted'); // Compare with the correct enum value
    return status;
  };

  // Request camera permission
  const requestPermission = async () => {
    const status: CameraPermissionStatus = await Camera.requestCameraPermission();
    setHasPermission(status === 'granted'); // Compare with the correct enum value
    return status;
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return { hasPermission, requestPermission };
}
*/