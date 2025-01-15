import React, {useEffect} from 'react';
import axios from 'axios';
import {showAlert} from '@/components/show_alert';
import {View, Text} from 'react-native';
import {useGlobalState} from '@/components/global_variables';
import {useFocusEffect} from '@react-navigation/native';

export default function ResultsPage() {
  const { foundIngredients, setFoundIngredients, lookingForThings, lastScanResult, setLastScanResult, setLastScanBarcode, lastScanBarcode } = useGlobalState();


  //https://world.openfoodfacts.org/api/v0/product/884912359414.json

  const makeGetRequest = async (barcode: Number) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  
    try {
      //console.log('Trying get request');
      const response = await axios.get(url, { timeout: 10000 });
      //console.log('Response received:');
  
      if (response.status === 200) {
        console.log('response was 200');
        //console.log('Full Response:', JSON.stringify(response, null, 2));

        //console.log(response.data.product.ingredients_text)
        // Set the last scan result to the ingredients_text from the response
        if (response.data.product?.ingredients_text) {
          setLastScanResult(response.data.product.ingredients_text);
        } else {
          console.warn('No ingredients_text found in the response.');
          showAlert('No Ingredients', 'The response does not contain ingredients.', true);
        }
  
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
  
  const findThingsInIngredients = (filteredResults: string, foundThings: string) => {
    


      showAlert(
        'All good',
        'This food item is free from ingredients you are looking for', true
      );
    
  };

  useFocusEffect(() => {
    if (lastScanResult !== lastScanBarcode) {
      makeGetRequest(lastScanBarcode);
    }
  });

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>📋 Results Page</Text>
      {lastScanResult !== 0 ? <Text>Scan something!</Text> : <Text>Scan result</Text>}
      <Text>{foundIngredients}</Text>
    </View>
  );
}
