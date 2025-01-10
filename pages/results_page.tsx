import React from 'react';
import axios from 'axios';
import {showAlert} from '@/components/show_alert';
import {View, Text} from 'react-native';
import {useGlobalState} from '@/components/global_variables';
import {useFocusEffect} from '@react-navigation/native';

export default function ResultsPage() {
  const { foundIngredients, setFoundIngredients, lookingForThings, lastScanResult, setLastScanResult } = useGlobalState();
  let requestedBarcode: Number = 0;


  const makeGetRequest = async (barcode: Number) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    requestedBarcode = barcode
    try {
      console.log('Trying get request');
      const response = await axios.get(url, {timeout: 12000});
      console.log('Response received:');

      if (response.status === 200) {
        //console.log("Successful scan:", response.data);
        //showAlert(response.data, "", true);
        console.log('response was 200');
        //setLastScanResult(response.data);
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
    if (lastScanResult !== requestedBarcode) {
      makeGetRequest(lastScanResult);
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
