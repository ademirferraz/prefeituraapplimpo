import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o PrefeituraApp</Text>
      <Text>
        Este aplicativo foi desenvolvido para facilitar a comunicação entre os cidadãos e a prefeitura.
        Aqui você pode enviar elogios, sugestões, relatar perigos e muito mais.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
