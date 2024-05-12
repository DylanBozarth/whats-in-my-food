import 'package:flutter/material.dart';

// Assuming global_variables.dart contains a list of active items:
// List<String> lookingForThings;

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

class ToggleSwitch extends StatefulWidget {
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
  _ToggleSwitchState createState() => _ToggleSwitchState();
}

class _ToggleSwitchState extends State<ToggleSwitch> {
  late bool isSwitched; // State managed by the parent now

  @override
  void initState() {
    super.initState();
    // Initialize the switch state based on the passed value
    isSwitched = widget.isHighlighted;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        children: [
          Switch(
            value: isSwitched,
            onChanged: (value) {
              setState(() {
                isSwitched = value; // Update the local state
              });
              widget.onChanged(value); // Call the passed callback function
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
