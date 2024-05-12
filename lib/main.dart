import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:sticky_headers/sticky_headers/widget.dart';
import 'package:whatsinmyfood/api.dart';
import 'package:whatsinmyfood/food_lists.dart';
import 'components/toggles.dart';
import 'components/alert.dart';
import 'components/global_variables.dart';

void main() {
  runApp(const MyApp());
}

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

//TODO deselect all button/show all selected items
//TODO Allow multiple word results
//TODO show that a switch is highlighted if the category is ignored
//TODO add snazzy logo and style to be the same style
//TODO add ability to look for all things in categories
//TODO camera stopped working randomly

class _HomePageState extends State<HomePage> {
  String barCodeScanResult = '';
  final TextEditingController _searchController = TextEditingController();
  Map<String, bool> toggleStates = {};
  GlobalKey<ScaffoldState> _scaffoldKey =
      GlobalKey<ScaffoldState>(); // to allow re-render of search bar
  final Map<String, List<String>> _toggleNames = {
    'Added Sugar': addedSugar,
    'Inflammatory foods': seedOils,
    'Meat Products': nonVegetarian,
    'Common Allergens': commonAllergens,
    'Religious abstentions': [],
    'High Environmental Impact': [],
    'GMOs': [],
    'Artificial colors and flavors': [],
    'Caffeine': [], // if possible
    'Internationally banned products': bannedInEU,
    'Heavy Metals': [],
    'Vegetarian & Vegan': [],
    'Heavy Metals 2': [],
    'Vegetarian & Vegan 2': [],
    'Heavy Metals 3': [],
    'Vegetarian & Vegan 3': [],
    'Heavy Metals 5453': [],
    'Vegetarian & Vegan 5': [],
    'Heavy Metals 4': [],
    'Vegetarian & Vegan 4': [],
  };
  final Map<String, bool> _isExpanded = {};
  final Map<String, bool> _isTitleVisible = {};
  List<String> _filteredNames = [];
  List<String> foundThings = [];
  @override
  void initState() {
    super.initState();
    _filteredNames.addAll(_toggleNames.values.expand((list) => list).toList());
    for (var category in _toggleNames.keys) {
      _isExpanded[category] = true;
      _isTitleVisible[category] = true; // Initialize title visibility
    }
    //_searchController.addListener(_onSearchTextChanged);
  }

  void _filterList(String query) {
    List<String> filteredList = [];
    String cleanQuery = query
        .replaceAll(' ', '')
        .toLowerCase(); // Remove spaces and convert to lower case

    if (cleanQuery.isNotEmpty) {
      for (var entry in _toggleNames.entries) {
        // Check both key and value lists after removing spaces
        bool isVisible = entry.key
                .replaceAll(' ', '')
                .toLowerCase()
                .contains(cleanQuery) ||
            entry.value.any((name) =>
                name.replaceAll(' ', '').toLowerCase().contains(cleanQuery));

        // Set the category to be visible and expanded if it contains matches
        _isTitleVisible[entry.key] = isVisible;
        _isExpanded[entry.key] =
            isVisible; // Auto-expand categories that have matches

        if (isVisible && !filteredList.contains(entry.key)) {
          filteredList.add(entry.key);
        }
        if (_isExpanded[entry.key] ?? false) {
          // Include toggle names from expanded categories
          for (String name in entry.value) {
            if (name.replaceAll(' ', '').toLowerCase().contains(cleanQuery)) {
              filteredList.add(name);
            }
          }
        }
      }
    } else {
      // If query is empty, include all toggle names from categories
      for (var entry in _toggleNames.entries) {
        _isTitleVisible[entry.key] = true;
        _isExpanded[entry.key] =
            true; // Keep all categories expanded if no search query
        filteredList.add(entry.key);
        filteredList.addAll(entry.value);
      }
    }
    setState(() {
      _filteredNames = filteredList;
    });
  }

  void clearAllToggles() {
    lookingForThings.clear();
  }

  // Show active selectors
  List<String> getActiveToggles() {
    List<String> activeToggles = [];
    toggleStates.forEach((key, value) {
      if (value) {
        // Check if the toggle is on
        activeToggles.add(key);
      }
    });
    return activeToggles;
  }

  void _showActiveToggles() {
    var activeToggles = getActiveToggles(); // Get the list of active toggles
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Active Toggles"),
          content: SingleChildScrollView(
            child: ListBody(
              children: activeToggles.map((item) => Text(item)).toList(),
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Close'),
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
            ),
          ],
        );
      },
    );
  }

/* Does not work, doesn't update UI 
  void _onSearchTextChanged() {
    // Call setState to trigger a UI re-render
    _scaffoldKey.currentState?.setState(() {});
  }
 */
// Modify the toggleTitleVisibility function to mirror filterList logic
  void toggleTitleVisibility(String category) {
    setState(() {
      _isTitleVisible[category] = !_isTitleVisible[category]!;
    });
    // Re-filter the list when title visibility changes
    _filterList(_searchController.text);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        key: _scaffoldKey,
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
      backgroundColor: Colors.grey,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              onChanged: _filterList,
              decoration: const InputDecoration(
                labelText: 'Search',
                hintText: 'Search',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _toggleNames.keys.length,
              itemBuilder: (context, index) {
                String categoryName = _toggleNames.keys.elementAt(index);
                List<String> toggleNames = _toggleNames[categoryName]!;
                int toggleCount =
                    toggleNames.length; // Count of toggle switches contained

                return StickyHeader(
                  header: GestureDetector(
                    onTap: () {
                      setState(() {
                        _isTitleVisible[categoryName] =
                            !_isTitleVisible[categoryName]!;
                      });
                    },
                    child: Container(
                      height: 50.0,
                      color: Colors.green[700],
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      alignment: Alignment.centerLeft,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _searchController.text.isEmpty
                                ? categoryName
                                : '$categoryName', // ($toggleCount results)
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Icon(
                            _isTitleVisible[categoryName]!
                                ? Icons.arrow_drop_up
                                : Icons.arrow_drop_down,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  ),
                  content: _isTitleVisible[categoryName]!
                      ? Column(
                          children: toggleNames.map((name) {
                            return Visibility(
                              visible: _filteredNames.contains(name),
                              child: ToggleSwitch(
                                passedName: name,
                                isHighlighted: toggleStates[name] ?? false,
                                onChanged: (bool newValue) {
                                  setState(() {
                                    toggleStates[name] = newValue;
                                  });
                                  // Handle adding to or removing from 'lookingForThings' or any other logic here.
                                  if (newValue) {
                                    lookingForThings.add(name
                                        .toLowerCase()
                                        .replaceAll(' ', '-'));
                                  } else {
                                    lookingForThings.remove(name
                                        .toLowerCase()
                                        .replaceAll(' ', '-'));
                                  }
                                },
                              ),
                            );
                          }).toList(),
                        )
                      : SizedBox.shrink(),
                );
              },
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _showActiveToggles,
                      child: const Text('Show all selected'),
                    ),
                  ),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        if (lookingForThings.isNotEmpty) {
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
                            makeGetRequest(
                                barCodeScanResult, foundThings, context);
                          }
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => showAlert(
                                context,
                                'No Items selected',
                                "You need to select items to filter for",
                              ),
                            ),
                          );
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
            ),
          )
        ],
      ),
    );
  }
}
