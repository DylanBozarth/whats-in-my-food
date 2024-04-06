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
  List<String> _filteredNames = [];
  List<String> foundThings = [];
  @override
  void initState() {
    super.initState();
    _filteredNames.addAll(_toggleNames.values.expand((list) => list).toList());
  }

  void _filterList(String query) {
    List<String> filteredList = [];
    if (query.isNotEmpty) {
      for (var category in _toggleNames.values) {
        for (String name in category) {
          if (name.toLowerCase().contains(query.toLowerCase())) {
            filteredList.add(name);
          }
        }
      }
    } else {
      filteredList.addAll(_toggleNames.values.expand((list) => list).toList());
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
          Padding(
            padding: const EdgeInsets.all(8.0),
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
            child: ListView.builder(
              itemCount: _toggleNames.length * 2 - 1, // for separators
              itemBuilder: (context, index) {
                if (index.isOdd) {
                  return Divider(); // separator
                }
                final categoryIndex = index ~/ 2;
                final categoryName = _toggleNames.keys.toList()[categoryIndex];
                final toggleNames = _toggleNames.values.toList()[categoryIndex];
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      child: Text(
                        categoryName,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    ...toggleNames
                        .where((name) => _filteredNames.contains(name))
                        .map((name) {
                      return ToggleSwitch(passedName: name);
                    }).toList(),
                  ],
                );
              },
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
