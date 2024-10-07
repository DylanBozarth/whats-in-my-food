import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import '../api.dart';
import './global_variables.dart';
import './alert.dart';

class ScanButton extends StatefulWidget {
  const ScanButton({Key? key}) : super(key: key);

  @override
  _ScanButtonState createState() => _ScanButtonState();
}

class _ScanButtonState extends State<ScanButton> {
  String barCodeScanResult = '';
  List<String> foundThings = [];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ElevatedButton(
        onPressed: () async {
          if (lookingForThings.isEmpty) {
            showAlert(context, 'Nothing Selected',
                'You need to select something to filter for');
            return;
          }

          showProcessingDialog(context, "Scanning your item...");
          print("Scanning dialog shown");

          try {
            final res = await Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const SimpleBarcodeScannerPage()),
            );

            if (res is String) {
              setState(() => barCodeScanResult = res);
              await makeGetRequest(barCodeScanResult, foundThings, context);
            } else {
              Navigator.of(context).pop();
              throw Exception('Barcode scanning failed or was cancelled');
            }
          } catch (e) {
            print('Error occurred: $e');
            if (mounted) {
              Navigator.of(context).pop();
              showAlert(context, 'Error',
                  'An error occurred while processing your request. Please try again.');
            }
          }
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
        ),
        child: const Text('SCAN', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}
