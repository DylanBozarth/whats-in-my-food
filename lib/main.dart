import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:whatsinmyfood/api.dart';
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
    'Added Sugar': ["Added Sugar", "Dairy"],
    'Category 2': ["Seed Oils", "Non Vegan", "Nuts"],
    'Meat Products': [],
  };
  final Map<String, bool> _isExpanded = {};
  List<String> _filteredNames = [];
  List<String> foundThings = [];
  @override
  void initState() {
    super.initState();
    _filteredNames.addAll(_toggleNames.values.expand((list) => list).toList());
    _toggleNames.keys.forEach((category) {
      _isExpanded[category] = true;
    });
  }

  void _filterList(String query) {
    List<String> filteredList = [];
    if (query.isNotEmpty) {
      for (var entry in _toggleNames.entries) {
        if (_isExpanded[entry.key] ?? false) {
          // Only include toggle names from expanded categories
          for (String name in entry.value) {
            if (name.toLowerCase().contains(query.toLowerCase())) {
              filteredList.add(name);
              print(filteredList);
            }
          }
        }
      }
    } else {
      // If query is empty, include all toggle names from expanded categories
      for (var entry in _toggleNames.entries) {
        if (_isExpanded[entry.key] ?? false) {
          filteredList.addAll(entry.value);
        }
      }
    }
    setState(() {
      _filteredNames = filteredList;
    });
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
      backgroundColor: Colors.blueAccent,
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
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              onChanged: _filterList,
              decoration: const InputDecoration(
                labelText: 'Search',
                hintText: 'Search for toggle',
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
                  title: Text(
                    categoryName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
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
                          // Check if name is in filtered names
                          return ToggleSwitch(passedName: name);
                        } else {
                          return SizedBox(); // Return an empty SizedBox if name is not in filtered names
                        }
                      },
                    ),
                  ],
                  onExpansionChanged: (value) {
                    setState(() {
                      _isExpanded[categoryName] = value;
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
