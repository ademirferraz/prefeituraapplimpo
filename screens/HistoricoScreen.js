// screens/HistoricoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function HistoricoScreen() {
  const [manifestacoes, setManifestacoes] = useState([]);

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setManifestacoes([]);
      };
    }, [])
  );

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'manifestacoes'));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setManifestacoes(lista);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };
    carregarDados();
  }, []);

  const abrirLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Erro ao abrir link:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Manifestações</Text>
      {manifestacoes.length === 0 ? (
        <Text style={styles.empty}>Nenhuma manifestação encontrada.</Text>
      ) : (
        <FlatList
          data={manifestacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.tipo}>{item.tipo || 'Sem tipo'}</Text>
              <Text style={styles.nome}>Pessoa: {item.nome || 'Anônimo'} — CPF: {item.cpf || 'Não informado'}</Text>
              <Text style={styles.descricao}>{item.descricao || 'Sem descrição'}</Text>
              {item.midiaUrl && (
                <TouchableOpacity onPress={() => abrirLink(item.midiaUrl)}>
                  <Text style={styles.link}>Ver mídia associada</Text>
                </TouchableOpacity>
              )}
              {item.midiaUrl && item.midiaUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                <Image source={{ uri: item.midiaUrl }} style={styles.imagem} resizeMode="cover" />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

// ESTILOS CORRETOS (APENAS UM StyleSheet.create!)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2c3e50' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, elevation: 2 },
  tipo: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#e74c3c' },
  nome: { fontSize: 14, marginBottom: 5, color: '#34495e' },
  descricao: { fontSize: 14, color: '#555', marginBottom: 10, lineHeight: 20 },
  link: { color: '#3498db', textDecorationLine: 'underline', marginTop: 5 },
  imagem: { width: '100%', height: 200, borderRadius: 8, marginTop: 10 },
  empty: { textAlign: 'center', color: '#95a5a6', fontSize: 16, marginTop: 50 },
});