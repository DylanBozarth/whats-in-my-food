import { Modal, StyleSheet } from "react-native"
import IngredientFilter from "./ingredient-filter"

type IngredientFilterModalProps = {
  visible: boolean
  onClose: () => void
}

export default function IngredientFilterModal({ visible, onClose }: IngredientFilterModalProps) {
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

