import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:whatsinmyfood/resultsPage.dart';
import 'food_lists.dart';

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

makeGetRequest(barcode, lookingForThings) async {
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
      findThingsInIngredients(filteredResults, lookingForThings);
    } else {
      print('Failed to make GET request. Status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error during GET request: $e');
  }
}

void findThingsInIngredients(
    List<Map<String, dynamic>> filteredResults, List<String> lookingForThings) {
  List<String> desiredStrings = lookingForThings.map((s) => s.toLowerCase()).toList();
  List<String> matchedIngredients = [];

  if (desiredStrings.contains("seed oils")) {
    desiredStrings.addAll(seedOils.map((s) => s.toLowerCase()));
  } else if (desiredStrings.contains("added sugar")) {
    desiredStrings.addAll(addedSugar.map((s) => s.toLowerCase()));
  }

  print('filtered results $filteredResults');
  print('desired Strings: $desiredStrings');

  // Print cleaned-up strings from filteredResults
  List<String> cleanedUpStrings = filteredResults
      .map((entry) => entry["key"].toString().toLowerCase())
      .map((s) => s.replaceAll(RegExp(r'[^\w\s]'), ' '))
      .toList();
  print('Cleaned-up Strings: $cleanedUpStrings');

  // Split the cleaned-up strings into individual words
  Set<String> set1 = desiredStrings.toSet();
  Set<String> set2 = cleanedUpStrings
      .expand((s) => s.split(' '))
      .map((s) => s.trim()) // Remove leading/trailing spaces
      .where((s) => s.isNotEmpty) // Remove empty strings
      .toSet();

  Set<String> commonElements = set2.intersection(set1);

  print('Common elements: $commonElements');
  // print('Matched ingredients: $matchedIngredients');

  desiredStrings.clear();
  matchedIngredients.clear();
}
