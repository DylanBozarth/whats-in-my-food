import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  Button,
  SafeAreaView,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalProvider } from '@/components/global_variables';
import Homepage from '@/pages/home_page';
import ResultsPage from '@/pages/results_page';


const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <GlobalProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Results" component={ResultsPage} />
          </Stack.Navigator>
        </GlobalProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
