void fetchBarcodeData() {
  FoodData currentScan = FoodData();
  print(currentScan);
}

// the first word is what the function should return
String returnSomething() {
  return 'Something';
}

class FoodData {
  String name = 'food';
  int barcodeNumber = 12323123;

  void scanFood() {
    print('FOOD SCAN');
  }
}
