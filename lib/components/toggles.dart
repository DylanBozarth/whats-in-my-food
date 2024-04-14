import 'package:flutter/material.dart';
import 'global_variables.dart';

class ToggleSwitch extends StatefulWidget {
  final String passedName; // New variable to be passed as an argument

  const ToggleSwitch({
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
    isSwitched = lookingForThings
        .contains(widget.passedName.toLowerCase().replaceAll(' ', '-'));
  }

  @override
  Widget build(BuildContext context) {
    isSwitched = lookingForThings
        .contains(widget.passedName.toLowerCase().replaceAll(' ', '-'));

    return Container(
      child: Row(
        children: [
          Switch(
            value: isSwitched,
            onChanged: (value) {
              setState(() {
                isSwitched = value;
              });
              if (value) {
                lookingForThings
                    .add(widget.passedName.toLowerCase().replaceAll(' ', '-'));
              } else {
                lookingForThings.remove(
                    widget.passedName.toLowerCase().replaceAll(' ', '-'));
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
      ),
    );
  }
}
