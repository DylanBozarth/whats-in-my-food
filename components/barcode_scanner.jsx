import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { makeGetRequest } from './api.tsx';

// Function to handle barcode scanning and API request
export const handleBarcodeScan = async (onUpdate, foundThings, navigation) => {
  navigation.navigate('BarcodeScanner', {
    onScanned: async (res) => {
      if (typeof res === 'string') {
        onUpdate(res); // Call the callback to update the state
        makeGetRequest(res, foundThings, navigation); // Make API request with scanned barcode
      }
    },
  });
};
