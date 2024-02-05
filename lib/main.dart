import 'package:flutter/material.dart';
import 'open_camera.dart';

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
