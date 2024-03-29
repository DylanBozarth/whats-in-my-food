import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:whatsinmyfood/api.dart';
import 'components/toggles.dart';
import 'components/alert.dart';

void main() {
  runApp(const MyApp());
}
// TODO button to scan again from results page
// TODO Make selected items permenent
// TODO Don't allow to scan with nothing selected

// TODO make it look nice

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Whats in my food?',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String barCodeScanResult = '';
  List<String> lookingForThings = [];
  List<String> foundThings = [];

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
            fontFamily: 'Arial',
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.deepOrangeAccent,
      ),
      backgroundColor: Colors.green,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'What are you looking for?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Arial',
                ),
              ),
              // Add other widgets as needed
            ],
          ),
          Column(children: [
            ToggleSwitch(
                passedName: "Added Sugar", lookingForThings: lookingForThings),
            ToggleSwitch(
                passedName: "Seed Oils", lookingForThings: lookingForThings),
            ToggleSwitch(
                passedName: "Dairy", lookingForThings: lookingForThings),
            ToggleSwitch(
                passedName: "Non Vegan", lookingForThings: lookingForThings),
          ]),
          Center(
            child: ElevatedButton(
              onPressed: lookingForThings.isNotEmpty
                  ? () async {
                      var res = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const SimpleBarcodeScannerPage(),
                        ),
                      );

                      if (res is String) {
                        setState(() {
                          barCodeScanResult = res;
                        });
                      }
                      makeGetRequest(barCodeScanResult, lookingForThings,
                          foundThings, context);
                    }
                  : () => showAlert(context, "No items selected",
                      "You need to select something to look for"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              child: const Text(
                'Open Scanner',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
