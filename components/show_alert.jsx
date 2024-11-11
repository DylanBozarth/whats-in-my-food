import React from 'react';
import { Alert, Modal, View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';

// showAlert equivalent
export const showAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [{ text: "OK", onPress: () => {} }],
    { cancelable: true }
  );
};

// showProcessingDialog equivalent
export const showProcessingDialog = ({ visible, message }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dialog}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

// dismissLoadingDialog equivalent
export const dismissLoadingDialog = (setVisible) => {
  setVisible(false);
};

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  message: {
    marginLeft: 15,
    fontSize: 16,
  },
});
