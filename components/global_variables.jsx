import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext(null);

export const GlobalProvider = ( { children }) => {
  const [lookingForThings, setLookingForThings] = useState([]);
  const [foundIngredients, setFoundIngredients] = useState([]);
  const [lastScanResult, setLastScanResult] = useState([])
  const [lastScanBarcode, setLastScanBarcode] = useState();

  const LOOKING_KEY = 'lookingForThings';
  const FOUND_KEY = 'foundIngredients';

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLookingForThings = await AsyncStorage.getItem(LOOKING_KEY);
        const savedFoundIngredients = await AsyncStorage.getItem(FOUND_KEY);

        if (savedLookingForThings) setLookingForThings(JSON.parse(savedLookingForThings));
        if (savedFoundIngredients) setFoundIngredients(JSON.parse(savedFoundIngredients));
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(LOOKING_KEY, JSON.stringify(lookingForThings));
      } catch (e) {
        console.error('Failed to save lookingForThings:', e);
      }
    };

    saveData();
  }, [lookingForThings]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(FOUND_KEY, JSON.stringify(foundIngredients));
      } catch (e) {
        console.error('Failed to save foundIngredients:', e);
      }
    };

    saveData();
  }, [foundIngredients]);

  return (
    <GlobalContext.Provider
      value={{
        lookingForThings,
        setLookingForThings,
        foundIngredients,
        setFoundIngredients,
        lastScanResult,
        setLastScanResult,
        lastScanBarcode,
        setLastScanBarcode
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
