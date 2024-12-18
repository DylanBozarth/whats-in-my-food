import {StartCamera} from '@/components/barcode_scanner';
import ToggleSwitch from '@/components/toggles';
import { CameraView } from 'expo-camera';
import React, {useState} from 'react';
import {Image, StyleSheet, Platform, View, Text, Button} from 'react-native';


export default function Homepage() {
  return (
    <View style={styles.container}>
      <View>
        <ToggleSwitch passedName="Cheese" />
      </View>
      <View>
    <StartCamera /></View>
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
