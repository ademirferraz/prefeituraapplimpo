import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const validarSenha = (senha) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    
    if (!temMaiuscula || !temMinuscula || !temNumero) {
      return 'A senha deve ter pelo menos uma letra maiúscula, uma letra minúscula e um número';
    }
    return '';
  };

  // Salvar dados do cidadão localmente
  const handleSalvarCadastro = async () => {
    if (!nome || !cpf || !nascimento || !senha || !confirmarSenha) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    // Validar senha
    const erro = validarSenha(senha);
    if (erro) {
      setErroSenha(erro);
      return;
    }

    // Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem');
      return;
    }

    setErroSenha('');
    const dados = { nome, cpf, nascimento, senha };
    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(dados));
      Alert.alert('Cadastro salvo com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro ao salvar os dados');
    }
  };

  // Acesso ao painel do administrador
  const handleAdminAccess = async () => {
    const dadosAdmin = await AsyncStorage.getItem('admin');
    const senhaSalva = dadosAdmin ? JSON.parse(dadosAdmin).senha : null;

    if (senhaSalva) {
      navigation.navigate('AdminLogin');
    } else {
      await AsyncStorage.setItem('admin', JSON.stringify({ senha: 'prefeitura123' }));
      navigation.navigate('AdminLogin');
    }
  };

  return (
    <View style={styles.container}>
      {/* Roldana do admin */}
      <TouchableOpacity style={styles.roldana} onPress={handleAdminAccess}>
        <Text style={styles.iconText}>⚙️</Text>
      </TouchableOpacity>

      {/* Logo da prefeitura */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Frase de boas-vindas */}
      <Text style={styles.welcome}>Bem-vindo ao app Prefeitura de Bom Conselho</Text>

      {/* Frase de cadastro */}
      <Text style={styles.cadastro}>Cadastre-se</Text>

      {/* Campos de cadastro */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF/CNPJ"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de nascimento (DD/MM/AA)"
        value={nascimento}
        onChangeText={(text) => {
          // Formatação automática para DD/MM/AA
          let formatted = text.replace(/\D/g, ''); // Remove caracteres não numéricos
          if (formatted.length >= 2) {
            formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
          }
          if (formatted.length >= 5) {
            formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 7);
          }
          setNascimento(formatted);
        }}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Crie uma senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirme a senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />
      
      {/* Aviso sobre requisitos da senha */}
      <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', marginVertical: 5 }}>
        A senha deve ter pelo menos uma letra maiúscula, uma letra minúscula e um número
      </Text>
      
      {/* Mensagem de erro da senha */}
      {erroSenha ? (
        <Text style={{ color: '#ff6b6b', fontSize: 12, textAlign: 'center', marginVertical: 5 }}>
          {erroSenha}
        </Text>
      ) : null}

      {/* Botão de cadastro */}
      <TouchableOpacity style={styles.botaoCadastro} onPress={handleSalvarCadastro}>
        <Text style={styles.botaoTexto}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0074D9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  roldana: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  iconText: {
    fontSize: 30,
    color: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  cadastro: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  botaoCadastro: {
    backgroundColor: '#005fa3',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
});
