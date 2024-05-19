//import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Provider for managing a list of strings
final lookingForThingsProvider = StateProvider<List<String>>((ref) {
  return [];
});

List<String> lookingForThings = [];

//List<String> lookingForThings = ref.watch(lookingForThingsProvider);