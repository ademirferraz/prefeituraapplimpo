import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Linking from 'expo-linking';

export default function InformacoesScreen() {
  const [expandedItem, setExpandedItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const defaultInformacoes = [
    {
      id: 1,
      titulo: 'Horário de Atendimento',
      conteudo: 'Segunda a sexta: 8h às 17h\nSábado: 8h às 12h\nDomingo: Fechado'
    },
    {
      id: 2,
      titulo: 'Números de Emergência',
      conteudo: 'Prefeitura: (00) 1234-5678\nDefesa Civil: 199\nSAMU: 192\nBombeiros: 193\nPolícia: 190'
    },
    {
      id: 3,
      titulo: 'Endereços Importantes',
      conteudo: 'Prefeitura: Rua Principal, 123\nHospital Municipal: Av. da Saúde, 456\nRodoviária: Praça Central, s/n'
    },
    {
      id: 4,
      titulo: 'Documentos para Serviços',
      conteudo: 'Para a maioria dos serviços municipais, é necessário apresentar:\n- RG\n- CPF\n- Comprovante de residência\n- Documentos específicos conforme o serviço'
    },
    {
      id: 5,
      titulo: 'Coleta de Lixo',
      conteudo: 'Segunda, quarta e sexta: Região Norte\nTerça, quinta e sábado: Região Sul\nLixo reciclável: Terças e quintas em toda a cidade'
    }
  ];

  const [informacoes, setInformacoes] = useState(defaultInformacoes);

  // Campos para CRUD quando admin
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAnexo, setNewAnexo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAnexo, setEditAnexo] = useState('');

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setExpandedItem(""); setIsAdmin(false); setNewTitle(""); setNewContent(""); setNewAnexo(""); setEditId(""); setEditTitle(""); setEditContent(""); setEditAnexo("");
      };
    }, [])
  );


  useEffect(() => {
    const carregarInformacoes = async () => {
      try {
        const saved = await AsyncStorage.getItem('adminInfos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInformacoes(parsed);
          }
        }
      } catch (e) {
        // mantém default
      }
    };
    const verificarAdmin = async () => {
      try {
        const admin = await AsyncStorage.getItem('adminLoggedIn');
        setIsAdmin(admin === 'true');
      } catch (e) {
        setIsAdmin(false);
      }
    };
    carregarInformacoes();
    verificarAdmin();
  }, []);

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // CRUD
  const handleAddInfo = async () => {
    const t = newTitle.trim();
    const c = newContent.trim();
    const a = newAnexo.trim();
    if (!t || !c) {
      Alert.alert('Atenção', 'Preencha título e conteúdo.');
      return;
    }
    const newItem = { id: Date.now().toString(), titulo: t, conteudo: c, anexoUrl: a || null };
    const updated = [...informacoes, newItem];
    setInformacoes(updated);
    await AsyncStorage.setItem('adminInfos', JSON.stringify(updated));
    setNewTitle('');
    setNewContent('');
    setNewAnexo('');
    Alert.alert('Sucesso', 'Informação adicionada.');
  };

  const handleEditInfo = (item) => {
    setEditId(item.id);
    setEditTitle(item.titulo);
    setEditContent(item.conteudo);
    setEditAnexo(item.anexoUrl || '');
  };

  const handleSaveInfo = async (id) => {
    const t = editTitle.trim();
    const c = editContent.trim();
    const a = editAnexo.trim();
    if (!c) {
      Alert.alert('Atenção', 'Preencha o conteúdo.');
      return;
    }
    const updated = informacoes.map((i) => {
      if (i.id === id) {
        const isDefault = typeof i.id === 'number';
        return { ...i, titulo: isDefault ? i.titulo : (t || i.titulo), conteudo: c, anexoUrl: a || null };
      }
      return i;
    });
    setInformacoes(updated);
    await AsyncStorage.setItem('adminInfos', JSON.stringify(updated));
    setEditId(null);
    setEditTitle('');
    setEditContent('');
    setEditAnexo('');
    Alert.alert('Sucesso', 'Informação atualizada.');
  };

  const handleDeleteInfo = async (id) => {
    const updated = informacoes.filter((i) => i.id !== id);
    setInformacoes(updated);
    await AsyncStorage.setItem('adminInfos', JSON.stringify(updated));
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditContent('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Informações Úteis</Text>
      <Text style={styles.subtitle}>Veja aqui informações importantes para o cidadão.</Text>

      {isAdmin && (
        <View style={styles.adminForm}>
          <Text style={styles.adminTitle}>Editor (Administrador)</Text>
          <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
          <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Conteúdo" value={newContent} onChangeText={setNewContent} multiline />
          <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Anexo (URL opcional)" value={newAnexo} onChangeText={setNewAnexo} />
          <TouchableOpacity style={styles.addButton} onPress={handleAddInfo}>
            <Text style={{color: '#fff', fontSize: 14}}>➕</Text>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {informacoes.map((item) => (
        <View key={item.id} style={styles.infoCard}>
          <TouchableOpacity 
            style={styles.infoHeader} 
            onPress={() => toggleItem(item.id)}
          >
            <Text style={styles.infoTitle}>{item.titulo}</Text>
            <Text style={styles.expandIcon}>{expandedItem === item.id ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          
          {expandedItem === item.id && (
            <View style={styles.infoContent}>
              {editId === item.id ? (
                <View>
                  {typeof item.id === 'number' ? (
                    <Text style={styles.fixedTitle}>{item.titulo}</Text>
                  ) : (
                    <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} placeholder="Título" />
                  )}
                  <TextInput style={[styles.input, { marginTop: 8 }]} value={editContent} onChangeText={setEditContent} placeholder="Conteúdo" multiline />
                  <TextInput style={[styles.input, { marginTop: 8 }]} value={editAnexo} onChangeText={setEditAnexo} placeholder="Anexo (URL opcional)" />
                  {isAdmin && (
                    <View style={styles.actions}>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveInfo(item.id)}>
                        <Text style={{color: '#fff', fontSize: 14}}>💾</Text>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                        <Text style={{color: '#fff', fontSize: 14}}>❌</Text>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <Text style={styles.infoText}>{item.conteudo}</Text>
                  {item.anexoUrl ? (
                    <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL(item.anexoUrl)}>
                      <Text style={styles.linkButtonText}>Abrir anexo</Text>
                    </TouchableOpacity>
                  ) : null}
                  {isAdmin && (
                    <View style={styles.actions}>
                      <TouchableOpacity style={styles.editButton} onPress={() => handleEditInfo(item)}>
                        <Text style={{color: '#fff', fontSize: 14}}>✏️</Text>
                        <Text style={styles.editButtonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteInfo(item.id)}>
                        <Text style={{color: '#fff', fontSize: 14}}>🗑️</Text>
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  fixedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  adminForm: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    padding: 12,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#2196f3',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  expandIcon: { fontSize: 16, color: '#666' },
  infoContent: { marginTop: 10 },
  infoText: { fontSize: 14, color: '#333' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  editButton: { flexDirection: 'row', gap: 6, backgroundColor: '#6a1b9a', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  editButtonText: { color: '#fff', fontWeight: '600' },
  deleteButton: { flexDirection: 'row', gap: 6, backgroundColor: '#d9534f', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: '600' },
  saveButton: { flexDirection: 'row', gap: 6, backgroundColor: '#4caf50', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  cancelButton: { flexDirection: 'row', gap: 6, backgroundColor: '#9e9e9e', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  cancelButtonText: { color: '#fff', fontWeight: '600' },
});