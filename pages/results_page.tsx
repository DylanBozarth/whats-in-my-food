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

  //https://world.openfoodfacts.org/api/v0/product/884912359414.json
  const previousBarcode = useRef<number | null>(null);
  const [productImage, setProductImage] = useState<string>('');

  const makeGetRequest = async (barcode: number) => {
    const url: string = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
      const response = await axios.get(url, {timeout: 8000});

      if (response.status === 200) {
        setLastScanResult(response.data.product.ingredients_text);
        
        console.log(
          'Last scan result:',
          lastScanResult,
        );
        setProductImage(response.data.product.image_small_url);
        findMatches();
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

  const findMatches = () => {
    const lastScanIngredients = lastScanResult
      .toLowerCase() // Convert to lowercase
      .split(', ') // Split into an array of ingredients
      .map((ingredient: string) => ingredient.trim()); // Remove extra spaces

    const lookingForIngredients = lookingForThings.map((ingredient: string) =>
      ingredient.toLowerCase(),
    ); 

    // Step 2: Find matches
    const matches = lookingForIngredients.filter((ingredient: any) =>
      lastScanIngredients.includes(ingredient),
    );

    // Step 3: Remove duplicates (if any)
    const uniqueMatches = [...new Set(matches)];

    console.log('Matches:', uniqueMatches);
    setFoundIngredients(uniqueMatches);
  };
  useFocusEffect(() => {
    if (lastScanBarcode !== previousBarcode.current) {
      previousBarcode.current = lastScanBarcode;
      if (lastScanBarcode) {
        makeGetRequest(lastScanBarcode);
      }
    }
    //console.log('looking for ', lookingForThings);
  });

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>📋 Results Page</Text>
      {lastScanBarcode ? (
        <Text>
          {productImage ? (
            <Image
              source={{uri: productImage}}
              style={{width: 50, height: 50}}
              resizeMode="contain"
            />
          ) : (
            <Text>No Image Available</Text>
          )}
          Scan result contains {lastScanResult}
        </Text>
      ) : (
        <Text>Scan something!</Text>
      )}
      <Text>Matches are: {foundIngredients}</Text>
    </View>
  );
}
