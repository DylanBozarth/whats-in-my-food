import 'package:flutter/material.dart';
import 'example.dart';
import 'functions.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    MyUtils.myFunction();
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
            backgroundColor: Colors.green,
            title: const Text("What's in my food?")),
      ),
    );
  }
}
