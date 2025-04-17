import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useGlobalState } from "./global_variables"

export default function SelectedIngredients() {
  const { lookingForThings, setLookingForThings } = useGlobalState()

  const removeIngredient = (ingredient: string) => {
    setLookingForThings(lookingForThings.filter((item: string) => item !== ingredient))
  }

  const handleClearAll = () => {
    Alert.alert("Clear All Ingredients", "Are you sure you want to remove all ingredients?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear All",
        onPress: () => setLookingForThings([]),
        style: "destructive",
      },
    ])
  }

  if (!lookingForThings.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No ingredients selected</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are searching for:</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
        {lookingForThings.map((ingredient: string) => (
          <View key={ingredient} style={styles.chip}>
            <TouchableOpacity onPress={() => removeIngredient(ingredient)}>
              <Text style={styles.chipText}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.hintText}>Touch to remove ingredients</Text>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
        <Text style={styles.clearButtonText}>Clear All Ingredients</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  chipText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeIcon: {
    marginLeft: 2,
  },
  hintText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
  clearButton: {
    marginTop: 12,
    backgroundColor: "#FF4D6D",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
})
