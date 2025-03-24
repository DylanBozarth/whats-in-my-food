import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import React, { useState, useEffect } from 'react';
import { useGlobalState } from '@/components/global_variables';
import { Check, X, AlertTriangle, RefreshCw } from 'react-native-feather'; // Assuming you have react-native-feather or similar icon library

const ResultsScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { globalState } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scannedItem, setScannedItem] = useState({
    name: "",
    ingredients: []
  });
  const [results, setResults] = useState({
    matchedIngredients: [],
    safeIngredients: [],
    productName: ""
  });
  
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError(true);
      }
    }, 10000); // 10 second timeout
    
    try {
      if (globalState) {
        // Get the scanned item from global state
        const itemData = globalState.scannedItem || null;
        
        if (!itemData || !itemData.ingredients || itemData.ingredients.length === 0) {
          // If no valid data, set error after a short delay to show loading first
          setTimeout(() => {
            setIsLoading(false);
            setError(true);
          }, 1500);
          return;
        }
        
        setScannedItem(itemData);
        
        // Get user's selected ingredients to watch for
        const userSelectedIngredients = globalState.selectedIngredients || [];
        
        // Check which ingredients from the user's selection are in the scanned item
        const matched: any = [];
        const safe: any = [];
        
        userSelectedIngredients.forEach((ingredient: string) => {
          // Check if any of the scanned item's ingredients contain this ingredient
          // Using lowercase for case-insensitive comparison
          const found = itemData.ingredients.some(
            (            itemIngredient: string) => itemIngredient.toLowerCase().includes(ingredient.toLowerCase())
          );
          
          if (found) {
            matched.push(ingredient);
          } else {
            safe.push(ingredient);
          }
        });
        
        setResults({
          matchedIngredients: matched,
          safeIngredients: safe,
          productName: itemData.name
        });
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error processing ingredients:", err);
      setIsLoading(false);
      setError(true);
    }
    
    // Clear timeout if component unmounts or if loading completes
    return () => clearTimeout(timeoutId);
  }, [globalState]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(false);
    
    // Simulate a fresh load by waiting a moment before checking global state again
    setTimeout(() => {
      if (globalState && globalState.scannedItem) {
        // Re-run the analysis logic
        const itemData = globalState.scannedItem;
        const userSelectedIngredients = globalState.selectedIngredients || [];
        
        const matched: any = [];
        const safe: any = [];
        
        userSelectedIngredients.forEach((ingredient: string) => {
          const found = itemData.ingredients.some(
            (            itemIngredient: string) => itemIngredient.toLowerCase().includes(ingredient.toLowerCase())
          );
          
          if (found) {
            matched.push(ingredient);
          } else {
            safe.push(ingredient);
          }
        });
        
        setScannedItem(itemData);
        setResults({
          matchedIngredients: matched,
          safeIngredients: safe,
          productName: itemData.name
        });
        
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError(true);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361EE" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Analyzing ingredients...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle width={48} height={48} color="#FF4D6D" />
          <Text style={styles.errorTitle}>Unable to analyze ingredients</Text>
          <Text style={styles.errorText}>
            We couldn't process the ingredient data. This might be because:
          </Text>
          <View style={styles.errorList}>
            <Text style={styles.errorListItem}>• No ingredients were detected</Text>
            <Text style={styles.errorListItem}>• The scan was incomplete</Text>
            <Text style={styles.errorListItem}>• There was a connection issue</Text>
          </View>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <RefreshCw width={20} height={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Ingredient Check Results</Text>
          <Text style={styles.subtitle}>{results.productName}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          {results.matchedIngredients.length > 0 ? (
            <View style={styles.warningContainer}>
              <AlertTriangle width={32} height={32} color="#FF4D6D" />
              <Text style={styles.warningText}>
                This product contains {results.matchedIngredients.length} ingredient{results.matchedIngredients.length !== 1 ? 's' : ''} you're watching for
              </Text>
            </View>
          ) : (
            <View style={styles.safeContainer}>
              <Check width={32} height={32} color="#4CC9BE" />
              <Text style={styles.safeText}>
                This product doesn't contain any ingredients you're watching for
              </Text>
            </View>
          )}
        </View>

        {/* All Ingredients Section */}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>All Ingredients</Text>
          <View style={styles.ingredientsList}>
            {scannedItem.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Matched Ingredients Section */}
        {results.matchedIngredients.length > 0 && (
          <View style={styles.matchedContainer}>
            <Text style={styles.sectionTitle}>Found Ingredients You're Watching For</Text>
            <View style={styles.ingredientsList}>
              {results.matchedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.matchedItem}>
                  <X width={20} height={20} color="#FF4D6D" />
                  <Text style={styles.matchedText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Safe Ingredients Section */}
        {results.safeIngredients.length > 0 && (
          <View style={styles.safeIngredientsContainer}>
            <Text style={styles.sectionTitle}>Not Found in This Product</Text>
            <View style={styles.ingredientsList}>
              {results.safeIngredients.map((ingredient, index) => (
                <View key={index} style={styles.safeItem}>
                  <Check width={20} height={20} color="#4CC9BE" />
                  <Text style={styles.safeItemText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#495057',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  errorListItem: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#4361EE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#4361EE',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4361EE',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4D6D',
    marginLeft: 12,
    flex: 1,
  },
  safeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(76, 201, 190, 0.1)',
    borderRadius: 12,
  },
  safeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CC9BE',
    marginLeft: 12,
    flex: 1,
  },
  ingredientsContainer: {
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
  matchedContainer: {
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
  safeIngredientsContainer: {
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
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 15,
    color: "#495057",
  },
  matchedItem: {
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchedText: {
    fontSize: 15,
    color: '#FF4D6D',
    marginLeft: 8,
    fontWeight: '500',
  },
  safeItem: {
    backgroundColor: 'rgba(76, 201, 190, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeItemText: {
    fontSize: 15,
    color: '#4CC9BE',
    marginLeft: 8,
    fontWeight: '500',
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