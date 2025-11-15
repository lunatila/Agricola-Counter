import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  playerId: number;
}

const COLORS = [
  '#4ecda9ff', // Teal
  '#eee01bff', // Yellow
  '#e1ba66ff', // Wood (Brown)
  '#7f1522', // Vinho (Wine Red)
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorSelect,
  playerId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.colorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.instructionText}>
          Jogador {playerId + 1}: Toque para escolher sua cor
        </Text>
        <View style={[styles.colorPreview, { backgroundColor: currentColor }]} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha sua cor</Text>
            <ScrollView contentContainerStyle={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    currentColor === color && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButton: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 8,
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: '#000',
  },
  closeButton: {
    backgroundColor: '#4A7C59',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
