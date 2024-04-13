import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
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

class _HomePageState extends State<HomePage> {
  String barCodeScanResult = '';
  final TextEditingController _searchController = TextEditingController();
  final Map<String, List<String>> _toggleNames = {
    'Added Sugar': addedSugar,
    'Inflammatory foods': seedOils,
    'Meat Products': nonVegetarian,
    'Common Allergens': [],
    'Religious abstentions': [],
    'High Environmental Impact': [],
    'GMOs': [],
    'Artificial colors and flavors': [],
    'Caffeine': [], // if possible
    'Internationally banned products': [],
    'Heavy Metals': [],
    'Vegetarian & Vegan': [],
  };
  final Map<String, bool> _isExpanded = {};
  final Map<String, bool> _isTitleVisible = {}; // Track visibility of titles
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
  }

  // Modify the _filterList function to include title visibility logic
// Modify the _filterList function to include category names matching the search query
// Modify the _filterList function to include category names matching the search query
  void _filterList(String query) {
    List<String> filteredList = [];
    if (query.isNotEmpty) {
      for (var entry in _toggleNames.entries) {
        bool isVisible =
            entry.key.toLowerCase().contains(query.toLowerCase()) ||
                entry.value.any(
                    (name) => name.toLowerCase().contains(query.toLowerCase()));
        _isTitleVisible[entry.key] = isVisible;
        if (isVisible && !filteredList.contains(entry.key)) {
          filteredList.add(entry
              .key); // Add category name to filtered list if it matches the search query or if any toggle name matches
        }
        if (_isExpanded[entry.key] ?? false) {
          // Only include toggle names from expanded categories
          for (String name in entry.value) {
            if (name.toLowerCase().contains(query.toLowerCase())) {
              filteredList.add(name);
            }
          }
        }
      }
    } else {
      // If query is empty, include all toggle names from expanded categories
      for (var entry in _toggleNames.entries) {
        _isTitleVisible[entry.key] = true;
        if (_isExpanded[entry.key] ?? false) {
          filteredList.add(entry.key);
          filteredList.addAll(entry.value);
        }
      }
    }
    setState(() {
      _filteredNames = filteredList;
    });
  }

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
          const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text(
              'What are you looking for?',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
                fontFamily: 'Arial',
              ),
            ),
          ),
          /*
          FloatingActionButton(
            onPressed: () {
              toggleTitleVisibility('Whats in my food?');
            },
            child: const Text("Show all categories"),
          ),
          */
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
            child: ListView(
              children: _toggleNames.entries.map((entry) {
                var categoryName = entry.key;
                var toggleNames = entry.value;
                var isExpanded = _isExpanded[categoryName] ?? false;

                return ExpansionTile(
                  title: _isTitleVisible[categoryName] == true
                      ? Text(
                          categoryName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      : Text(
                          categoryName,
                          style: const TextStyle(
                            color: Colors.red,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                  initiallyExpanded: isExpanded,
                  children: [
                    ListView.builder(
                      shrinkWrap: true,
                      itemCount: toggleNames.length,
                      itemBuilder: (context, index) {
                        var name = toggleNames[index];
                        if (_filteredNames.contains(name)) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: ToggleSwitch(
                                passedName:
                                    name), // Use your ToggleSwitch component
                          );
                        } else {
                          return const SizedBox
                              .shrink(); // Return an empty SizedBox if name is not in filtered names
                        }
                      },
                    ),
                  ],
                  onExpansionChanged: (value) {
                    setState(() {
                      _isExpanded[categoryName] = value;
                      _isTitleVisible[categoryName] =
                          value; // Update title visibility
                    });
                  },
                );
              }).toList(),
            ),
          ),
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
                  // ignore: use_build_context_synchronously
                  makeGetRequest(barCodeScanResult, foundThings, context);
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
    );
  }
}
