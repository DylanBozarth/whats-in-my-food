import React from 'react';
import { Image, StyleSheet, Platform, View, Text, Button } from 'react-native';
//import { useCameraPermission } from '../components/hooks/permissions';
import { makeGetRequest } from '@/components/api';
import  barcodeScanner  from '@/components/barcode_scanner';

export default function HomeScreen() {
  return (
    <View>
      <Text>Yeah</Text>
      <Button title={"camera"} onPress={() => barcodeScanner()} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

