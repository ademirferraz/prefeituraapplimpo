// navigation/index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Stack from '../StackNavigator';

// Importe suas telas
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import RecuperarSenhaScreen from '../screens/RecuperarSenhaScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import PainelAdminScreen from '../screens/PainelAdminScreen';
import DenunciaScreen from '../screens/DenunciaScreen';
import SugestaoScreen from '../screens/SugestaoScreen';
import ElogiosScreen from '../screens/ElogiosScreen';
import PerigoScreen from '../screens/PerigoScreen';
import ServicosScreen from '../screens/ServicosScreen';
import InformacoesScreen from '../screens/InformacoesScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import EventosPessoaisScreen from '../screens/EventosPessoaisScreen';
import GaleriaScreen from '../screens/GaleriaScreen';
import GravarMidiaScreen from '../screens/GravarMidiaScreen';
import EnviarScreen from '../screens/EnviarScreen';
import EditarInformacoesScreen from '../screens/EditarInformacoesScreen';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={InicioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} options={{ title: 'Recuperar Senha' }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin' }} />
        <Stack.Screen name="PainelAdmin" component={PainelAdminScreen} options={{ title: 'Painel Admin' }} />
        <Stack.Screen name="Denuncia" component={DenunciaScreen} options={{ title: 'Denúncia' }} />
        <Stack.Screen name="Sugestao" component={SugestaoScreen} options={{ title: 'Sugestão' }} />
        <Stack.Screen name="Elogios" component={ElogiosScreen} options={{ title: 'Elogios' }} />
        <Stack.Screen name="Perigo" component={PerigoScreen} options={{ title: 'Perigo' }} />
        <Stack.Screen name="Servicos" component={ServicosScreen} options={{ title: 'Serviços' }} />
        <Stack.Screen name="Informacoes" component={InformacoesScreen} options={{ title: 'Informações' }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
        <Stack.Screen name="EventosPessoais" component={EventosPessoaisScreen} options={{ title: 'Eventos' }} />
        <Stack.Screen name="Galeria" component={GaleriaScreen} options={{ title: 'Galeria' }} />
        <Stack.Screen name="GravarMidia" component={GravarMidiaScreen} options={{ title: 'Gravar Mídia' }} />
        <Stack.Screen name="Enviar" component={EnviarScreen} options={{ title: 'Enviar' }} />
        <Stack.Screen name="EditarInformacoes" component={EditarInformacoesScreen} options={{ title: 'Editar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}