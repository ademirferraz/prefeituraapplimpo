// screens/InicioScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function InicioScreen({ navigation }) {
  let clickCount = 0;
  let clickTimer = null;

  const handleAdminClick = () => {
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 2000);

    if (clickCount >= 5) {
      clickCount = 0;
      clearTimeout(clickTimer);
      navigation.navigate('AdminLogin');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title} onPress={handleAdminClick}>
        Bem-vindo ao App da Prefeitura
      </Text>
      <Text style={styles.subtitle}>Crie sua conta para começar</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.btnText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa', 
    padding: 20 
  },
  logo: { 
    width: 140, 
    height: 140, 
    marginBottom: 30 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10, 
    color: '#2c3e50' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#7f8c8d', 
    marginBottom: 40, 
    textAlign: 'center' 
  },
  btn: { 
    backgroundColor: '#2ecc71', 
    padding: 18, 
    borderRadius: 10, 
    width: '80%', 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
});