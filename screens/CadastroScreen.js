import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const validarSenha = (s) => {
    if (s.length < 6) return "Mínimo 6 caracteres";
    if (!/[A-Z]/.test(s)) return "Falta 1 letra maiúscula";
    if (!/[a-z]/.test(s)) return "Falta 1 letra minúscula";
    if (!/[0-9]/.test(s)) return "Falta 1 número";
    return null;
  };

  const cadastrar = () => {
    if (!nome || !cpf || !email || !senha || !confirmSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      Alert.alert("Senha inválida", erroSenha);
      return;
    }
    if (senha !== confirmSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }
    Alert.alert("Sucesso", "Cadastro realizado! (simulado)");
    navigation.navigate('Login');
  };

  // Limpeza automática
  useFocusEffect(
    useCallback(() => {
      return () => {
        setNome(''); setCpf(''); setEmail(''); setSenha(''); setConfirmSenha('');
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Cidadão</Text>

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="CPF (somente números)" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha (6+ chars)" value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput style={styles.input} placeholder="Repetir senha" value={confirmSenha} onChangeText={setConfirmSenha} secureTextEntry />

      <Text style={styles.info}>
        A senha deve ter: 6+ caracteres, 1 maiúscula, 1 minúscula, 1 número
      </Text>

      <TouchableOpacity style={styles.btn} onPress={cadastrar}>
        <Text style={styles.btnText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  info: { fontSize: 12, color: '#7f8c8d', marginBottom: 15, textAlign: 'center' },
  btn: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#3498db', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline' },
});

export default CadastroScreen;