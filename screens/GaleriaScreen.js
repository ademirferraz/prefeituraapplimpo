import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
// Comentando importações do Firebase temporariamente
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { db } from '../firebaseConfig';

export default function GaleriaScreen() {
  const [midias, setMidias] = useState([]);

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setMidias([]);
      };
    }, [])
  );

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados com um timer
    const timer = setTimeout(() => {
      // Dados de exemplo para exibição
      const imagensExemplo = [
        { id: '1', uri: 'https://picsum.photos/id/1/500/300' },
        { id: '2', uri: 'https://picsum.photos/id/10/500/300' },
        { id: '3', uri: 'https://picsum.photos/id/20/500/300' },
        { id: '4', uri: 'https://picsum.photos/id/30/500/300' },
        { id: '5', uri: 'https://picsum.photos/id/40/500/300' },
      ];
      setMidias(imagensExemplo);
      setCarregando(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🖼️ Galeria de Envios</Text>
      {carregando ? (
        <ActivityIndicator size="large" color="#6a1b9a" />
      ) : (
        <FlatList
          data={midias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.image} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3e5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6a1b9a',
  },
  image: {
    marginBottom: 15,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});