import 'package:flutter/material.dart';

enum LookingFor {seedOils, Bugs, medium, large, extraLarge }

const List<(LookingFor, String)> lookingForOptions = <(LookingFor, String)>[
  (LookingFor.seedOils, 'Seed oils'),
  (LookingFor.Bugs, 'Bugs'),
  (LookingFor.medium, 'M'),
  (LookingFor.large, 'L'),
  (LookingFor.extraLarge, 'XL'),
];

class ToggleButtonsExample extends StatefulWidget {
  const ToggleButtonsExample({super.key});

  @override
  State<ToggleButtonsExample> createState() => _ToggleButtonsExampleState();
}

class _ToggleButtonsExampleState extends State<ToggleButtonsExample> {
  Set<LookingFor> _userSelectedList = <LookingFor>{};

  Set<LookingFor> get userSelectedList => _userSelectedList;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: <Widget>[
          
          SegmentedButton<LookingFor>(
            // ToggleButtons above allows multiple or no selection.
            // Set `multiSelectionEnabled` and `emptySelectionAllowed` to true
            // to match the behavior of ToggleButtons.
            multiSelectionEnabled: true,
            emptySelectionAllowed: true,
            // Hide the selected icon to match the behavior of ToggleButtons.
            showSelectedIcon: false,
            // SegmentedButton uses a Set<T> to track its selection state.
            selected: _userSelectedList,
            // This callback updates the set of selected segment values.
            onSelectionChanged: (Set<LookingFor> newSelection) {
              setState(() {
                _userSelectedList = newSelection;
                print('Selected Parts: $_userSelectedList');
              });
            },
            // SegmentedButton uses a List<ButtonSegment<T>> to build its children
            // instead of a List<Widget> like ToggleButtons.
            segments: lookingForOptions
                .map<ButtonSegment<LookingFor>>(((LookingFor, String) shirt) {
              return ButtonSegment<LookingFor>(
                  value: shirt.$1, label: Text(shirt.$2));
            }).toList(),
          ),
          ElevatedButton(onPressed: () => print(userSelectedList), child: Text('log state'))
        ],
      ),
    );
  }
}
