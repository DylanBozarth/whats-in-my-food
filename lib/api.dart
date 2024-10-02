import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:whatsinmyfood/results_page.dart';
import 'food_lists.dart';
import 'components/global_variables.dart';
import 'components/alert.dart';

// TEST https://world.openfoodfacts.org/api/v0/product/028400589864.json
class Product {
  final String code;
  final Map<String, dynamic> product;
  Product({required this.code, required this.product});

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      code: json['code'],
      product: json['product'],
    );
  }
}

List<String> ingredientResults = [];
List<Map<String, dynamic>> filteredResults = [];

Future<bool> makeGetRequest(String barcode, List<String> foundThings, BuildContext context) async {
  var url = Uri.parse('https://world.openfoodfacts.org/api/v0/product/$barcode.json');
  try {
    var response = await http.get(url).timeout(const Duration(seconds: 8));
    print("Make get request");
    if (response.statusCode == 200) {
      Map<String, dynamic> decodedJson = jsonDecode(response.body);
      Product product = Product.fromJson(decodedJson);
      ingredientResults.add(product.product["ingredients_text"]);
      filteredResults = ingredientResults
          .map((item) => {'key': (item).toLowerCase()})
          .toList();
      print("make get request success");
      findThingsInIngredients(filteredResults, foundThings, context);
      return true; // Success
    } else {
      showAlert(
        context,
        'Scanning failure',
        'The scan failed',
      );
      return false; // Failure
    }
  } catch (e) {
    showAlert(
      context,
      'Unknown error',
      'The error is ${e}',
    );
    return false; // Failure
  }
}



void findThingsInIngredients(List<Map<String, dynamic>> filteredResults,
    List<String> foundThings, context) {
  List<String> desiredStrings =
      lookingForThings.map((s) => s.toLowerCase()).toList();
// This needs to match the toggles on the home page values
  //print(filteredResults);
// Iterate over the collection of maps
  for (var entry in keywordLists) {
    var keyword = entry.keys.first;
    var list = entry.values.first;

    // Check if desiredStrings contains the keyword
    if (desiredStrings.contains(keyword)) {
      // Add all elements from the list to desiredStrings
      desiredStrings.addAll(list.map((s) => s.toLowerCase()));
    }
  }

  List<String> cleanedUpStrings = filteredResults
      .toList()
      .map((entry) => entry["key"].toString().toLowerCase())
      .map((s) => s.replaceAll(RegExp(r'\s+'), '-')) // Replace spaces
      .toList();
  //print('Filtered results: $cleanedUpStrings');
  List<String> commonElements = [];
  for (String desiredString in desiredStrings) {
    // Check if desiredString exists in any item of filterResult
    bool matchFound = cleanedUpStrings
        .any((item) => item.contains(desiredString.toLowerCase()));

    // If match found and not already in uniqueMatches, add it
    if (matchFound && !commonElements.contains(desiredString)) {
      commonElements.add(desiredString);
    }
  }
// print(commonElements);
  foundThings.addAll(commonElements);
  if (foundThings.isNotEmpty) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ResultsPage(
          passedResults: foundThings,
          context: context,
        ),
      ),
    );
  } else {
   showAlert(
      context,
      'All good',
      'This food item is free from ingredients you are looking for',
    );
  }
}
