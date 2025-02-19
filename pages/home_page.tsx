import {StartCamera} from '@/pages/barcode_scanner';
import ToggleSwitch from '@/components/toggle_item';
import ToggleSwitchList from '@/components/toggle_list';
import { CameraView } from 'expo-camera';
import React, {useState} from 'react';
import {Image, StyleSheet, Platform, View, Text, Button} from 'react-native';
import foodCatagories from '../components/food_list';

export default function Homepage() {
  return (
    <View style={styles.container}>
      <View>
        
        <Text>A whole category:</Text>
        <ToggleSwitchList passedNames={foodCatagories.nuts} displayName='nuts' />
        <Text>Individual ingredients</Text>
        <ToggleSwitch passedName='poTaTO' displayName='Potato' />
        <ToggleSwitch passedName="wheat" displayName='wheat'/>
      </View>
      <View>
    </View>
      <View></View>
      <Text>HOAMPAGE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'white',
  },
});
