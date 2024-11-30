import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import keywordLists from './food_list'; // Import keyword lists
import ResultsPage from '../pages/results_page';
import { showAlert } from './show_alert';

class Product {
  constructor(code, product) {
    this.code = code;
    this.product = product;
  }

  static fromJson(json: JSON) {
    return new Product(json.code, json.product);
  }
}

let ingredientResults = [];
let filteredResults = [];

export const makeGetRequest = async (barcode: number, foundThings: string) => {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  try {
    const response = await axios.get(url, { timeout: 8000 });
    console.log("Make get request");

    if (response.status === 200) {
      const product = Product.fromJson(response.data);
      ingredientResults.push(product.product.ingredients_text);

      filteredResults = ingredientResults.map((item) => ({
        key: item.toLowerCase(),
      }));
      console.log("make get request success");

      findThingsInIngredients(filteredResults, foundThings);
      return true; // Success
    } else {
      showAlert( 'Scanning failure', 'The scan failed', true);
      return false; // Failure
    }
  } catch (e) {
    showAlert( 'Unknown error', `The error is ${e}`, true);
    return false; // Failure
  }
};


// findThingsInIngredients Function Equivalent
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
      context,
      'All good',
      'This food item is free from ingredients you are looking for'
    );
  }
};
