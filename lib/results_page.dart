import 'package:flutter/material.dart';
import 'package:whatsinmyfood/main.dart';
// import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';

class ResultsPage extends StatelessWidget {
  final List<String> passedResults;
  final BuildContext context;
  final List<String> lookingForThings;
  const ResultsPage({
    Key? key,
    required this.passedResults,
    required this.context,
    required this.lookingForThings,
  }) : super(key: key);
// take the lookingForThings and create lists for each item, and compare passedResults and populate into those lists 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
          mainAxisAlignment: MainAxisAlignment.center, // for vertical centering
          children: [
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Looking for: $lookingForThings"),
                  Text('YOUR RESULTS: $passedResults'),
                ],
              ),
            ),
            Center(
              child: ElevatedButton(
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const HomePage(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: const Text(
                  'Scan again',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ]),
    );
  }
}
