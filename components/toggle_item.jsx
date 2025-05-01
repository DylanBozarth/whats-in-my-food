"use client"

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useGlobalState } from './global_variables';

const ToggleSwitch = ({ passedName, displayName }) => {
  const { lookingForThings, setLookingForThings } = useGlobalState();

  const addOrRemove = (name) => {
    
    setLookingForThings((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
    console.log(lookingForThings)
  };

  const isItHighlighted = (name) => lookingForThings.includes(name);

  return (
    <View style={styles.container}>
      <Switch
        value={isItHighlighted(passedName)}
        onValueChange={() => addOrRemove(passedName)}
        trackColor={{ false: '#767577', true: '#b2fab4' }}
        thumbColor={isItHighlighted(passedName) ? '#4CAF50' : '#f4f3f4'}
      />
      <Text style={styles.text}>{displayName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'white'
  },
});

export default ToggleSwitch;
