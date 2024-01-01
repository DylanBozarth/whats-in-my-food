void fetchBarcodeData() {
  // List currentScan = FoodData('cheese', 123, 'aaa');
}

// the first word is what the function should return
String returnSomething() {
  return 'Something';
}

class FoodData {
  String name = '';
  int barcodeNumber = 0;
  String ingredients = '';

  FoodData(String name, int bn, String ing) {
    name = name;
    barcodeNumber = bn;
    ingredients = ing;
  }
}
