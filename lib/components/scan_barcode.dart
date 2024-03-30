import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import '../api.dart';

// Declare a function type for the state update callback
typedef StateUpdateCallback = void Function(String);

// Function to handle barcode scanning and API request
void handleBarcodeScan(
  BuildContext context,
  StateUpdateCallback onUpdate,
  List<String> foundThings,
) async {
  var res = await Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => const SimpleBarcodeScannerPage(),
    ),
  );

  if (res is String) {
    onUpdate(res); // Call the callback to update the state
    makeGetRequest(res, foundThings, context);
  }
}
