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
import HomePage from '../pages/home_page';
import ResultsPage from '@/pages/results_page';
import {GlobalProvider} from '../components/global_variables';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <GlobalProvider>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Results" component={ResultsPage} />
        </Tab.Navigator>
      </GlobalProvider>
    </SafeAreaView>
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
