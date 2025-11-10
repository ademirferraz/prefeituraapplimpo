// screens/TesteVisual.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TesteVisual() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>🚀 TesteVisual está funcionando!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
  },
});
