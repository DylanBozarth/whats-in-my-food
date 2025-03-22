import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"

// This is just a type definition for our nutrition data
type NutritionResult = {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  sugar: number
  fiber: number
  vitamins: Array<{ name: string; amount: string }>
}

// Mock data - replace with your actual data source
const mockResult: NutritionResult = {
  name: "Grilled Chicken Salad",
  calories: 320,
  protein: 28,
  carbs: 12,
  fat: 18,
  sugar: 3,
  fiber: 5,
  vitamins: [
    { name: "Vitamin A", amount: "15%" },
    { name: "Vitamin C", amount: "45%" },
    { name: "Calcium", amount: "8%" },
    { name: "Iron", amount: "10%" },
  ],
}

const ResultsScreen = ({ route }: any) => {
  const navigation = useNavigation()
  // In a real implementation, you would get the result from route.params
  // const { result } = route.params || { result: mockResult };
  const result = mockResult // Using mock data for demonstration

  // Calculate the percentage for the nutrition bars
  const calculatePercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition Results</Text>
          <Text style={styles.subtitle}>{result.name}</Text>
        </View>

        <View style={styles.calorieCard}>
          <Text style={styles.calorieTitle}>Total Calories</Text>
          <Text style={styles.calorieValue}>{result.calories}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>

        <View style={styles.macrosContainer}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>Protein</Text>
              <Text style={styles.macroValue}>{result.protein}g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculatePercentage(result.protein, 50)}%`, backgroundColor: "#5E60CE" },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>Carbs</Text>
              <Text style={styles.macroValue}>{result.carbs}g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculatePercentage(result.carbs, 100)}%`, backgroundColor: "#64DFDF" },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>Fat</Text>
              <Text style={styles.macroValue}>{result.fat}g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculatePercentage(result.fat, 65)}%`, backgroundColor: "#FF9F1C" },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>Sugar</Text>
              <Text style={styles.macroValue}>{result.sugar}g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculatePercentage(result.sugar, 25)}%`, backgroundColor: "#FF4D6D" },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>Fiber</Text>
              <Text style={styles.macroValue}>{result.fiber}g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculatePercentage(result.fiber, 25)}%`, backgroundColor: "#7B2CBF" },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.vitaminsContainer}>
          <Text style={styles.sectionTitle}>Vitamins & Minerals</Text>
          <View style={styles.vitaminsGrid}>
            {result.vitamins.map((vitamin, index) => (
              <View key={index} style={styles.vitaminItem}>
                <Text style={styles.vitaminName}>{vitamin.name}</Text>
                <Text style={styles.vitaminAmount}>{vitamin.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => {
              // Navigate to save or share screen
              // navigation.navigate('SaveResults');
            }}
          >
            <Text style={styles.primaryButtonText}>Save Results</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              // Navigate back to scan or home
              navigation.goBack()
            }}
          >
            <Text style={styles.secondaryButtonText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#495057",
  },
  calorieCard: {
    backgroundColor: "#4361EE",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  calorieValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
  },
  calorieUnit: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  macrosContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 16,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  macroName: {
    fontSize: 16,
    color: "#495057",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  vitaminsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vitaminsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vitaminItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  vitaminName: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 4,
  },
  vitaminAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#4361EE",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4361EE",
  },
  secondaryButtonText: {
    color: "#4361EE",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ResultsScreen

