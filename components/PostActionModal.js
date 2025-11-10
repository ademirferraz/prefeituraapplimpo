import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler, Alert } from 'react-native';

export default function PostActionModal({ visible, onClose, onNavigateHome }) {
  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert(
        'Ação não recomendada no iOS',
        'Por política da Apple, o app não deve ser encerrado programaticamente. Vamos retornar à tela inicial.',
        [{ text: 'OK', onPress: () => onNavigateHome && onNavigateHome() }]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Concluir</Text>
          <Text style={styles.subtitle}>O que você deseja fazer agora?</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.primary]} onPress={onNavigateHome}>
              <Text style={styles.buttonText}>Voltar à tela inicial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.danger]} onPress={handleExit}>
              <Text style={styles.buttonText}>Encerrar o app</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  actions: {
    gap: 12,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#1565c0',
  },
  danger: {
    backgroundColor: '#c62828',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  close: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeText: {
    color: '#555',
  },
});