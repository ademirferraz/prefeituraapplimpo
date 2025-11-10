import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DenunciaScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setTitulo(""); setDescricao("");
      };
    }, [])
  );


  const enviarDenuncia = async () => {
    if (!titulo || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const { cpf } = JSON.parse(usuario);

      await addDoc(collection(db, 'denuncias'), {
        titulo,
        descricao,
        autor: cpf,
        data: new Date().toLocaleDateString('pt-BR'),
      });

      Alert.alert('Sucesso', 'Denúncia enviada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível enviar a denúncia');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Enviar Denúncia</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity style={styles.botao} onPress={enviarDenuncia}>
        <Text style={styles.botaoTexto}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#e6f2ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#0077cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontSize: 18 },
  voltar: { marginTop: 20, fontSize: 16, color: '#1565c0' },
});