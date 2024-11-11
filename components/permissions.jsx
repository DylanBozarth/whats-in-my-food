// RequestPermissions.js
import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

const RequestPermissions = () => {
  const requestPermissions = async () => {
    // Request Camera permission
    const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
    handlePermissionStatus('Camera', cameraStatus);

    // Request Storage permission
    const storageStatus = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    handlePermissionStatus('Storage', storageStatus);

    // Request Access Media Location permission
    const mediaLocationStatus = await request(PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION);
    handlePermissionStatus('Media Location', mediaLocationStatus);
  };

  const handlePermissionStatus = (permissionName, status) => {
    if (status === RESULTS.GRANTED) {
      console.log(`${permissionName} permission granted`);
    } else if (status === RESULTS.DENIED) {
      console.log(`${permissionName} permission denied`);
    } else if (status === RESULTS.BLOCKED) {
      console.log(`${permissionName} permission permanently denied. Please enable it from settings.`);
      Alert.alert(
        `${permissionName} Permission`,
        `The ${permissionName} permission is required for this feature. Please enable it from settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Permissions</Text>
      <Button title="Request All Permissions" onPress={requestPermissions} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RequestPermissions;
