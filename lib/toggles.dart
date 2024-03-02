import 'package:flutter/material.dart';

class ToggleSwitch extends StatefulWidget {
  final String passedName; // New variable to be passed as an argument
  List<String> lookingForThings;

  ToggleSwitch({
    Key? key,
    required this.passedName,
    required this.lookingForThings,
  }) : super(key: key);

  @override
  _ToggleSwitchState createState() => _ToggleSwitchState();
}

class _ToggleSwitchState extends State<ToggleSwitch> {
  bool isSwitched = false;

  void _toggleSwitch(bool value) {
    setState(() {
      isSwitched = value;
    });
    if (value) {
      // If the toggle is set to true, add the value to the array
      widget.lookingForThings.add(widget.passedName);
    } else {
      // If the toggle is set to false, remove the value from the array
      widget.lookingForThings.remove(widget.passedName);
    }
    print(widget.lookingForThings);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          Switch(
            value: isSwitched,
            onChanged: _toggleSwitch,
            activeTrackColor: Colors.lightGreenAccent,
            activeColor: Colors.green,
          ),
          Text(
            widget.passedName,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
