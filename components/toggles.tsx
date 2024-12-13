import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useGlobalState } from './global_variables';

interface ToggleSwitchProps {
  passedName: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ passedName }) => {
  const { lookingForThings, setLookingForThings } = useGlobalState();

  const addOrRemove = (name: string) => {
    
    setLookingForThings((prev: any) =>
      prev.includes(name) ? prev.filter((item: string) => item !== name) : [...prev, name]
    );
    console.log(lookingForThings)
  };

  const isItHighlighted = (name: string) => lookingForThings.includes(name);

  return (
    <View style={styles.container}>
      <Switch
        value={isItHighlighted(passedName)}
        onValueChange={() => addOrRemove(passedName)}
        trackColor={{ false: '#767577', true: '#b2fab4' }}
        thumbColor={isItHighlighted(passedName) ? '#4CAF50' : '#f4f3f4'}
      />
      <Text style={styles.text}>{passedName.toUpperCase()}</Text>
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
