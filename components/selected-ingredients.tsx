import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useGlobalState } from "./global_variables"

export default function SelectedIngredients() {
  const { lookingForThings, setLookingForThings } = useGlobalState()

  const removeIngredient = (ingredient: string) => {
    setLookingForThings(lookingForThings.filter((item: string) => item !== ingredient))
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {lookingForThings.map((ingredient: string) => (
          <View key={ingredient} style={styles.chip}>
            <TouchableOpacity onPress={() => removeIngredient(ingredient)}>
              <Text style={styles.chipText}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</Text>
            
             
            </TouchableOpacity>
            
          </View>
        ))}
        <Text>Touch to remove ingredients</Text>
      </ScrollView>
    </View>
  );
  
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
    paddingHorizontal: 16,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 4,
    
  },
  chipText: {
    fontSize: 14,
    margin: 6,
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
});
