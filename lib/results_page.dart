import 'package:flutter/material.dart';
import 'package:whatsinmyfood/components/scan_barcode.dart';
import 'package:whatsinmyfood/main.dart';
import 'food_lists.dart';
import 'components/global_variables.dart';

class ResultsPage extends StatelessWidget {
  final List<String> passedResults;
  final Function(String) updateScanResult;

  const ResultsPage({
    Key? key,
    required this.passedResults,
    required BuildContext context,
    required this.updateScanResult,
  }) : super(key: key);

  Map<String, List<String>> categorizeResults(
      List<String> passedResults,
      List<Map<String, List<String>>> keywordLists,
      List<String> lookingForThings) {
    // Convert lookingForThings to lowercase and replace spaces with hyphens
    List<String> lowercaseLookingForThings = lookingForThings
        .map((item) => item.toLowerCase().replaceAll(' ', '-'))
        .toList();

    // Convert passedResults to lowercase and replace spaces with hyphens
    List<String> lowercasePassedResults = passedResults
        .map((item) => item.toLowerCase().replaceAll(' ', '-'))
        .toList();

    Map<String, List<String>> categorizedResults = {};

    // Convert all keywords and elements in keyword lists to lowercase and replace spaces with hyphens
    List<Map<String, List<String>>> lowercaseKeywordLists =
        keywordLists.map((map) {
      Map<String, List<String>> lowercaseMap = {};
      map.forEach((key, value) {
        List<String> lowercaseList = value
            .map((element) => element.toLowerCase().replaceAll(' ', '-'))
            .toList();
        lowercaseMap[key.toLowerCase().replaceAll(' ', '-')] = lowercaseList;
      });
      return lowercaseMap;
    }).toList();

    // Add all keyword maps to categorizedResults
    for (var map in lowercaseKeywordLists) {
      categorizedResults.addAll(map);
    }

    // Debug print to check categorizedResults before filtering
    //print('Categorized results before filtering: $categorizedResults');

    // Filter the categorizedResults to include only the keys from lowercaseLookingForThings
    categorizedResults = Map.fromEntries(categorizedResults.entries
        .where((entry) => lowercaseLookingForThings.contains(entry.key)));

    // Debug print to check categorizedResults after filtering
    //print('Categorized results after filtering: $categorizedResults');

    print('Looking for things: $lowercaseLookingForThings');
    print('Passed results: $lowercasePassedResults');
    print('Keyword Lists: $lowercaseKeywordLists');

    for (String result in lowercasePassedResults) {
      for (var keywordMap in lowercaseKeywordLists) {
        keywordMap.forEach((keyword, list) {
          String lowercaseKeyword = keyword.toLowerCase().replaceAll(' ', '-');
          if (list.any((element) =>
              result.contains(element.toLowerCase().replaceAll(' ', '-')))) {
            if (lowercasePassedResults.contains(result)) {
              categorizedResults.putIfAbsent(lowercaseKeyword, () => []);
              categorizedResults[lowercaseKeyword]?.add(result);
            }
          }
        });
      }
    }
    passedResults.clear();
    print('Final categorizedResults: $categorizedResults');
    return categorizedResults;
  }

  @override
  Widget build(BuildContext context) {
    Map<String, List<String>> categorizedResults =
        categorizeResults(passedResults, keywordLists, lookingForThings);

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
                Text('YOUR RESULTS: $passedResults'),
                const SizedBox(
                    height: 16), // Add some spacing between the buttons
                ElevatedButton(
                  onPressed: () {
                    handleBarcodeScan(
                      context,
                      lookingForThings,
                      updateScanResult,
                    );
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
