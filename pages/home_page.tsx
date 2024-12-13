import ToggleSwitch from '@/components/toggles';
import React, {useState} from 'react';
import {Image, StyleSheet, Platform, View, Text, Button} from 'react-native';

export const Homepage = () => {
  return (
    <View>
      <View>
        <ToggleSwitch passedName="Cheese" />
        <ToggleSwitch passedName="cheese" />
      </View>
      <Text>HOAMPAGE</Text>
    </View>
  );
};
