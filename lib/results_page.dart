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

  Map<String, List<String>> categorizeResults(List<String> passedResults,
      List<Map<String, List<String>>> keywordLists) {
    Map<String, List<String>> categorizedResults = {};
    keywordLists.forEach((map) {
      map.forEach((key, _) => categorizedResults[key] = []);
    });
    for (String result in passedResults) {
      keywordLists.forEach((keywordMap) {
        keywordMap.forEach((keyword, list) {
          if (list.any((element) =>
              result.toLowerCase().contains(element.toLowerCase()))) {
            categorizedResults[keyword]?.add(result);
          }
        });
      });
    }
    print(categorizedResults);
    return categorizedResults;
  }

  @override
  Widget build(BuildContext context) {
    Map<String, List<String>> categorizedResults =
        categorizeResults(passedResults, keywordLists);

    return Scaffold(
      appBar: AppBar(
        title: Text('Results Page'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: categorizedResults.entries
                  .where((entry) =>
                      entry.value.isNotEmpty) // Filter out empty lists
                  .map((entry) {
                var keyword = entry.key;
                var matchingElements = entry.value;

                return ExpansionTile(
                  title: Text(keyword.toUpperCase()), // title is here
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
