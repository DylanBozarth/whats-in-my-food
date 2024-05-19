import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:whatsinmyfood/api.dart';
import 'package:whatsinmyfood/components/alert.dart';

Future<void> handleBarcodeScan(
  BuildContext context,
  List<String> lookingForThings,
  Function(String) onScanResult,
  List<String> foundThings,
) async {
  if (lookingForThings.isNotEmpty) {
    var res = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const SimpleBarcodeScannerPage(),
      ),
    );

    if (res is String) {
      onScanResult(res);
      makeGetRequest(res, foundThings, context);
    }
  } else {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => showAlert(
          context,
          'No Items selected',
          "You need to select items to filter for",
        ),
      ),
    );
  }
}
