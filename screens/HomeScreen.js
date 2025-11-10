import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsAdmin(false);
      };
    }, [])
  );


  useEffect(() => {
    const verificarAdmin = async () => {
      const status = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(status === 'true');
    };
    verificarAdmin();
  }, []);

  const handleSair = async () => {
    Alert.alert('Sair', 'Escolha como deseja finalizar:', [
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('userData');
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
      {
        text: 'Encerrar App',
        onPress: () => {
          if (Platform.OS === 'android') {
            BackHandler.exitApp();
          } else {
            Alert.alert('iOS', 'Você será deslogado.', [
              {
                text: 'OK',
                onPress: async () => {
                  await AsyncStorage.removeItem('userData');
                  navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
                },
              },
            ]);
          }
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MenuButton label="Nova Denúncia" emoji="📝" route="Denuncia" />
        </View>

      <Text style={styles.title}>Bem-vindo ao PrefeituraApp!</Text>
      <Text style={styles.subtitle}>Use o menu abaixo para navegar</Text>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.buttonRow}>
        <MenuButton label="Elogios" emoji="😊" route="Elogios" />
        <MenuButton label="Informações" emoji="ℹ️" route="Informacoes" />
        <MenuButton label="Perigo" emoji="⚠️" route="Perigo" />
        <MenuButton label="Sugestão" emoji="💡" route="Sugestao" />
        <MenuButton label="Gravar Mídia" emoji="📹" route="GravarMidia" />
        <MenuButton label="Serviços" emoji="🔧" route="Servicos" />
        <MenuButton label="Eventos" emoji="📅" route="EventosPessoais" />
        <MenuButton label="Sobre" emoji="ℹ️" route="Sobre" />
      </View>

      {/* ✅ Botão Nova Denúncia */}
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Denuncia')}>
        <Text style={styles.botaoTexto}>Nova Denúncia</Text>
      </TouchableOpacity>

      {isAdmin && (
        <>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('EditarInformacoes')}
          >
            <Text style={styles.botaoTexto}>Editar Informações e Aviso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: '#999' }]}
            onPress={async () => {
              await AsyncStorage.removeItem('isAdmin');
              setIsAdmin(false);
            }}
          >
            <Text style={styles.botaoTexto}>Sair do modo administrador</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={handleSair}>
        <Text style={{ color: '#fff', fontSize: 20 }}>🚪</Text>
        <Text style={styles.exitLabel}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  function MenuButton({ label, emoji, route }) {
    return (
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate(route)}>
        <Text style={{ color: '#fff', fontSize: 24 }}>{emoji}</Text>
        <Text style={styles.iconLabel}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { fontSize: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  iconButton: {
    backgroundColor: '#0077cc',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    width: 120,
  },
  iconLabel: { color: '#fff', marginTop: 5 },
  botao: {
    backgroundColor: '#0077cc',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontSize: 18 },
  exitButton: {
    backgroundColor: '#cc0000',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  exitLabel: { color: '#fff', fontSize: 16, marginTop: 5 },
});