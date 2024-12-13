import React, {useState} from 'react';
import {Image, StyleSheet, Platform, View, Text, Button} from 'react-native';
//import { useCameraPermission } from '../components/hooks/permissions';
import { GlobalProvider } from '../components/global_variables';
import { Homepage } from '@/pages/home_page';

export default function HomeScreen() {
  return (
      <GlobalProvider>
      <Homepage />
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
