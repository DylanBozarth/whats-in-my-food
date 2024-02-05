import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:flutter/services.dart';

class OpenCamera extends StatefulWidget {
  const OpenCamera({Key? key}) : super(key: key);

  @override
  _OpenCameraState createState() => _OpenCameraState();
}

class _OpenCameraState extends State<OpenCamera> {
  String result = ''; // Add a variable to hold the result

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Second Route'),
      ),
      backgroundColor: Colors.black,
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            var res = await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const SimpleBarcodeScannerPage(),
              ),
            );
            setState(() {
              if (res is String) {
                result = res;
              }
            });
          },
          child: const Text('Open Scanner'),
        ),
      ),
    );
  }
}
