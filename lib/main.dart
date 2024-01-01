import 'package:flutter/material.dart';
import 'functions.dart';

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
          color: Colors.blue, // Set the background color here
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
        floatingActionButton: FloatingActionButton(
          backgroundColor: Colors.red[600],
          onPressed: () {},
          child: const Text('SCAN'),
        ),
      ),
    );
  }
}
