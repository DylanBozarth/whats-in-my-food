"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useGlobalState } from "./global_variables"
import { useState, useEffect } from "react"
import foodCategories from "./food_list"

// Function to format category names
const formatCategoryName = (categoryKey) => {
  // Default formatting: capitalize first letter of each word
  return categoryKey
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim()
}

export default function SelectedIngredients() {
  const { lookingForThings, setLookingForThings } = useGlobalState()
  const [groupedIngredients, setGroupedIngredients] = useState({})
  const [individualIngredients, setIndividualIngredients] = useState([])

  // Group ingredients into lists when the component mounts or lookingForThings changes
  useEffect(() => {
    if (!lookingForThings || lookingForThings.length === 0) return

    const grouped = {}
    const individual = []

    // Check if any predefined lists are completely included
    Object.entries(foodCategories).forEach(([categoryKey, categoryItems]) => {
      const allItemsIncluded = categoryItems.every((item) =>
        lookingForThings.some((ingredient) => ingredient.toLowerCase() === item.toLowerCase()),
      )

      if (allItemsIncluded) {
        grouped[categoryKey] = categoryItems
      }
    })

    // Add remaining ingredients that aren't part of a complete list
    lookingForThings.forEach((ingredient) => {
      const isInCompleteList = Object.values(grouped).some((list) =>
        list.some((item) => item.toLowerCase() === ingredient.toLowerCase()),
      )

      if (!isInCompleteList) {
        individual.push(ingredient)
      }
    })

    setGroupedIngredients(grouped)
    setIndividualIngredients(individual)
  }, [lookingForThings])

  const removeIngredient = (ingredient) => {
    setLookingForThings(lookingForThings.filter((item) => item !== ingredient))
  }

  const removeList = (categoryKey) => {
    if (categoryKey in foodCategories) {
      // Get the list of ingredients to remove
      const listItems = foodCategories[categoryKey]

      // Convert all items to lowercase for case-insensitive comparison
      const listItemsLower = listItems.map((item) => item.toLowerCase())

      // Filter out all ingredients that match any item in the list (case-insensitive)
      const newIngredients = lookingForThings.filter((ingredient) => {
        const ingredientLower = ingredient.toLowerCase()
        return !listItemsLower.includes(ingredientLower)
      })

      // Log for debugging
      console.log(`Removing list: ${categoryKey}`)
      console.log(`Items to remove: ${listItems.length}`)
      console.log(`Before: ${lookingForThings.length} ingredients`)
      console.log(`After: ${newIngredients.length} ingredients`)

      // Update state with the filtered list
      setLookingForThings(newIngredients)
    } else {
      console.error(`Invalid category key: ${categoryKey}`)
    }
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

  if (!lookingForThings || lookingForThings.length === 0) {
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
        {/* Display list names for complete lists */}
        {Object.keys(groupedIngredients).map((categoryKey) => (
          <View key={categoryKey} style={styles.listChip}>
            <TouchableOpacity onPress={() => removeList(categoryKey)}>
              <Text style={styles.listChipText}>{formatCategoryName(categoryKey)}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Display individual ingredients */}
        {individualIngredients.map((ingredient) => (
          <View key={ingredient} style={styles.chip}>
            <TouchableOpacity onPress={() => removeIngredient(ingredient)}>
              <Text style={styles.chipText}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.hintText}>Touch to remove ingredients or lists</Text>

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
  listChip: {
    backgroundColor: "#4361EE",
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
  listChipText: {
    fontSize: 14,
    marginRight: 4,
    color: "white",
    fontWeight: "500",
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
