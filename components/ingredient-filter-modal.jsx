import { Modal, StyleSheet } from "react-native"
import IngredientFilter from "./ingredient-filter"


export default function IngredientFilterModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <IngredientFilter onClose={onClose} />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

