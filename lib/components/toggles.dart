import 'package:flutter/material.dart';
import 'global_variables.dart'; // Assuming this is where lookingForThings is defined as a global variable

class ToggleSwitch extends StatefulWidget {
  final String passedName; // New variable to be passed as an argument

  ToggleSwitch({
    Key? key,
    required this.passedName,
  }) : super(key: key);

  @override
  _ToggleSwitchState createState() => _ToggleSwitchState();
}

class _ToggleSwitchState extends State<ToggleSwitch> {
  bool isSwitched = false;

  @override
  void initState() {
    super.initState();
    // Check if lookingForThings contains passedName
    isSwitched = lookingForThings.contains(widget.passedName.toLowerCase());
    print(lookingForThings);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Switch(
          value: isSwitched,
          onChanged: (value) {
            setState(() {
              isSwitched = value;
            });
            if (value) {
              lookingForThings.add(widget.passedName.toLowerCase());
            } else {
              lookingForThings.remove(widget.passedName.toLowerCase());
            }
          },
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
    );
  }
}
