import React, {useRef, useEffect, useState} from 'react';
import {Image} from 'react-native';
import axios from 'axios';
import {showAlert} from '@/components/show_alert';
import {View, Text} from 'react-native';
import {useGlobalState} from '@/components/global_variables';
import {useFocusEffect} from '@react-navigation/native';

export default function ResultsPage() {
  const {
    foundIngredients,
    setFoundIngredients,
    lookingForThings,
    lastScanResult,
    setLastScanResult,
    setLastScanBarcode,
    lastScanBarcode,
  } = useGlobalState();

  const previousBarcode = useRef<number | null>(null); // Store the previous barcode
  const [productImage, setProductImage] = useState<string>(''); 

  const makeGetRequest = async (barcode: number) => {
    const url: string = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
      const response = await axios.get(url, {timeout: 8000});

      if (response.status === 200) {
        setLastScanResult(response.data.product.ingredients_text);
        console.log('Last scan result:', response.data.product.ingredients_text);
        setProductImage(response.data.product.image_url);
        console.log(productImage)
        return true;
      } else {
        console.warn('Scan failed with status:', response.status);
        showAlert('Scanning failure', 'The scan failed', true);
        return false;
      }
    } catch (e) {
      console.error('Error during request:', e);
      showAlert('Unknown error', `The error is ${e}`, true);
      return false;
    }
  };

  useFocusEffect(() => {
    if (lastScanBarcode !== previousBarcode.current) {
      previousBarcode.current = lastScanBarcode; // Update the previous barcode
      if (lastScanBarcode) {
        makeGetRequest(lastScanBarcode);
      }
    }
  });

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>📋 Results Page</Text>
      {lastScanBarcode ? (
        <Text>
          
          <Image
            source={{
              uri: `${productImage}`,
            }}
          />
          Scan result contains {lastScanResult}
        </Text>
      ) : (
        <Text>Scan something!</Text>
      )}
      <Text>{foundIngredients}</Text>
    </View>
  );
}
