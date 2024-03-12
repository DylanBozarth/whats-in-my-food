import 'package:flutter/material.dart';
import 'package:whatsinmyfood/main.dart';

class ResultsPage extends StatelessWidget {
  final List<String> passedResults;
  final BuildContext context;
  const ResultsPage({
    Key? key,
    required this.passedResults,
    required this.context,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [Text('YOUR RESULTS: $passedResults'),
        Center(
            child: ElevatedButton(
              onPressed: () async {
                var res = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const HomePage(),
                  ),
                );
                
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              child: const Text(
                'Go Back',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),] 
      ),
    );
  }
}
