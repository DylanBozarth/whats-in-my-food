// ToggleSwitch.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ToggleSwitchProps {
    passedName: string;               
    isHighlighted: boolean;          
    onChanged: (value: boolean) => void; 
  }
// ToggleSwitch component equivalent
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ passedName, isHighlighted, onChanged }) => {
  return (
    <View style={styles.container}>
      <Switch
        value={isHighlighted}
        onValueChange={onChanged} // Call the callback function
        trackColor={{ false: '#767577', true: '#b2fab4' }} // Light green active track color
        thumbColor={isHighlighted ? '#4CAF50' : '#f4f3f4'} // Green thumb color when active
      />
      <Text style={styles.text}>{passedName}</Text>
    </View>
  );
};

// Styles
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
