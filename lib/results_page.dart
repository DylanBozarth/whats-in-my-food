import 'package:flutter/material.dart';
import 'package:whatsinmyfood/components/scan_barcode.dart';
import 'package:whatsinmyfood/main.dart';
import 'food_lists.dart';
import 'components/global_variables.dart';

class ResultsPage extends StatelessWidget {
  final List<String> passedResults;

  const ResultsPage({
    Key? key,
    required this.passedResults,
    required BuildContext context,
  }) : super(key: key);

  Map<String, List<String>> categorizeResults(List<String> passedResults,
      List<Map<String, List<String>>> keywordLists) {
    Map<String, List<String>> categorizedResults = {};
    for (var map in keywordLists) {
      map.forEach((key, _) => categorizedResults[key] = []);
    }
    for (String result in passedResults) {
      for (var keywordMap in keywordLists) {
        keywordMap.forEach((keyword, list) {
          if (lookingForThings.contains(keyword.toLowerCase())) {
            if (list.any((element) =>
                result.toLowerCase().contains(element.toLowerCase()))) {
              categorizedResults[keyword]?.add(result);
            }
          }
        });
      }
    }
    //print(categorizedResults);
    passedResults.clear();
    print(lookingForThings);
    return categorizedResults;
  }

  @override
  Widget build(BuildContext context) {
    Map<String, List<String>> categorizedResults =
        categorizeResults(passedResults, keywordLists);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Results Page'),
      ),
      body: Column(
        children: [
          ElevatedButton(
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
              'Adjust filters',
              style: TextStyle(color: Colors.white),
            ),
          ),
          Expanded(
            child: ListView(
              children: categorizedResults.entries
                  .where((entry) =>
                      entry.value.isNotEmpty) // Filter out empty lists
                  .map((entry) {
                var keyword = entry.key;
                var matchingElements = entry.value;

                return ExpansionTile(
                  title: Text(keyword
                      .toUpperCase()
                      .replaceAll('-', ' ')), // title is here
                  initiallyExpanded: true,
                  children: [
                    ListView.builder(
                      shrinkWrap: true,
                      itemCount: matchingElements.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title:
                              Text(matchingElements[index]), // sublist is here
                        );
                      },
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                //Text("Looking for: $lookingForThings"),
                //Text('YOUR RESULTS: $passedResults'),
                const SizedBox(
                    height: 16), // Add some spacing between the buttons
                ElevatedButton(
                  onPressed: () {
                    handleBarcodeScan(context, (p0) {}, passedResults);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text(
                    'Scan again',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
