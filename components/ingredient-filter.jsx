"use client"

import { useState, useCallback, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useGlobalState } from "./global_variables"
// Import the normalizeIngredient function at the top of the file
import foodCategories, { alternateNames } from "./food_list"

export default function IngredientFilter({ onClose }) {
  const { lookingForThings, setLookingForThings } = useGlobalState()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedIngredients, setSelectedIngredients] = useState(lookingForThings || [])
  const screenWidth = Dimensions.get("window").width

  // Calculate item dimensions
  const itemWidth = (screenWidth - 48) / 2
  const itemHeight = 44 // Fixed height for category items

  // Calculate container height to show exactly 3 rows (6 items)
  const categoryContainerHeight = (itemHeight + 8) * 3 // 3 rows with 8px margin

  // Get all categories from foodCategories
  const categories = useMemo(() => {
    return Object.keys(foodCategories).sort()
  }, [])

  // Then modify the currentIngredients useMemo to handle alternate names in search:

  // Get current ingredients to display based on active category or search
  const currentIngredients = useMemo(() => {
    if (searchQuery.trim()) {
      // Normalize the search query
      const normalizedQuery = searchQuery.toLowerCase().trim()

      // Search across all categories
      const results = []
      Object.values(foodCategories).forEach((categoryItems) => {
        categoryItems.forEach((item) => {
          // Check if the item matches the search query
          if (item.toLowerCase().includes(normalizedQuery)) {
            results.push(item)
          }

          // Also check if any alternate name for this item matches the search
          // This allows searching for "MSG" to find "monosodium glutamate"
          const alternateEntries = Object.entries(alternateNames)
          for (const [alternate, canonical] of alternateEntries) {
            if (canonical === item.toLowerCase() && alternate.includes(normalizedQuery)) {
              if (!results.includes(item)) {
                results.push(item)
              }
              break
            }
          }
        })
      })
      return results.sort()
    } else if (activeCategory && foodCategories[activeCategory]) {
      // Show ingredients from active category
      return [...foodCategories[activeCategory]].sort()
    }
    return []
  }, [searchQuery, activeCategory])

  const toggleIngredient = useCallback((ingredient) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((item) => item !== ingredient)
      } else {
        return [...prev, ingredient]
      }
    })
  }, [])

  const saveSelections = useCallback(() => {
    setLookingForThings(selectedIngredients)
    if (onClose) onClose()
  }, [selectedIngredients, setLookingForThings, onClose])

  const selectAllInCategory = useCallback(() => {
    if (activeCategory && foodCategories[activeCategory]) {
      setSelectedIngredients((prev) => {
        const newSelection = [...prev]
        foodCategories[activeCategory].forEach((ingredient) => {
          if (!newSelection.includes(ingredient)) {
            newSelection.push(ingredient)
          }
        })
        return newSelection
      })
    }
  }, [activeCategory])

  const deselectAllInCategory = useCallback(() => {
    if (activeCategory && foodCategories[activeCategory]) {
      setSelectedIngredients((prev) => prev.filter((item) => !foodCategories[activeCategory].includes(item)))
    }
  }, [activeCategory])

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item && styles.activeCategoryItem,
        { width: itemWidth, height: itemHeight },
      ]}
      onPress={() => setActiveCategory(item)}
    >
      <Text
        style={[styles.categoryText, activeCategory === item && styles.activeCategoryText]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  )

  const renderIngredientItem = ({ item }) => (
    <TouchableOpacity style={styles.ingredientItem} onPress={() => toggleIngredient(item)}>
      <Text style={styles.ingredientText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
      <View style={[styles.checkbox, selectedIngredients.includes(item) && styles.checkboxSelected]}>
        {selectedIngredients.includes(item) && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Ingredients</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.selectedCount}>
        <Text style={styles.selectedCountText}>{selectedIngredients.length} ingredients selected</Text>
      </View>

      <View style={styles.content}>
        {!searchQuery && (
          <View style={[styles.categoriesContainer, { height: categoryContainerHeight }]}>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.categoriesList}
              scrollEnabled={true}
            />
          </View>
        )}

        {activeCategory && !searchQuery && (
          <View style={styles.categoryActions}>
            <TouchableOpacity style={styles.actionButton} onPress={selectAllInCategory}>
              <Text style={styles.actionButtonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={deselectAllInCategory}>
              <Text style={styles.actionButtonText}>Deselect All</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={currentIngredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item}
          style={styles.ingredientsList}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? "No ingredients found matching your search" : "Select a category to view ingredients"}
              </Text>
            </View>
          }
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveSelections}>
          <Text style={styles.saveButtonText}>Save Selections</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  selectedCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  selectedCountText: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 12,
    // Height is dynamically set in the component
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    margin: 4,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    // Width and height are dynamically set in the component
  },
  activeCategoryItem: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  activeCategoryText: {
    color: "#fff",
  },
  categoryActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  actionButton: {
    marginLeft: 16,
  },
  actionButtonText: {
    color: "#007AFF",
    fontSize: 14,
  },
  ingredientsList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ingredientText: {
    fontSize: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
