/*import 'package:flutter/material.dart';

class ToggleSwitchContainer extends StatefulWidget {
  final Widget child;

  const ToggleSwitchContainer({Key? key, required this.child})
      : super(key: key);

  @override
  _ToggleSwitchContainerState createState() => _ToggleSwitchContainerState();
}

class _ToggleSwitchContainerState extends State<ToggleSwitchContainer> {
  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}

class ToggleSwitch extends StatelessWidget {
  final String passedName;
  final bool isHighlighted; // Indicates if the switch should be highlighted
  final Function(bool) onChanged; // Callback to handle changes

  const ToggleSwitch({
    Key? key,
    required this.passedName,
    required this.isHighlighted,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        children: [
          Switch(
            value: isHighlighted,
            onChanged: (value) {
              onChanged(value); // Call the passed callback function
            },
            activeTrackColor: Colors.lightGreenAccent,
            activeColor: Colors.green,
          ),
          Text(
            passedName,
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

 */