import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import keywordLists from './food_list';
import ResultsPage from '../pages/results_page';
import {showAlert} from './show_alert';
import {useGlobalState} from './global_variables';

// TEST https://world.openfoodfacts.org/api/v0/product/028400589864.json
//   const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;


// LEGACY PAGE ******************************************
export const MakeApiCalls = (barcode) => {
  //const { foundIngredients, setFoundIngredients, lookingForThings, setLookingForThings, lastScanResult, setLastScanResult } = useGlobalState();
  let resultsFromAPI = [];
  let filteredResults = [];
  const makeGetRequest = async (barcode) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
      console.log('Trying get request');
      const response = await axios.get(url, {timeout: 4000});
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
  makeGetRequest(barcode);
};

/*
export const findThingsInIngredients = (filteredResults: string, foundThings: string) => {
  const desiredStrings = lookingForThings.map((s) => s.toLowerCase());

  // Match keywords with toggle values
  keywordLists.forEach((entry) => {
    const keyword = Object.keys(entry)[0];
    const list = entry[keyword];

    if (desiredStrings.includes(keyword)) {
      desiredStrings.push(...list.map((s) => s.toLowerCase()));
    }
  });

  const cleanedUpStrings = filteredResults
    .map((entry) => entry.key.toLowerCase())
    .map((s) => s.replace(/\s+/g, '-')); // Replace spaces with hyphens

  const commonElements = [];
  desiredStrings.forEach((desiredString) => {
    const matchFound = cleanedUpStrings.some((item) =>
      item.includes(desiredString)
    );

    if (matchFound && !commonElements.includes(desiredString)) {
      commonElements.push(desiredString);
    }
  });

  foundThings.push(...commonElements);

  if (foundThings.length > 0) {
    context.navigate('ResultsPage', { passedResults: foundThings });
  } else {
    showAlert(
      'All good',
      'This food item is free from ingredients you are looking for', true
    );
  }
};
*/
