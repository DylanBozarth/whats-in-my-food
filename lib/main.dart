import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:whatsinmyfood/api.dart';
import 'components/toggles.dart';
import 'components/alert.dart';
import 'components/global_variables.dart';

void main() {
  runApp(const MyApp());
}
// TODO button to scan again from results page
// TODO Make selected items permenent
// TODO fix selection bug with #2 solution
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
              passedName: "Added Sugar",
            ),
            ToggleSwitch(
              passedName: "Seed Oils",
            ),
            ToggleSwitch(
              passedName: "Dairy",
            ),
            ToggleSwitch(
              passedName: "Non Vegan",
            ),
          ]),
          Center(
            child: ElevatedButton(
              onPressed: () async {
                // Check the updated value of lookingForThings
                if (lookingForThings.isNotEmpty) {
                  var res = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const SimpleBarcodeScannerPage(),
                    ),
                  );

                  if (res is String) {
                    setState(() {
                      barCodeScanResult = res;
                    });
                  }
                  makeGetRequest(barCodeScanResult, lookingForThings,
                      foundThings, context);
                } else {
                  // If lookingForThings is empty, show an alert
                  showAlert(context, "No items selected",
                      "You need to select something to look for");
                }
              },
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
