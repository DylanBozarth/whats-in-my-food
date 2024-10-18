// Define the keyword lists
/* 
val keywordLists: List<Map<String, List<String>>> = listOf(
    mapOf("seed-oils" to seedOils),
    mapOf("bugs" to bugs),
    mapOf("banned-in-eu" to bannedInEU),
    mapOf("non-vegetarian" to nonVegetarian),
    mapOf("non-vegan" to nonVegan),
    mapOf("haram" to haram),
    mapOf("heavy-metals" to heavyMetals),
    mapOf("added-sugar" to addedSugar),
    mapOf("dairy" to dairy),
    mapOf("nuts" to nuts)
)

// Define the individual ingredient lists
val seedOils: List<String> = listOf(
    "vegetable oil", "canola oil", "sunflower oil", "palm oil", "palm kernel oil",
    "soybean oil", "cottonseed oil", "safflower oil", "sesame oil", "grapeseed oil",
    "flaxseed oil", "hemp seed oil", "mustard seed oil", "chia seed oil", "pumpkin seed oil",
    "poppy seed oil", "sunflower lecithin", "safflower oleosomes", "grapeseed extract",
    "flaxseed meal", "hemp seed protein", "pumpkin seed protein", "poppy seed paste",
    "mustard seed powder", "cottonseed meal", "chia seed gel"
)

val bugs: List<String> = listOf(
    "Crickets", "Cricket flour", "Mealworms", "Mealworm flour", "Black soldier fly larvae",
    "Insect protein isolate", "Silkworm pupae", "Grasshoppers", "Locusts", "Ant larvae",
    "Cricket oil", "Chitin"
)

val commonAllergens: List<String> = listOf(
    "toggle all", "Peanuts", "almonds", "cashews", "walnuts", "hazelnuts", "Milk", "Eggs", "salmon",
    "tuna", "cod", "crab", "lobster", "shrimp", "prawns", "Wheat", "Soy", "Sesame seeds", "Mustard",
    "Celery", "Sulfites", "Lupin", "snails", "squid", "octopus", "Corn", "Gluten", "Coconut",
    "Kiwi", "Banana", "Avocado", "Chocolate", "Garlic", "Onion", "Peach", "Strawberry", "Tomato",
    "Cherry", "Pineapple", "Melon", "Citrus fruits", "Apple", "Grape", "Watermelon"
)

val artificialAdditivesInFood: List<String> = listOf(
    "Red 40", "Yellow 5", "Yellow 6", "Blue 1", "Blue 2", "Green 3", "Red 3", "Caramel color",
    "Titanium dioxide", "Carmine", "Ethyl vanillin", "Methyl salicylate", "Isoamyl acetate",
    "Ethyl maltol", "Benzaldehyde", "Limonene", "Ethyl butyrate", "Diacetyl", "Methyl anthranilate",
    "Linalool", "Ethyl acetate", "Allyl hexanoate", "Cinnamaldehyde", "Menthol", "Vanillin",
    "Acetoin", "Furaneol", "Isobutyl acetate", "Gamma-undecalactone", "Methyl cinnamate"
)

val bannedInEU: List<String> = listOf(
    "BHA", "Butylated Hydroxyanisole", "BHT", "Butylated Hydroxytoluene", "Cyclamate", "E952",
    "Aspartame", "E951", "Tartrazine", "E102", "Quinoline Yellow", "E104", "Sunset Yellow FCF",
    "E110", "Allura Red AC", "E129", "Ponceau 4R", "E124", "Azorubine/Carmoisine", "E122",
    "Brominated Vegetable Oil (BVO)", "Potassium Nitrate", "Sodium Nitrite", "Monosodium Glutamate"
)

val nonVegetarian: List<String> = listOf(
    "Beef", "Pork", "Chicken", "Turkey", "Duck", "Lamb", "Venison", "Fish", "Shellfish", "Shrimp",
    "Crab", "Lobster", "Mussels", "Squid", "Octopus", "Clams", "Anchovies", "Bacon", "Salmon",
    "Tuna", "Sausage", "Pepperoni", "Ham", "Salami", "Pate", "Liver", "Kidney", "Tripe", "Tongue",
    "Gelatin", "Rennet", "Worcestershire sauce", "Fish sauce", "Oyster sauce", "Anchovy paste",
    "Isinglass", "Lard", "Schmaltz", "Ghee", "clarified butter", "Pepsin", "Cochineal", "Shellac",
    "L-cysteine"
)

val onlyVegan: List<String> = listOf(
    "Gelatin", "Honey", "Beeswax", "Carmine (E120)", "Casein", "Lactose", "Whey", "Isinglass",
    "Shellac (E904)", "Lard", "Schmaltz", "Ghee", "clarified butter", "Cochineal", "Pepsin",
    "Collagen", "Elastin", "Keratin", "Rennet", "Tallow", "Diglyceride", "Stearic Acid",
    "Magnesium Stearate", "Omega3 Fatty Acids", "Cysteine", "Guanine", "Squalene"
)

val nonVegan: List<String> = nonVegetarian + onlyVegan + dairy

val addedSugar: List<String> = listOf(
    "Sugar", "High fructose corn syrup", "Honey", "Maple syrup", "Corn syrup", "Brown sugar",
    "Powdered sugar", "Cane sugar", "Confectioner's sugar", "Molasses", "Fructose", "Glucose",
    "syrup", "Dextrose", "Sucrose", "Corn sweetener", "Corn syrup solids", "Crystalline fructose",
    "Caramel", "Agave nectar", "Coconut sugar", "Date sugar", "Golden syrup", "Treacle",
    "Fruit juice concentrate", "Invert sugar", "Raw sugar", "Refiner's syrup", "Turbinado sugar"
)

val dairy: List<String> = listOf(
    "Milk", "Butter", "Cheese", "Yogurt", "Cream", "Sour cream", "Cream cheese", "Cottage cheese",
    "Mascarpone", "Ricotta", "Condensed milk", "Evaporated milk", "Powdered milk", "Ice cream",
    "Gelato", "Sherbet", "Frozen yogurt", "Whipped cream", "Milk powder", "Cheese powder", "Whey",
    "Casein", "Lactose", "Buttermilk", "Kefir", "Clotted cream", "Goat milk", "Sheep milk"
)

val forbiddenPork: List<String> = listOf(
    "Pork", "Gelatin", "Lard", "Lard oil", "Pork flavoring", "Bacon", "Ham", "Sausage", "Pork pastrami",
    "prosciutto", "pancetta", "coppa", "capicola", "guanciale", "fatback"
)

val nuts: List<String> = listOf(
    "Almonds", "Almond butter", "Almond extract", "Almond meal/flour", "Almond milk", "Brazil nuts",
    "Cashews", "Cashew butter", "Cashew milk", "Chestnuts", "Hazelnuts", "Filberts", "Hazelnut butter",
    "Macadamia nuts", "Macadamia nut oil", "Peanuts", "Peanut butter", "Peanut oil", "Pecans",
    "Pine nuts", "Pistachios", "Walnuts", "Nut meal/flour", "Nut milk", "Nut oil", "Nut butter"
)

val haram: List<String> = forbiddenPork + bugs + listOf("Alcohol", "Ethyl alcohol")

val heavyMetals: List<String> = listOf()
*/