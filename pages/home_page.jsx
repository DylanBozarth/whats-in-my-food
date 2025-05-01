import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import IngredientFilterModal from "../components/ingredient-filter-modal"
import SelectedIngredients from "../components/selected-ingredients"
import { useGlobalState } from "../components/global_variables"

export default function Homepage({ navigation }) {
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const { lookingForThings } = useGlobalState()

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>What's In My Food?</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredient Filter</Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
              <Ionicons name="options-outline" size={24} color="#007AFF" />
              <Text style={styles.filterButtonText}>Search for Ingredients</Text>
            </TouchableOpacity>
          </View>

          <SelectedIngredients />

          <Text style={styles.infoText}>
            {lookingForThings.length
              ? `You're filtering for ${lookingForThings.length} ingredient${lookingForThings.length !== 1 ? "s" : ""}`
              : "Search for ingredients to be alerted to you want to avoid in your food"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scan a Product</Text>
          <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate("Scan")}>
            <Ionicons name="barcode-outline" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Recent scans section could go here */}

        <IngredientFilterModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtonText: {
    marginLeft: 4,
    color: "#007AFF",
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  scanButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

