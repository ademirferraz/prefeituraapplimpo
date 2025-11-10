// screens/EnviarScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const EnviarScreen = () => {
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [documento, setDocumento] = useState('');
  const [showPostActionModal, setShowPostActionModal] = useState(false);

  // === LIMPEZA AUTOMÁTICA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setImagem(null);
        setCarregando(false);
        setNome('');
        setCpf('');
        setDocumento('');
        setShowPostActionModal(false);
      };
    }, [])
  );

  const tirarFoto = () => {
    Alert.alert("Foto", "Funcionalidade de câmera será implementada em breve.");
  };

  const enviar = () => {
    if (!imagem) {
      Alert.alert("Erro", "Selecione uma imagem primeiro.");
      return;
    }
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setShowPostActionModal(true);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Manifestação</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Documento (opcional)"
        value={documento}
        onChangeText={setDocumento}
      />

      <TouchableOpacity style={styles.btnCamera} onPress={tirarFoto}>
        <Text style={styles.btnText}>Tirar Foto / Gravar Vídeo</Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

      <TouchableOpacity style={styles.btnEnviar} onPress={enviar} disabled={carregando}>
        <Text style={styles.btnText}>
          {carregando ? 'Enviando...' : 'Enviar'}
        </Text>
      </TouchableOpacity>

      {/* Modal pós-envio */}
      {showPostActionModal && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Enviado com sucesso!</Text>
          <TouchableOpacity
            style={styles.btnFechar}
            onPress={() => setShowPostActionModal(false)}
          >
            <Text style={styles.btnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnCamera: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnEnviar: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 15,
  },
  modal: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  btnFechar: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
});

export default EnviarScreen;   // AGORA ESTÁ DEFINIDO!