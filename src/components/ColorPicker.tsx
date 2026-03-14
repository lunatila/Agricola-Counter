import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  playerId: number;
}

const PLAYER_COLORS = [
  '#4ecda9ff', // Teal
  '#eee01bff', // Yellow
  '#e1ba66ff', // Wood
  '#7f1522',   // Wine Red
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.colorButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.instructionText}>Click to choose a color</Text>
        <View style={[styles.colorPreview, { backgroundColor: currentColor }]} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick your color</Text>

            <ScrollView contentContainerStyle={styles.colorGrid}>
              {PLAYER_COLORS.map((color) => (
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

            <View style={styles.closeButtonWrapper}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Ready</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: s(16),
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: s(20),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  colorPreview: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    borderWidth: 4,
    borderColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modalOverlay,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: s(20),
    padding: s(20),
    width: '50%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: s(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: s(20),
    color: '#333',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorOption: {
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    margin: s(8),
    borderWidth: 3,
    borderColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: Colors.black,
  },
  closeButtonWrapper: {
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: Colors.primary,
    width: s(150),
    padding: s(15),
    borderRadius: s(20),
    marginTop: s(20),
  },
  closeButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: s(16),
    fontWeight: 'bold',
  },
});
