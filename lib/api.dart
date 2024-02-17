// https://us.openfoodfacts.org/api/v0/product/044000069223.json
import 'package:http/http.dart' as http;
import 'dart:convert';

var ingredientResults = "";
void makeGetRequest(barcode) async {
  var url = Uri.parse('https://us.openfoodfacts.org/api/v0/product/$barcode.json');
  try {
    // Sending a GET request
    var response = await http.get(url);

    // Check if the request was successful (status code 200)
    if (response.statusCode == 200) {
      // print('Response data: ${response.body}');
      ingredientResults = response.body;
       Map<String, dynamic> responseData = json.decode(ingredientResults);
      print(responseData);
    } else {
      print('Failed to make GET request. Status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error during GET request: $e');
  }
}