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
import { createStackNavigator } from '@react-navigation/stack';
import { StartCamera } from '@/pages/barcode_scanner';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function Main() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <GlobalProvider>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Scan" component={StartCamera} />
          <Tab.Screen name="Results" component={ResultsPage} />
        </Tab.Navigator>
      </GlobalProvider>
    </SafeAreaView>
  );
}


// scan still happens more than once  X 
// need to search through the barcode result for found things 
// then display the problems in the results page 
// works if the barcode is 0, fix this 