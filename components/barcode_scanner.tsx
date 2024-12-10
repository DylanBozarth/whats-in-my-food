// scanBarcode.tsx
import React, { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, View } from 'react-native';

export const ScanBarcode = ({ onClose }: { onClose: () => void }) => {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />; // Permissions still loading

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Button title="Grant Camera Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" />
      <Button title="Close Camera" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
});
