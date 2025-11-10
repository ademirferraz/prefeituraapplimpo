import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const baseMunicipal = [
  { nome: 'José Oliveira', nascimento: '24/10/1970', origem: 'base', cpf: '00000000191' },
  { nome: 'Ana Beatriz', nascimento: '25/10/1985', origem: 'base', cpf: '00000000282' },
  { nome: 'Carlos Mendes', nascimento: '28/10/1990', origem: 'base', cpf: '00000000373' },
  { nome: 'Luciana Costa', nascimento: '01/11/1975', origem: 'base', cpf: '00000000464' },
];

export default function PainelAdminScreen() {
  const navigation = useNavigation();
  const [aniversariantesHoje, setAniversariantesHoje] = useState([]);
  const [aniversariantesFuturos, setAniversariantesFuturos] = useState([]);
  const [mensagemGerada, setMensagemGerada] = useState('');

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setAniversariantesHoje([]); setAniversariantesFuturos([]); setMensagemGerada("");
      };
    }, [])
  );


  useEffect(() => {
    const hoje = new Date();

    const calcularIdade = (data) => {
      const [dia, mes, ano] = data.split('/');
      const nascimento = new Date(`${ano}-${mes}-${dia}`);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const aindaNaoFez = hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
      return aindaNaoFez ? idade - 1 : idade;
    };

    const verificarDia = (data, diasAdiante = 0) => {
      const [dia, mes] = data.split('/');
      const alvo = new Date(hoje);
      alvo.setDate(hoje.getDate() + diasAdiante);
      return parseInt(dia) === alvo.getDate() && parseInt(mes) === alvo.getMonth() + 1;
    };

    const verificarFuturo = (data) => {
      for (let i = 1; i <= 7; i++) {
        if (verificarDia(data, i)) return true;
      }
      return false;
    };

    const hojeArr = [];
    const futurosArr = [];

    baseMunicipal.forEach((pessoa) => {
      const idade = calcularIdade(pessoa.nascimento);
      const pessoaComIdade = { ...pessoa, idade };

      if (verificarDia(pessoa.nascimento)) {
        hojeArr.push(pessoaComIdade);
      } else if (verificarFuturo(pessoa.nascimento)) {
        futurosArr.push(pessoaComIdade);
      }
    });

    setAniversariantesHoje(hojeArr);
    setAniversariantesFuturos(futurosArr);
  }, []);

  const gerarMensagem = (nome, idade, origem) => {
    const tipo = origem === 'app' ? 'personalizada' : 'padrão';
    const texto =
      idade >= 18
        ? `Parabéns, ${nome}, pelos seus ${idade} anos! Que seu dia seja especial.`
        : `Feliz aniversário, ${nome}! Que sua infância seja cheia de alegria.`;
    setMensagemGerada(`Mensagem ${tipo}: ${texto}`);
  };

  const renderPessoa = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>🎉 {item.nome}</Text>
      <Text style={styles.info}>Nascimento: {item.nascimento} ({item.idade} anos)</Text>
      <Text style={styles.origem}>
        Origem: {item.origem === 'app' ? 'Cadastrado no app' : 'Base municipal'}
      </Text>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => gerarMensagem(item.nome, item.idade, item.origem)}
      >
        <Text style={styles.botaoTexto}>Gerar mensagem</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Painel do Prefeito</Text>

      <TouchableOpacity
        style={[styles.botao, { marginBottom: 20 }]}
        onPress={() => navigation.navigate('EditarInformacoes')}
      >
        <Text style={styles.botaoTexto}>Editar Informações e Aviso</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Aniversariantes de hoje</Text>
      <FlatList
        data={aniversariantesHoje}
        keyExtractor={(item) => item.cpf}
        renderItem={renderPessoa}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum aniversariante hoje.</Text>}
      />

      <Text style={styles.subtitulo}>Próximos aniversários (7 dias)</Text>
      <FlatList
        data={aniversariantesFuturos}
        keyExtractor={(item) => item.cpf}
        renderItem={renderPessoa}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum evento futuro encontrado.</Text>}
      />

      {mensagemGerada !== '' && (
        <View style={styles.mensagemBox}>
          <Text style={styles.mensagemTexto}>{mensagemGerada}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e3f2fd' },
  voltar: { marginBottom: 10 },
  voltarTexto: { fontSize: 16, color: '#1565c0', fontWeight: 'bold' },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0d47a1',
    textAlign: 'center',
  },
  subtitulo: { fontSize: 16, marginBottom: 12, color: '#333' },
  vazio: { fontSize: 16, color: '#999', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: '#bbdefb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#0d47a1' },
  info: { fontSize: 14, color: '#555' },
  origem: { fontSize: 13, color: '#777', marginBottom: 8 },
  botao: {
    backgroundColor: '#1565c0',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  mensagemBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#c5cae9',
    borderRadius: 8,
  },
  mensagemTexto: {
    fontSize: 16,
    color: '#1a237e',
    textAlign: 'center',
    fontWeight: '500',
  },
});