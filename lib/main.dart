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

//TODO add snazzy logo and style to be the same style
// TODO going back to adjust filters will clear the toggles

//lesser todo
// TODO make categories that aren't being filtered for not show up in results page IE: honey -- only happens when 2 or more categories are searched
// TODO show that the app is thinking when it scans

class _HomePageState extends State<HomePage> {
  String barCodeScanResult = '';
  final TextEditingController _searchController = TextEditingController();
  bool showAllSelected = false;
  Map<String, bool> toggleStates = {};
  GlobalKey<ScaffoldState> _scaffoldKey =
      GlobalKey<ScaffoldState>(); // to allow re-render of search bar
  final Map<String, List<String>> _toggleNames = {
    'Added Sugar': ['Toggle All', ...addedSugar], // Include "Toggle All"
    'Inflammatory foods': ['Toggle All', ...seedOils],
    'Meat Products': ['Toggle All', ...nonVegetarian],
    'Common Allergens': ['Toggle All', ...commonAllergens],
    // Add other categories similarly
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
    String cleanQuery = query.replaceAll(' ', '').toLowerCase();

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

      // Toggle all items in the matched category
      for (var category in _toggleNames.keys) {
        if (category.replaceAll(' ', '').toLowerCase() == cleanQuery) {
          _toggleAllItemsInCategory(category, true);
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

  void _toggleAllItemsInCategory(String category, bool value) {
    setState(() {
      for (var item in _toggleNames[category]!) {
        if (item != 'Toggle All') {
          toggleStates[item.toLowerCase().replaceAll(' ', '-')] = value;
          if (value) {
            lookingForThings.add(item.toLowerCase().replaceAll(' ', '-'));
          } else {
            lookingForThings.remove(item.toLowerCase().replaceAll(' ', '-'));
          }
        }
      }
    });
  }

  // Show which ingredients are selected
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
    setState(() {
      _filteredNames.clear();
      if (showAllSelected) {
        // If showAllSelected is true, include all toggle names
        _toggleNames.forEach((category, toggleNames) {
          _filteredNames.add(category);
          _filteredNames.addAll(toggleNames);
          _isTitleVisible[category] = true;
          _isExpanded[category] = true;
        });
        showAllSelected = false;
      } else {
        // If showAllSelected is false, include only active toggles
        _toggleNames.forEach((category, toggleNames) {
          bool categoryHasActiveToggles = false;
          List<String> activeToggles = [];
          for (var toggleName in toggleNames) {
            if (toggleStates[toggleName.toLowerCase().replaceAll(' ', '-')] ??
                false) {
              activeToggles.add(toggleName);
              categoryHasActiveToggles = true;
            }
          }
          if (categoryHasActiveToggles) {
            _filteredNames.add(category); // Add the category name first
            _filteredNames.addAll(activeToggles); // Then add the active toggles
            _isTitleVisible[category] = true;
            _isExpanded[category] = true;
          } else {
            _isTitleVisible[category] = false;
          }
        });
        showAllSelected = true;
      }
    });
  }

  void _handleToggleChange(String itemName, bool newValue) {
    setState(() {
      toggleStates[itemName] = newValue; // Update the toggle state
    });
    // Here, you can also handle any additional logic needed when a toggle changes
    // For example, adding or removing items from a list that tracks active toggles
    if (newValue) {
      lookingForThings.add(itemName.toLowerCase().replaceAll(' ', '-'));
      print(
          'Looking for things from the main: $toggleStates'); // log lookingforthings
    } else {
      lookingForThings.remove(itemName.toLowerCase().replaceAll(' ', '-'));
    }
  }

/* Does not work, doesn't update UI 
  void _onSearchTextChanged() {
    // Call setState to trigger a UI re-render
    _scaffoldKey.currentState?.setState(() {});
  }
 */

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
          // Search bar
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
          // Titles
          Expanded(
            child: ListView.builder(
              itemCount: _toggleNames.keys.length,
              itemBuilder: (context, index) {
                // Collapsed title
                String categoryName = _toggleNames.keys.elementAt(index);
                if (!(_isTitleVisible[categoryName] ?? false)) {
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _isTitleVisible[categoryName] =
                            !(_isTitleVisible[categoryName] ?? false);
                      });
                    },
                    child: Container(
                      height: 50.0,
                      color: Colors.red[500],
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      alignment: Alignment.centerLeft,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            categoryName,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Icon(
                            Icons.arrow_drop_up,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  );
                }

                List<String> toggleNames = _toggleNames[categoryName]!;
                // Expanded title
                return StickyHeader(
                  header: GestureDetector(
                    onTap: () {
                      setState(() {
                        _isTitleVisible[categoryName] =
                            !(_isTitleVisible[categoryName] ?? false);
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
                            categoryName,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Icon(
                            Icons.arrow_drop_down,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  ),
                  // switches inside the titles
                  content: (_isTitleVisible[categoryName] ?? false)
                      ? Column(
                          children: toggleNames.map((name) {
                            if (name == 'Toggle All') {
                              return CheckboxListTile(
                                title: Text('Find all $categoryName'),
                                value: toggleNames.skip(1).every((item) =>
                                    toggleStates.containsKey(item
                                        .toLowerCase()
                                        .replaceAll(' ', '-')) &&
                                    (toggleStates[item
                                            .toLowerCase()
                                            .replaceAll(' ', '-')] ??
                                        false)), // check if the value is already being searched for
                                onChanged: (bool? newValue) {
                                  if (newValue != null) {
                                    _toggleAllItemsInCategory(
                                        categoryName, newValue);
                                  }
                                },
                              );
                            } else {
                              return Visibility(
                                visible: _filteredNames.contains(name),
                                child: ToggleSwitch(
                                  passedName: name,
                                  isHighlighted: toggleStates[name
                                          .toLowerCase()
                                          .replaceAll(' ', '-')] ??
                                      false,
                                  onChanged: (bool newValue) {
                                    _handleToggleChange(
                                        name.toLowerCase().replaceAll(' ', '-'),
                                        newValue); // Update state when toggled
                                  },
                                ),
                              );
                            }
                          }).toList(),
                        )
                      : const SizedBox.shrink(),
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
                      child: Text(showAllSelected
                          ? 'Show everything'
                          : 'Show All Selected'),
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
