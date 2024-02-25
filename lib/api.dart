import 'dart:convert';
import 'package:http/http.dart' as http;

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
var ingredientResults = [];

makeGetRequest(barcode) async {
  var url = Uri.parse('https://world.openfoodfacts.org/api/v0/product/$barcode.json');
  try {
    var response = await http.get(url);

    if (response.statusCode == 200) {
      // Decode the JSON string into a Map<String, dynamic>
      Map<String, dynamic> decodedJson = jsonDecode(response.body);

      // Create a Product object from the decoded JSON
      Product product = Product.fromJson(decodedJson);

      // Access properties
      ingredientResults = product.product["ingredients"];
      // findThingsInIngredients();
    } else {
      print('Failed to make GET request. Status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error during GET request: $e');
  }
}
void findThingsInIngredients(userList) {
  List<String> result = userList // change the list to remove lookingFor, and make it an array
      .substring(1, userList.length - 1) // Remove curly braces
      .split(', ') // Split by comma and space
      .map((String item) => item.trim().replaceAll('LookingFor.', '')) // Remove "LookingFor." prefix
      .toList();
  bool containsCornSyrup = ingredientResults.any((item) => item['text'].toLowerCase().contains(result));
  if (containsCornSyrup) {
    print('The data contains "Corn syrup".');
  } else {
    print('The data does not contain "Corn syrup".');
  }
  
}