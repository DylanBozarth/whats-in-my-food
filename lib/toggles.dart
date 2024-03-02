import 'package:flutter/material.dart';

class ToggleSwitch extends StatefulWidget {
  final String name; // New variable to be passed as an argument

  ToggleSwitch({Key? key, required this.name}) : super(key: key);

  @override
  _ToggleSwitchState createState() => _ToggleSwitchState();
}

class _ToggleSwitchState extends State<ToggleSwitch> {
  bool isSwitched = false;

  void _toggleSwitch(bool value) {
    setState(() {
      isSwitched = value;
    });
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
            isSwitched ? 'Switch is ON' : 'Switch is OFF',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
