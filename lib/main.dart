import 'package:flutter/material.dart';

void main() {
  runApp(const MaterialApp(
    title: 'Navigation Basics',
    home: FirstRoute(),
  ));
}

class FirstRoute extends StatelessWidget {
  const FirstRoute({super.key});

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
                fontFamily: 'Arial'),
          ),
          centerTitle: true,
          backgroundColor: Colors.deepOrangeAccent,
        ),
        backgroundColor: Colors.black,
        body: Column(
          children: [
            Container(
              child: const Text(
                'What are you looking for?',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Arial'),
              ),
            ),
            Center(
              child: ElevatedButton(
                child: const Text('Open route'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const OpenCamera()),
                  );
                },
              ),
            ),
          ],
        ));
  }
}

class OpenCamera extends StatelessWidget {
  const OpenCamera({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Second Route'),
      ),
      backgroundColor: Colors.black,
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Go back!'),
        ),
      ),
    );
  }
}
