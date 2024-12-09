import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { makeGetRequest } from './api.js';

export const handleBarcodeScan = async (onUpdate: Function, foundThings: String[], navigation) => {
  navigation.navigate('BarcodeScanner', {
    onScanned: async (res: any) => {  // TODO find out what type this would be
      if (typeof res === 'string') {
        onUpdate(res); 
        makeGetRequest(res, foundThings, navigation); 
      }
    },
  });
};
