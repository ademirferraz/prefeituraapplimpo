import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function TesteFirebase() {
  useEffect(() => {
    const testarConexao = async () => {
      try {
        await setDoc(doc(db, 'teste', 'usuarioTeste'), {
          nome: 'Teste de Conexão',
          email: 'teste@exemplo.com',
          role: 'admin',
        });
        Alert.alert('Sucesso', 'Conexão com Firebase funcionando!');
      } catch (error) {
        Alert.alert('Erro', 'Falha na conexão: ' + error.message);
      }
    };

    testarConexao();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testando conexão com Firebase...</Text>
    </View>
  );
}
