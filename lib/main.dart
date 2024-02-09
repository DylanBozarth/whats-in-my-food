import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';

void main() {
  runApp(const MaterialApp(
    title: 'Navigation Basics',
    home: FirstRoute(),
  ));
}

class FirstRoute extends StatelessWidget {
  const FirstRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text(
            'Whats in my food?',
            style: TextStyle(
                color: Colors.white,
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.bold,
                fontFamily: 'Arial'),
          ),
          centerTitle: true,
          backgroundColor: Colors.deepOrangeAccent,
        ),
        backgroundColor: Colors.black,
        body: Column(
          children: [
            const Center(
              child: Text(
                'What are you looking for?',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Arial'),
              ),
            ),
            const Center(
              child: Text('yeah'),
            ),
            Center(
              child: ElevatedButton(
                child: const Text('Open Scanner'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const SimpleBarcodeScannerPage()),
                  );
                },
              ),
            ),
          ],
        ));
  }
}
