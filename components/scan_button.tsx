import React, { useState } from 'react';
import { View, Button, Alert, ActivityIndicator, Text, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { makeGetRequest } from './api.tsx';
import lookingForThings from './global_variables.jsx';
import { showAlert, showProcessingDialog } from './show_alert.jsx';
import { handleBarcodeScan } from './barcode_scanner.tsx';

const ScanButton = () => {
  const navigation = useNavigation();
  const [barCodeScanResult, setBarCodeScanResult] = useState('');
  const [foundThings, setFoundThings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async () => {
    if (lookingForThings.length === 0) {
      showAlert('Nothing Selected', 'You need to select something to filter for', true);
      return;
    }

    setIsProcessing(true); 

    try {
      const res = await navigation.navigate('BarcodeScanner'); 

      if (typeof res === 'string') {
        setBarCodeScanResult(res);
        await makeGetRequest(res, foundThings, navigation); 
      } else {
        throw new Error('Barcode scanning failed or was cancelled');
      }
    } catch (e) {
      console.error('Error occurred:', e);
      showAlert('Error', 'An error occurred while processing your request. Please try again.', true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Button
        title="SCAN"
        color="#2196F3"
        onPress={handleScan}
      />
      <Modal visible={isProcessing} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.processingDialog}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginLeft: 15 }}>Scanning your item...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  processingDialog: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default ScanButton;
