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

void findThingsInIngredients(List<Map<String, dynamic>> filteredResults,
    List<String> lookingForThings) {
  List<String> desiredStrings = lookingForThings;
  List<String> matchedIngredients = [];

  if (desiredStrings.contains("Seed Oils")) {
    desiredStrings.addAll(seedOils);
    // print('Desired Strings $desiredStrings');
  }
  print(filteredResults);
  print(desiredStrings); // both are now lower case, now compare them 
  Set<String> set1 = desiredStrings.toSet(); 
  Set<Map<String, dynamic>> set2 = filteredResults.toSet();

  Set<Map<String, dynamic>> commonElements = set2.intersection(set1);

  print('Common elements: $commonElements');
  // print('Matched ingredients: $matchedIngredients');

  //Dump everything for next scan   known error: wipes the looking for array 
  // desiredStrings.clear();
  matchedIngredients.clear();
  
}

//image: image_url
