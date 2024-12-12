import React, {useState} from 'react';
import { Image, StyleSheet, Platform, View, Text, Button } from 'react-native';
//import { useCameraPermission } from '../components/hooks/permissions';
import { makeGetRequest } from '@/components/api';
import  {ScanBarcode}  from '@/components/barcode_scanner';
import ToggleSwitch from '@/components/toggles';

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  return (
    <View>
      <Text>Yeah</Text>
      <View>
        <ToggleSwitch passedName='Cheese' />
      </View>
      {/*}
      <View>
      {showCamera ? (
        <ScanBarcode onClose={() => setShowCamera(false)} />
      ) : (
        <Button title="Open Camera" onPress={() => setShowCamera(true)} />
      )}
    </View>*/}
    </View>
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

