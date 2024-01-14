import 'package:flutter/material.dart';
import 'openCamera.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Whats in my food?',
            style: TextStyle(
                color: Colors.white,
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.bold,
                fontFamily: 'Arial'),
          ),
          centerTitle: true,
          backgroundColor: Colors.deepOrangeAccent,
        ),
        body: Container(
          color: Colors.black, // Set the background color here
          child: const Center(
            child: Text(
              'What do you want to avoid?',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
                color: Colors.white, // Set the text color
              ),
            ),
            // buttons here
          ),
        ),
        floatingActionButton: Container(
          width: double.infinity,
          margin: const EdgeInsets.all(16.0),
          child: FloatingActionButton.extended(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return FutureBuilder(
                      future: takePhotoOfBarcode(),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.done) {
                          return snapshot.data as Widget;
                        } else {
                          return const CircularProgressIndicator();
                        }
                      },
                    );
                  },
                ),
              );
            },
            label: const Text('SCAN'),
            icon: const Icon(
                Icons.barcode_reader), // You can customize the icon as needed
          ),
        ),
      ),
    );
  }
}
