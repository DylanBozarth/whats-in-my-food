// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, StyleSheet } from 'react-native';

// Import screens
import FiltersPage from './pages/filters_page.tsx'
import ResultsPage from './pages/results_page.jsx';

// Define types for navigation stack
export type RootStackParamList = {
  Home: undefined;
  Results: { itemId: number };
};

// Create the navigation stack
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: '#fff',
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Stack.Screen name="Home" component={FiltersPage} options={{  }} />
        <Stack.Screen name="Results" component={ResultsPage} options={{ }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
});

export default App;
