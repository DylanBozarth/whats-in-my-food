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
      List<Map<String, dynamic>> filteredResults =
          ingredientResults.map((item) => {'key': item}).toList();
      findThingsInIngredients(filteredResults, lookingForThings);
    } else {
      print('Failed to make GET request. Status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error during GET request: $e');
  }
}

void findThingsInIngredients(List<Map<String, dynamic>> ingredientResults,
    List<String> lookingForThings) {
  List<String> desiredStrings = lookingForThings;
  List<String> matchedIngredients = [];

  if (desiredStrings.contains("Seed Oils")) {
    desiredStrings.addAll(seedOils);
    // print('Desired Strings $desiredStrings');
  }
  print(ingredientResults);

  for (Map<String, dynamic> ingredient in ingredientResults) {
    String ingredientText = ingredient[''].toString().toLowerCase();

    for (String desired in desiredStrings) {
      if (ingredientText.contains(desired.toLowerCase())) {
        matchedIngredients.add(ingredientText);
        break; // Break the inner loop if a match is found
      }
    }
  }
  print('Matched ingredients: $matchedIngredients');

  //Dump everything for next scan   known error: wipes the looking for array 
  // desiredStrings.clear();
  matchedIngredients.clear();
  print(lookingForThings);
}

//image: image_url
