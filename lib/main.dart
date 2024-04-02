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
  final List<String> _toggleNames = [
    "Added Sugar",
    "Seed Oils",
    "Dairy",
    "Non Vegan",
    "Nuts"
  ];
  final List<String> _filteredNames = [];
  List<String> foundThings = [];

  @override
  void initState() {
    super.initState();
    _filteredNames.addAll(_toggleNames);
  }

  void _filterList(String query) {
    List<String> filteredList = [];
    if (query.isNotEmpty) {
      for (String name in _toggleNames) {
        if (name.toLowerCase().contains(query.toLowerCase())) {
          filteredList.add(name);
        }
      }
    } else {
      filteredList.addAll(_toggleNames);
    }
    setState(() {
      _filteredNames.clear();
      _filteredNames.addAll(filteredList);
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
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'What are you looking for?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Arial',
                ),
              ),
              // Add other widgets as needed
            ],
          ),
          Column(children: [
            TextField(
              controller: _searchController,
              onChanged: _filterList,
              decoration: const InputDecoration(
                labelText: 'Search',
                hintText: 'Search for toggle',
                prefixIcon: Icon(Icons.search),
              ),
            ),
            ListView.builder(
              shrinkWrap: true,
              itemCount: _filteredNames.length,
              itemBuilder: (context, index) {
                return ToggleSwitch(passedName: _filteredNames[index]);
              },
            ),
          ]),
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
                            )),
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
