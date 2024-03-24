import 'package:flutter/material.dart';
import 'package:whatsinmyfood/main.dart';
import 'food_lists.dart';

class ResultsPage extends StatelessWidget {
  final List<String> passedResults;
  final List<String> lookingForThings;

  const ResultsPage({
    Key? key,
    required this.passedResults,
    required this.lookingForThings,
    required BuildContext context,
  }) : super(key: key);

  Map<String, List<String>> categorizeResults(List<String> passedResults) {
    Map<String, List<String>> categorizedResults = {};

    // Iterate over the collection of maps
    for (var entry in keywordLists) {
      var keyword = entry.keys.first;
      var list = entry.values.first;

      // Find elements in passedResults that match the list associated with the keyword
      List<String> matchingElements =
          passedResults.where((element) => list.contains(element)).toList();

      // Add matching elements to categorizedResults under the keyword
      if (matchingElements.isNotEmpty) {
        categorizedResults[keyword] = matchingElements;
      }
    }
    print(categorizedResults);
    return categorizedResults;
  }

  @override
  Widget build(BuildContext context) {
    Map<String, List<String>> categorizedResults =
        categorizeResults(passedResults);

    return Scaffold(
      appBar: AppBar(
        title: Text('Results Page'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: categorizedResults.entries.map((entry) {
                var keyword = entry.key;
                var matchingElements = entry.value;

                return ExpansionTile(
                  title: Text(keyword.toUpperCase()), // title is here
                  initiallyExpanded: true,
                  children: [
                    ListView.builder(
                      shrinkWrap: true,
                      itemCount: matchingElements!.length,
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
