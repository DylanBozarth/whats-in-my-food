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
          title: const Text("What's in my food?"),
          centerTitle: true,
        ),
        body: const Center(child: Text('Select ingredients')),
        floatingActionButton: FloatingActionButton(
          child: Text('SCAN'),
          onPressed: () => null,
        ),
      ),
    );
  }
}
