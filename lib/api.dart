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

makeGetRequest(barcode, foundThings, context) async {
  var url =
      Uri.parse('https://world.openfoodfacts.org/api/v0/product/$barcode.json');
  try {
    var response = await http.get(url);

    if (response.statusCode == 200) {
      // Decode the JSON string into a Map<String, dynamic>
      Map<String, dynamic> decodedJson = jsonDecode(response.body);

      // Create a Product object from the decoded JSON
      Product product = Product.fromJson(decodedJson);

      // Access properties
      ingredientResults.add(product.product["ingredients_text"]);
      // print(ingredientResults);
      List<Map<String, dynamic>> filteredResults = ingredientResults
          .map((item) => {'key': (item).toLowerCase()})
          .toList();
      findThingsInIngredients(filteredResults, foundThings, context);
    } else {
      showAlert(
        context,
        'Network error',
        'Error in getting request, check your connection and try again',
      );
    }
  } catch (e) {
    showAlert(
      context,
      'Network error',
      'Error in getting request, check your connection and try again',
    );
  }
}

void findThingsInIngredients(List<Map<String, dynamic>> filteredResults, 
    List<String> foundThings, context) {
  List<String> desiredStrings =
      lookingForThings.map((s) => s.toLowerCase()).toList();
// This needs to match the toggles on the home page values
  print(filteredResults);
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
      .map((s) => s.replaceAll(RegExp(r'[^\w\s,]'),
          ' ')) // Replace characters other than word characters, spaces, and commas
      .toList();

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
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => showAlert(
                context,
                'No items found',
                "This item does not contain any ingredients you're filtering for.",
              )),
    );
  }
}
