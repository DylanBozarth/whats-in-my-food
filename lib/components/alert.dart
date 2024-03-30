import 'package:flutter/material.dart';

Widget showAlert(BuildContext context, String title, String message) {
  return AlertDialog(
    title: Text(title),
    content: Text(message),
    actions: [
      TextButton(
        onPressed: () {
          Navigator.of(context).pop();
        },
        child: const Text("OK"),
      ),
    ],
  );
}
