import 'package:flutter/material.dart';

/// Flutter code sample for migrating from [ToggleButtons] to [SegmentedButton].

enum ShirtSize { extraSmall, small, medium, large, extraLarge }

const List<(ShirtSize, String)> shirtSizeOptions = <(ShirtSize, String)>[
  (ShirtSize.extraSmall, 'Seed oils'),
  (ShirtSize.small, 'S'),
  (ShirtSize.medium, 'M'),
  (ShirtSize.large, 'L'),
  (ShirtSize.extraLarge, 'XL'),
];

class ToggleButtonsExample extends StatefulWidget {
  const ToggleButtonsExample({super.key});

  @override
  State<ToggleButtonsExample> createState() => _ToggleButtonsExampleState();
}

class _ToggleButtonsExampleState extends State<ToggleButtonsExample> {
  Set<ShirtSize> _segmentedButtonSelection = <ShirtSize>{ShirtSize.medium};

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: <Widget>[
          SegmentedButton<ShirtSize>(
            // ToggleButtons above allows multiple or no selection.
            // Set `multiSelectionEnabled` and `emptySelectionAllowed` to true
            // to match the behavior of ToggleButtons.
            multiSelectionEnabled: true,
            emptySelectionAllowed: true,
            // Hide the selected icon to match the behavior of ToggleButtons.
            showSelectedIcon: false,
            // SegmentedButton uses a Set<T> to track its selection state.
            selected: _segmentedButtonSelection,
            // This callback updates the set of selected segment values.
            onSelectionChanged: (Set<ShirtSize> newSelection) {
              setState(() {
                _segmentedButtonSelection = newSelection;
              });
            },
            // SegmentedButton uses a List<ButtonSegment<T>> to build its children
            // instead of a List<Widget> like ToggleButtons.
            segments: shirtSizeOptions
                .map<ButtonSegment<ShirtSize>>(((ShirtSize, String) shirt) {
              return ButtonSegment<ShirtSize>(
                  value: shirt.$1, label: Text(shirt.$2));
            }).toList(),
          ),
        ],
      ),
    );
  }
}
