import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:sticky_headers/sticky_headers/widget.dart';
import 'package:whatsinmyfood/api.dart';
import 'package:whatsinmyfood/food_lists.dart';
import 'components/toggles.dart';
import 'components/alert.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'components/global_variables.dart';
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

// TODO:
// 1. show that the app is thinking when it is scanning something
// 2. style the app
// 3. add the rest of the food categories that you get

// Known bugs:
// Categories that are not active show up in results
// Scan doesn't happen sometimes

// nice to haves:
// hitting cancel on the camera shows an error

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
  bool showAllSelected = false;
  Map<String, bool> toggleStates = {};
  GlobalKey<ScaffoldState> _scaffoldKey =
      GlobalKey<ScaffoldState>(); // to allow re-render of search bar
  // categories of food
  final Map<String, List<String>> _toggleNames = {
    'Added Sugar': [...addedSugar],
    'Inflammatory foods': [...seedOils],
    'Vegetarian': [...nonVegetarian],
    'Vegan': [...nonVegan],
    'Common Allergens': [...commonAllergens],
    'Religious abstentions': [...haram],
    'High Environmental Impact': [],
    'GMOs': [],
    'Artificial colors and flavors': [],
    'Caffeine': [], // if possible
    'Internationally banned products': bannedInEU,
    'placeholder': [],
    'placeholder': [],
    'placeholder': [],
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
    _loadToggleStates(); // retrieve state from user's device
    //_searchController.addListener(_onSearchTextChanged);
  }

  void showLoadingDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return const AlertDialog(
          content: Row(
            children: [
              CircularProgressIndicator(),
              SizedBox(width: 20),
              Text("Scanning your item..."),
            ],
          ),
        );
      },
    );
  }

  void showProcessingDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          content: Row(
            children: [
              CircularProgressIndicator(),
              SizedBox(width: 20),
              Text(message),
            ],
          ),
        );
      },
    );
  }

  void dismissLoadingDialog(BuildContext context) {
    Navigator.of(context, rootNavigator: true).pop();
  }

  // Logic to remove unwanted categories from results unfinished
  bool isCategoryActive(String category) {
    for (var item in _toggleNames[category]!) {
      String formattedName = item.toLowerCase().replaceAll(' ', '-');
      if (toggleStates[formattedName] == true) {
        return true;
      }
    }
    return false;
  }

  Future<void> _loadToggleStates() async {
    final prefs = await SharedPreferences.getInstance();
    final String? savedStates = prefs.getString('toggleStates');
    if (savedStates != null) {
      setState(() {
        toggleStates = Map<String, bool>.from(jsonDecode(savedStates));
        lookingForThings.clear();
        toggleStates.forEach((key, value) {
          if (value) {
            lookingForThings.add(key);
          }
        });
      });
    }
  }

  Future<void> _saveToggleStates() async {
    final prefs = await SharedPreferences.getInstance();
    final String encodedStates = jsonEncode(toggleStates);
    await prefs.setString('toggleStates', encodedStates);
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
          String formattedName = item.toLowerCase().replaceAll(' ', '-');
          toggleStates[formattedName] = value;
          if (value) {
            lookingForThings.add(formattedName);
          } else {
            lookingForThings.remove(formattedName);
          }
        }
      }
      _saveToggleStates(); // Save the state whenever it changes
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
      toggleStates[itemName] = newValue;
      String formattedName = itemName.toLowerCase().replaceAll(' ', '-');
      if (newValue) {
        lookingForThings.add(formattedName);
      } else {
        lookingForThings.remove(formattedName);
      }
      _saveToggleStates(); // Save the state whenever it changes
    });
    //print('Toggle states from the main: $toggleStates'); // Log toggleStates
  }

  void toggleTitleVisibility(String category) {
    setState(() {
      _isTitleVisible[category] = !_isTitleVisible[category]!;
    });
    // Re-filter the list when title visibility changes
    _filterList(_searchController.text);
  }

  bool areAllItemsSelected(String category) {
    for (var item in _toggleNames[category]!) {
      if (item != 'Toggle All') {
        String formattedName = item.toLowerCase().replaceAll(' ', '-');
        if (toggleStates[formattedName] != true) {
          return false;
        }
      }
    }
    return true;
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
                          Row(
                            children: [
                              // Toggle All/Deselect All Button
                              ElevatedButton(
                                onPressed: () {
                                  bool allSelected =
                                      areAllItemsSelected(categoryName);
                                  _toggleAllItemsInCategory(
                                      categoryName, !allSelected);
                                },
                                child: Text(
                                  areAllItemsSelected(categoryName)
                                      ? 'Deselect All'
                                      : 'Select All',
                                ),
                              ),
                              const Icon(
                                Icons.arrow_drop_down,
                                color: Colors.white,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  content: (_isTitleVisible[categoryName] ?? false)
                      ? Column(
                          children: toggleNames.map((name) {
                            // Ensure keys match formatting
                            String formattedName =
                                name.toLowerCase().replaceAll(' ', '-');
                            bool isHighlighted =
                                toggleStates[formattedName] ?? false;

                            return Visibility(
                              visible: _filteredNames.contains(name),
                              child: ToggleSwitch(
                                passedName: name,
                                isHighlighted: isHighlighted,
                                onChanged: (bool newValue) {
                                  _handleToggleChange(formattedName,
                                      newValue); // Update state when toggled
                                },
                              ),
                            );
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
      if (lookingForThings.isEmpty) {
        showAlert(
          context,
          'Nothing Selected',
          'You need to select something to filter for',
        );
        return;
      }

      showProcessingDialog(context, "Scanning your item...");
      print("Scanning dialog shown");

      try {
        final res = await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const SimpleBarcodeScannerPage(),
          ),
        );

        if (res is String) {
          setState(() {
            barCodeScanResult = res;
          });

          if (mounted) {
            Navigator.of(context).pop(); // Dismiss the scanning dialog
            print("Scanning dialog dismissed");
            showProcessingDialog(context, "Processing your item...");
            print("Processing dialog shown");
          }

          // Perform the API request
          bool success = await makeGetRequest(barCodeScanResult, foundThings, context);
          print("API request completed. Success: $success");

          // Dismiss the processing dialog with a delay
          if (mounted) {
            Future.delayed(Duration.zero, () {
              Navigator.of(context).pop();
              print("Processing dialog dismissed");
              
              // Show error alert if the API request failed
              if (!success) {
                showAlert(
                  context,
                  'Error',
                  'Failed to process the item. Please try again.',
                );
              }
            });
          }
        } else {
          throw Exception('Barcode scanning failed or was cancelled');
        }
      } catch (e) {
        print('Error occurred: $e');
        if (mounted) {
          // Dismiss any existing dialog with a delay
          Future.delayed(Duration.zero, () {
            Navigator.of(context).pop();
            print("Error: dialog dismissed");
            
            showAlert(
              context,
              'Error',
              'An error occurred while processing your request. Please try again.',
            );
          });
        }
      }
    },
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.blue,
      foregroundColor: Colors.white,
    ),
    child: const Text(
      'SCAN',
      style: TextStyle(color: Colors.white),
    ),
  ),
)
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
