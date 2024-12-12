import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { lookingForThings } from './global_variables';

interface ToggleSwitchProps {
  passedName: string;
}

const addOrRemove = (passedName: string) => {
  let passedNameIndex: number = lookingForThings.indexOf(passedName);
  passedNameIndex !== -1 ? lookingForThings.push(passedName) : lookingForThings.splice(passedNameIndex, passedNameIndex)
  // Is it in there? If not add it, if is remove it
}

const isItHighlighted = (passedName: string) => {
  let passedNameIndex: number = lookingForThings.indexOf(passedName);
  let highlighted: boolean = false;
  passedNameIndex !== -1 ? highlighted = true : highlighted = false
  return highlighted
  // Is it in there? if so make it toggled on, if not toggle it off
}

// how to use interface with props, if just one somply use passedName:string
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ passedName }) => {
  return (
    <View style={styles.container}>
      <Switch
        value={isItHighlighted(passedName)}
        onValueChange={() => addOrRemove(passedName)}
        trackColor={{ false: '#767577', true: '#b2fab4' }}
        thumbColor={isItHighlighted(passedName) ? '#4CAF50' : '#f4f3f4'}
      />
      <Text style={styles.text}>{passedName}</Text> {/* What the user sees */}
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
  },
});

export default ToggleSwitch;
