import React from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import keywordLists from '../components/food_list';
import { lookingForThings } from '../components/global_variables';
import FiltersPage from './filters_page';
import { handleBarcodeScan } from '../components/barcode_scanner';

// React Native equivalent of ResultsPage
const ResultsPage = ({ route }) => {
  const navigation = useNavigation();
  const { passedResults } = route.params;

  // categorizeResults function equivalent
  const categorizeResults = (passedResults, keywordLists, lookingForThings) => {
    const lowercaseLookingForThings = lookingForThings.map(item => item.toLowerCase().replace(/\s+/g, '-'));
    const lowercasePassedResults = passedResults.map(item => item.toLowerCase().replace(/\s+/g, '-'));
    
    let categorizedResults = {};

    // Convert all keywords and elements in keyword lists to lowercase and replace spaces with hyphens
    const lowercaseKeywordLists = keywordLists.map(map => {
      const lowercaseMap = {};
      for (const [key, value] of Object.entries(map)) {
        lowercaseMap[key.toLowerCase().replace(/\s+/g, '-')] = value.map(element =>
          element.toLowerCase().replace(/\s+/g, '-')
        );
      }
      return lowercaseMap;
    });

    // Add all keyword maps to categorizedResults
    lowercaseKeywordLists.forEach(map => {
      for (const [key, value] of Object.entries(map)) {
        categorizedResults[key] = value;
      }
    });

    // Filter the categorizedResults to include only the keys from lowercaseLookingForThings
    categorizedResults = Object.fromEntries(
      Object.entries(categorizedResults).filter(([key]) => lowercaseLookingForThings.includes(key))
    );

    // Check for matches and categorize results
    lowercasePassedResults.forEach(result => {
      lowercaseKeywordLists.forEach(keywordMap => {
        for (const [keyword, list] of Object.entries(keywordMap)) {
          if (list.some(element => result.includes(element))) {
            categorizedResults[keyword] = categorizedResults[keyword] || [];
            if (!categorizedResults[keyword].includes(result)) {
              categorizedResults[keyword].push(result);
            }
          }
        }
      });
    });

    console.log('Final categorizedResults:', categorizedResults);
    return categorizedResults;
  };

  const categorizedResults = categorizeResults(passedResults, keywordLists, lookingForThings);

  return (
    <View style={{ flex: 1, backgroundColor: '#8BC34A' }}> {/* Set background color */}
      <TouchableOpacity
        onPress={() => navigation.navigate('HomePage')}
        style={{
          backgroundColor: '#2196F3',
          padding: 10,
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Text style={{ color: 'white' }}>Adjust filters</Text>
      </TouchableOpacity>

      <ScrollView>
        {Object.entries(categorizedResults)
          .filter(([, value]) => value.length > 0) // Filter out empty lists
          .map(([keyword, matchingElements], index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#4CAF50',
                  borderBottomWidth: 1,
                  borderBottomColor: '#FFFFFF',
                }}
              >
                <Text style={{ fontWeight: 'bold', color: 'white' }}>
                  {keyword.toUpperCase().replace(/-/g, ' ')}
                </Text>
              </TouchableOpacity>
              <FlatList
                data={matchingElements}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{ padding: 5, backgroundColor: '#E8F5E9' }}>
                    <Text>{item.replace(/-/g, ' ')}</Text>
                  </View>
                )}
              />
            </View>
          ))}
      </ScrollView>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity
          onPress={() => handleBarcodeScan(navigation, () => {}, passedResults)}
          style={{
            backgroundColor: '#F44336',
            padding: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white' }}>Scan again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResultsPage;
