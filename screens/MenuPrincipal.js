import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MenuPrincipal() {
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Elogios', icon: require('../assets/elogios.png'), screen: 'Elogios' },
    { label: 'Perigo', icon: require('../assets/perigo.png'), screen: 'Perigo' },
    { label: 'Eventos Pessoais', icon: require('../assets/eventos.png'), screen: 'Eventos' },
    { label: 'Gravar Mídia', icon: require('../assets/midia.png'), screen: 'Midia' },
    // Adicione mais ícones conforme necessário
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Menu Principal</Text>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de sair */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate('Inicio')}>
        <Text style={styles.exitText}>🚪 Sair do aplicativo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    width: 120,
    height: 120,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
  exitButton: {
    marginTop: 30,
  },
  exitText: {
    fontSize: 16,
    color: 'red',
  },
});
