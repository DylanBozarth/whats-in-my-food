'use client';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useState, useEffect, useRef, useCallback} from 'react';
import {useGlobalState} from '../components/global_variables';
import {
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Tag,
  Search,
} from 'react-native-feather';
import axios from 'axios';
import foodCategories, {normalizeIngredient} from '../components/food_list';
import {findIngredientMatches} from '../components/fuzzy_matching';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Function to find the category of an ingredient
const findIngredientCategory = ingredient => {
  // Normalize the ingredient to handle alternate names
  const normalizedIngredient = normalizeIngredient(ingredient);

  // Search through all categories
  for (const [categoryKey, items] of Object.entries(foodCategories)) {
    // Use normalized comparison for both the ingredient and the items in the category
    if (
      items.some(item => normalizeIngredient(item) === normalizedIngredient)
    ) {
      // Format category name for display
      return categoryKey
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim();
    }
  }

  // Return "Other" if no category is found
  return 'Other';
};

const ResultsScreen = route => {
  const navigation = useNavigation();
  const {
    lookingForThings,
    lastScanResult,
    setLastScanResult,
    lastScanBarcode,
    setLastScanBarcode,
  } = useGlobalState();

  const [isLoading, setIsLoading] = useState(!!lastScanBarcode);
  const [errorType, setErrorType] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [results, setResults] = useState({
    matchedIngredients: [],
    safeIngredients: [],
    productName: 'Scanned Product',
    imageUrl: null,
    noIngredientsFound: false,
  });

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    matched: true,
    safe: true,
    all: true,
  });

  // Use a ref to track if we've processed data for the CURRENT barcode
  const processedBarcodeRef = useRef(null);

  // Debug logging
  console.log('Results component rendered with state:', {
    isLoading,
    errorType,
    errorDetails,
    refreshing,
    processedBarcode: processedBarcodeRef.current,
    lastScanBarcode,
    lastScanResultLength: lastScanResult?.length || 0,
    lookingForThingsLength: lookingForThings?.length || 0,
  });

  // Add this useEffect to handle the initial state properly
  useEffect(() => {
    if (!lastScanBarcode) {
      setIsLoading(false);
    }
  }, []);

  // Reset state when a new barcode is detected
  useEffect(() => {
    if (lastScanBarcode && lastScanBarcode !== processedBarcodeRef.current) {
      console.log('New barcode detected, resetting state:', lastScanBarcode);
      setIsLoading(true);
      setErrorType(null);
      setErrorDetails('');
      setImageError(false);
      setResults({
        matchedIngredients: [],
        safeIngredients: [],
        productName: 'Scanned Product',
        imageUrl: null,
        noIngredientsFound: false,
      });
      setExpandedSections({
        matched: true,
        safe: true,
        all: true,
      });
    }
  }, [lastScanBarcode]);

  // Toggle section expansion with animation
  const toggleSection = section => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to fetch product data
  const fetchProductData = async () => {
    if (!lastScanBarcode) return;

    try {
      console.log('Making API request for barcode:', lastScanBarcode);
      const url = `https://world.openfoodfacts.org/api/v0/product/${lastScanBarcode}.json`;
      const response = await axios.get(url, {timeout: 4000});

      if (response.status === 200 && response.data.status === 1) {
        console.log('API request successful');

        let ingredients = [];
        let productName = `Product ${lastScanBarcode}`;
        let imageUrl = null;

        if (response.data.product && response.data.product.product_name) {
          productName = response.data.product.product_name;
        }

        if (response.data.product) {
          if (response.data.product.image_front_url) {
            imageUrl = response.data.product.image_front_url;
          } else if (response.data.product.image_url) {
            imageUrl = response.data.product.image_url;
          } else if (
            response.data.product.selected_images?.front?.display?.url
          ) {
            imageUrl = response.data.product.selected_images.front.display.url;
          } else if (response.data.product.selected_images?.front?.small?.url) {
            imageUrl = response.data.product.selected_images.front.small.url;
          }
        }

        console.log('Product image URL:', imageUrl);

        if (response.data.product && response.data.product.ingredients_text) {
          ingredients = response.data.product.ingredients_text
            .split(',')
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient.length > 0);
        } else if (
          response.data.product &&
          response.data.product.ingredients &&
          Array.isArray(response.data.product.ingredients)
        ) {
          ingredients = response.data.product.ingredients
            .map(ing => ing.text || ing.id)
            .filter(text => text);
        }

        console.log('Extracted ingredients:', ingredients);
        setLastScanResult(ingredients);

        if (!ingredients || ingredients.length === 0) {
          console.log('No ingredients found for this product');
          setIsLoading(false);
          setRefreshing(false);
          setErrorType('no_ingredients');
          setResults({
            ...results,
            productName: productName,
            imageUrl: imageUrl,
          });
        } else {
          processData(ingredients, productName, imageUrl);
        }

        processedBarcodeRef.current = lastScanBarcode;
      } else if (response.status === 200 && response.data.status === 0) {
        console.warn('Product not found in database');
        setIsLoading(false);
        setRefreshing(false);
        setErrorType('product_not_found');
        setErrorDetails('This product was not found in the food database.');
        // run second database check here CHEESE
      } else {
        console.warn('API request failed with status:', response.status);
        setIsLoading(false);
        setRefreshing(false);
        setErrorType('scan_failed');
        setErrorDetails(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching product data:', err);
      setIsLoading(false);
      setRefreshing(false);

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setErrorType('timeout');
        setErrorDetails(
          'The request timed out. Please check your internet connection and try again.',
        );
      } else if (err.message.includes('Network Error') || !navigator.onLine) {
        setErrorType('network_error');
        setErrorDetails(
          'No internet connection. Please check your network and try again.',
        );
      } else {
        setErrorType('unknown');
        setErrorDetails(err.message || 'An unexpected error occurred');
      }
    }
  };

  // Fetch product data when the screen loads or when barcode changes
  useEffect(() => {
    console.log(
      'Results effect running, loading:',
      isLoading,
      'barcode:',
      lastScanBarcode,
    );

    if (
      lastScanBarcode &&
      processedBarcodeRef.current !== lastScanBarcode &&
      isLoading
    ) {
      fetchProductData();

      const timeoutId = setTimeout(() => {
        console.log('Timeout triggered after 10 seconds');
        if (isLoading) {
          console.log('Still loading after timeout, showing error');
          setIsLoading(false);
          setRefreshing(false);
          setErrorType('scan_failed');
          setErrorDetails('Request timed out while fetching product data.');
        }
      }, 10000);

      return () => {
        console.log('Clearing timeout');
        clearTimeout(timeoutId);
      };
    }
  }, [isLoading, lastScanBarcode]);

  // Enhanced process data function with fuzzy matching
  const processData = (ingredients, productName, imageUrl) => {
    try {
      console.log(
        'Processing ingredients with fuzzy matching:',
        ingredients.length,
      );

      if (!ingredients || ingredients.length === 0) {
        console.log('No ingredients found for this product');
        setIsLoading(false);
        setRefreshing(false);
        setErrorType('no_ingredients');
        setResults({
          ...results,
          productName: productName,
          imageUrl: imageUrl,
        });
        return;
      }

      if (lookingForThings && lookingForThings.length > 0) {
        console.log(
          'Processing lookingForThings with enhanced matching:',
          lookingForThings.length,
        );

        // Use the enhanced fuzzy matching
        const matchingOptions = {
          exactMatchThreshold: 0.9, // 90% similarity for exact matches
          partialMatchThreshold: 0.75, // 75% similarity for partial matches
          enableSubstring: true, // Enable substring matching
          enableWordOrder: true, // Enable word order flexibility
        };

        const {matches, safe} = findIngredientMatches(
          lookingForThings,
          ingredients,
          matchingOptions,
        );

        console.log('Enhanced matching results:');
        console.log('Matches found:', matches.length);
        console.log('Safe ingredients:', safe.length);

        // Log detailed match information
        matches.forEach(match => {
          console.log(
            `Match: "${match.searchTerm}" found in "${match.foundIn}" (${(
              match.score * 100
            ).toFixed(1)}% similarity, strategy: ${match.strategy})`,
          );
        });

        // Convert matches to the format expected by the UI
        const matchedIngredients = matches.map(match => ({
          ingredient: match.searchTerm,
          foundIn: match.foundIn,
          score: match.score,
          strategy: match.strategy,
        }));

        setResults({
          matchedIngredients: matchedIngredients,
          safeIngredients: safe,
          productName: productName,
          imageUrl: imageUrl,
        });
      } else {
        // No ingredients to look for
        setResults({
          matchedIngredients: [],
          safeIngredients: [],
          productName: productName,
          imageUrl: imageUrl,
        });
      }

      setIsLoading(false);
      setRefreshing(false);
      console.log('Enhanced data processing complete');
    } catch (err) {
      console.error('Error processing ingredients:', err);
      setIsLoading(false);
      setRefreshing(false);
      setErrorType('parse_error');
      setErrorDetails(
        'Failed to process the ingredients data: ' +
          (err.message || 'Unknown error'),
      );
    }
  };

  const handleScanAnother = () => {
    console.log('Scan Another button pressed');
    processedBarcodeRef.current = null;
    navigation.goBack();
  };

  const handleRetry = () => {
    processedBarcodeRef.current = null;
    setIsLoading(true);
    setErrorType(null);
    setErrorDetails('');
    setImageError(false);
  };

  const onRefresh = useCallback(() => {
    console.log('Pull to refresh triggered');
    setRefreshing(true);
    processedBarcodeRef.current = null;
    setImageError(false);

    if (lastScanBarcode) {
      fetchProductData();
    } else {
      setRefreshing(false);
    }
  }, [lastScanBarcode]);

  // Enhanced collapsible section component
  const CollapsibleSection = ({title, children, sectionKey, count}) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <View style={styles.collapsibleContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {count !== undefined && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
              </View>
            )}
          </View>
          {isExpanded ? (
            <ChevronUp width={20} height={20} color="#495057" />
          ) : (
            <ChevronDown width={20} height={20} color="#495057" />
          )}
        </TouchableOpacity>

        {isExpanded && <View style={styles.sectionContent}>{children}</View>}
      </View>
    );
  };

  // Check if we need to show the "scan something" screen
  if (!lastScanBarcode && !isLoading && !errorType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <AlertTriangle width={48} height={48} color="#4361EE" />
          <Text style={styles.emptyStateTitle}>No Product Scanned</Text>
          <Text style={styles.emptyStateText}>
            You need to scan something first to see ingredient analysis.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleScanAnother}>
            <Text style={styles.retryButtonText}>Scan a Product</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#4361EE"
            style={styles.loadingSpinner}
          />
          <Text style={styles.loadingText}>
            Analyzing ingredients with smart matching...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          {errorType === 'no_ingredients' && (
            <>
              <AlertTriangle width={48} height={48} color="#FF9800" />
              <Text style={styles.errorTitle}>No Ingredients Listed</Text>
              <Text style={styles.errorText}>
                We found the product "{results.productName}" but no ingredients
                were listed in the database.
              </Text>
              {results.imageUrl && !imageError ? (
                <View style={styles.errorImageContainer}>
                  <Image
                    source={{uri: results.imageUrl}}
                    style={styles.errorProductImage}
                    resizeMode="contain"
                    onError={() => setImageError(true)}
                  />
                </View>
              ) : null}
            </>
          )}

          {errorType === 'product_not_found' && (
            <>
              <AlertTriangle width={48} height={48} color="#FF4D6D" />
              <Text style={styles.errorTitle}>Product Not Found</Text>
              <Text style={styles.errorText}>
                This product (barcode: {lastScanBarcode}) was not found in our
                database.
              </Text>
            </>
          )}

          {errorType === 'scan_failed' && (
            <>
              <X width={48} height={48} color="#FF4D6D" />
              <Text style={styles.errorTitle}>Scan Failed</Text>
              <Text style={styles.errorText}>
                We couldn't retrieve information for this product.{' '}
                {errorDetails}
              </Text>
            </>
          )}

          {errorType === 'network_error' && (
            <>
              <AlertTriangle width={48} height={48} color="#FF4D6D" />
              <Text style={styles.errorTitle}>Network Error</Text>
              <Text style={styles.errorText}>{errorDetails}</Text>
            </>
          )}

          {errorType === 'timeout' && (
            <>
              <AlertTriangle width={48} height={48} color="#FF9800" />
              <Text style={styles.errorTitle}>Request Timed Out</Text>
              <Text style={styles.errorText}>{errorDetails}</Text>
            </>
          )}

          {errorType === 'parse_error' && (
            <>
              <AlertTriangle width={48} height={48} color="#FF4D6D" />
              <Text style={styles.errorTitle}>Processing Error</Text>
              <Text style={styles.errorText}>
                We found the product but couldn't process its ingredients.{' '}
                {errorDetails}
              </Text>
            </>
          )}

          {errorType === 'unknown' && (
            <>
              <AlertTriangle width={48} height={48} color="#FF4D6D" />
              <Text style={styles.errorTitle}>Something Went Wrong</Text>
              <Text style={styles.errorText}>
                An unexpected error occurred. {errorDetails}
              </Text>
            </>
          )}

          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <RefreshCw width={20} height={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleScanAnother}>
            <Text style={styles.backButtonText}>Scan Another Product</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4361EE']}
            tintColor="#4361EE"
            title="Pull to refresh..."
            titleColor="#6c757d"
          />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Ingredient Analysis</Text>
          <Text style={styles.subtitle}>{results.productName}</Text>
          <Text style={styles.barcodeText}>Barcode: {lastScanBarcode}</Text>
        </View>

        {/* Product Image */}
        {results.imageUrl && !imageError ? (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: results.imageUrl}}
              style={styles.productImage}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <ImageIcon width={48} height={48} color="#6c757d" />
            <Text style={styles.noImageText}>No product image available</Text>
          </View>
        )}

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          {results.matchedIngredients.length > 0 ? (
            <View style={styles.warningContainer}>
              <AlertTriangle width={32} height={32} color="#FF4D6D" />
              <Text style={styles.warningText}>
                Smart matching found {results.matchedIngredients.length}{' '}
                ingredient
                {results.matchedIngredients.length !== 1 ? 's' : ''} you're
                watching for
              </Text>
            </View>
          ) : (
            <View style={styles.safeContainer}>
              <Check width={32} height={32} color="#4CC9BE" />
              <Text style={styles.safeText}>
                Smart analysis shows this product doesn't contain any
                ingredients you're watching for
              </Text>
            </View>
          )}
        </View>

        {/* Enhanced Matched Ingredients Section */}
        {results.matchedIngredients.length > 0 && (
          <View style={styles.matchedContainer}>
            <CollapsibleSection
              title="Smart Matches Found:"
              sectionKey="matched"
              count={results.matchedIngredients.length}>
              <View style={styles.ingredientsList}>
                {results.matchedIngredients.map((match, index) => {
                  const category = findIngredientCategory(match.ingredient);
                  const isExactMatch =
                    match.strategy === 'substring' || match.score >= 0.95;

                  return (
                    <View key={index} style={styles.enhancedMatchedItem}>
                      <X width={20} height={20} color="#FF4D6D" />
                      <View style={styles.ingredientInfoContainer}>
                        <Text style={styles.matchedText}>
                          {match.ingredient}
                        </Text>

                        {/* Show what it matched in the product */}
                        {match.foundIn &&
                          match.foundIn !== match.ingredient &&
                          match.score < 1.0 && (
                            <View style={styles.matchDetailsContainer}>
                              <Search
                                width={12}
                                height={12}
                                color="#FF4D6D"
                                style={styles.matchIcon}
                              />
                              <Text style={styles.matchDetailsText}>
                                Not an exact match: 
                               {"\n"}
                                We think this "{match.foundIn}" is close enough to {match.ingredient}: 
                                {/*{match.score < 1.0 && ` (${(match.score * 100).toFixed(0)}% match)`} */}
                              </Text>
                            </View>
                          )}

                        <View style={styles.categoryContainer}>
                          <Tag
                            width={12}
                            height={12}
                            color="#FF4D6D"
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.categoryText}>{category}</Text>

                          {/* Match confidence indicator */}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </CollapsibleSection>
          </View>
        )}

        {/* Safe Ingredients Section */}
        {results.safeIngredients.length > 0 && (
          <View style={styles.safeIngredientsContainer}>
            <CollapsibleSection
              title="Not Found in This Product"
              sectionKey="safe"
              count={results.safeIngredients.length}>
              <View style={styles.ingredientsList}>
                {results.safeIngredients.map((ingredient, index) => {
                  const category = findIngredientCategory(ingredient);
                  return (
                    <View key={index} style={styles.safeItem}>
                      <Check width={20} height={20} color="#4CC9BE" />
                      <View style={styles.ingredientInfoContainer}>
                        <Text style={styles.safeItemText}>{ingredient}</Text>
                        <View style={styles.categoryContainer}>
                          <Tag
                            width={12}
                            height={12}
                            color="#4CC9BE"
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.safeCategoryText}>
                            {category}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </CollapsibleSection>
          </View>
        )}

        {/* All Ingredients Section */}
        <View style={styles.ingredientsContainer}>
          <CollapsibleSection
            title="All Ingredients"
            sectionKey="all"
            count={lastScanResult?.length || 0}>
            <View style={styles.ingredientsList}>
              {lastScanResult && lastScanResult.length > 0 ? (
                lastScanResult.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noIngredientsText}>
                  No ingredients information available
                </Text>
              )}
            </View>
          </CollapsibleSection>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleScanAnother}>
            <Text style={styles.secondaryButtonText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 4,
    textAlign: 'center',
  },
  barcodeText: {
    fontSize: 14,
    color: '#6c757d',
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noImageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noImageText: {
    marginTop: 12,
    color: '#6c757d',
    fontSize: 16,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchedContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  safeIngredientsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Collapsible section styles
  collapsibleContainer: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  countBadge: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  sectionContent: {
    marginTop: 8,
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 15,
    color: '#495057',
  },
  noIngredientsText: {
    fontSize: 15,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
  enhancedMatchedItem: {
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  matchedItem: {
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientInfoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  matchedText: {
    fontSize: 15,
    color: '#FF4D6D',
    fontWeight: '500',
  },
  matchDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  matchIcon: {
    marginRight: 4,
  },
  matchDetailsText: {
    fontSize: 12,
    color: '#FF4D6D',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#FF4D6D',
    opacity: 0.8,
  },
  safeCategoryText: {
    fontSize: 12,
    color: '#4CC9BE',
    opacity: 0.8,
  },
  confidenceBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  confidenceText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  safeItem: {
    backgroundColor: 'rgba(76, 201, 190, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safeItemText: {
    fontSize: 15,
    color: '#4CC9BE',
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4361EE',
  },
  secondaryButtonText: {
    color: '#4361EE',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorImageContainer: {
    width: '100%',
    height: 150,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f1f3f5',
  },
  errorProductImage: {
    width: '100%',
    height: '100%',
  },
});

export default ResultsScreen;
