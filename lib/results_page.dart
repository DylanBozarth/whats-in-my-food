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

  // Function to generate list data dynamically from lookingForThings
  List<Map<String, dynamic>> generateListData(
      List<String> lookingForThings, List<String> passedResults) {
    List<Map<String, dynamic>> listData = [];

    for (String item in lookingForThings) {
      List<String> matchingResults =
          passedResults.where((result) => result.contains(item)).toList();
      listData.add({'title': item, 'sublist': matchingResults});
    }

    return listData;
  }

  @override
  Widget build(BuildContext context) {
    // Generate list data dynamically based on lookingForThings and passedResults
    List<Map<String, dynamic>> listData =
        generateListData(lookingForThings, passedResults);

    return Scaffold(
      appBar: AppBar(
        title: Text('Results Page'),
      ),
      body: Column(
        children: [
          // Nested list structure
          Expanded(
            child: ListView.builder(
              itemCount: listData.length,
              itemBuilder: (BuildContext context, int index) {
                return ExpansionTile(
                  title: Text(listData[index]['title']),
                  children: <Widget>[
                    ListView.builder(
                      shrinkWrap: true,
                      itemCount: listData[index]['sublist'].length,
                      itemBuilder: (BuildContext context, int subIndex) {
                        return ListTile(
                          title: Text(listData[index]['sublist'][subIndex]),
                        );
                      },
                    ),
                  ],
                );
              },
            ),
          ),
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
        ],
      ),
    );
  }
}
