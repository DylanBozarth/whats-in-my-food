import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useGlobalState } from "./global_variables"

export default function SelectedIngredients() {
  const { lookingForThings, setLookingForThings } = useGlobalState()

  const removeIngredient = (ingredient: string) => {
    setLookingForThings(lookingForThings.filter((item) => item !== ingredient))
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
      <Text style={styles.title}>Selected Ingredients:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {lookingForThings.map((ingredient) => (
          <View key={ingredient} style={styles.chip}>
            <Text style={styles.chipText}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</Text>
            <TouchableOpacity onPress={() => removeIngredient(ingredient)} style={styles.removeButton}>
              <Ionicons name="close-circle" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  chipText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
})

