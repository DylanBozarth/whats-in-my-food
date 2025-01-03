import React from 'react';
import { View, Text } from 'react-native';
import { useGlobalState } from '@/components/global_variables';

export default function ResultsPage() {
  const { lookingForThings, setLookingForThings } = useGlobalState();
  const { foundIngredients, setFoundIngredients } = useGlobalState();
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📋 Results Page</Text>
      <Text>{foundIngredients}</Text>
    </View>
  );
}
