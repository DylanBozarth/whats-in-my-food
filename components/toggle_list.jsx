"use client"

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useGlobalState } from './global_variables';

const ToggleSwitchList = ({ passedNames, displayName }) => {
  const { lookingForThings, setLookingForThings } = useGlobalState();

  const addOrRemoveList = (names) => {
    setLookingForThings((prev) => {
      const newState = [...prev];
      names.forEach((name) => {
        if (newState.includes(name)) {
          const index = newState.indexOf(name);
          if (index > -1) newState.splice(index, 1);
        } else {
          newState.push(name);
        }
      });
      return newState;
    });
    console.log(lookingForThings);
  };

  const isAnyHighlighted = (names) => names.some((name) => lookingForThings.includes(name));

  return (
    <View style={styles.container}>
      <Switch
        value={isAnyHighlighted(passedNames)}
        onValueChange={() => addOrRemoveList(passedNames)}
        trackColor={{ false: '#767577', true: '#b2fab4' }}
        thumbColor={isAnyHighlighted(passedNames) ? '#4CAF50' : '#f4f3f4'}
      />
      <Text style={styles.text}>
        {displayName}
      </Text>
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
    color: 'white',
  },
});

export default ToggleSwitchList;
