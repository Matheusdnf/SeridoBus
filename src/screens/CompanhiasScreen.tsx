import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../components/SidebarComponent'; // ajuste se necessário
import { Company } from '../models/Company'; // ajuste se necessário

export default function CompanhiasScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [companhias, setCompanhias] = useState<Company[]>([
    new Company(1, 'Jardim <-> Caicó'),
    new Company(2, 'São José <-> Caicó'),
  ]);

  const [novaCompanhia, setNovaCompanhia] = useState('');

  const adicionarCompanhia = () => {
    if (!novaCompanhia.trim()) return;
    const nova = new Company(Date.now(), novaCompanhia.trim());
    setCompanhias([...companhias, nova]);
    setNovaCompanhia('');
  };

  const excluirCompanhia = (id: number) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir essa companhia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setCompanhias(companhias.filter(c => c.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Cabeçalho padrão */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-yellow-400">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-black">SeridoBus</Text>

        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo da tela */}
      <View className="p-4">

        {/* Formulário para adicionar nova companhia */}
        <View className="border border-black rounded-xl p-3 bg-yellow-100 mb-5">
          <Text className="font-bold mb-2 text-black">Nova Companhia</Text>
          <TextInput
            placeholder="Nome da companhia"
            value={novaCompanhia}
            onChangeText={setNovaCompanhia}
            className="bg-white border border-black rounded-md px-3 py-2 mb-2"
          />
          <TouchableOpacity
            onPress={adicionarCompanhia}
            className="bg-yellow-400 p-3 rounded-xl items-center"
          >
            <Text className="font-bold text-black">Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de companhias */}
        <FlatList
          data={companhias}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text className="text-center text-gray-500">Nenhuma companhia cadastrada</Text>
          }
          renderItem={({ item }) => (
            <View className="border border-black rounded-xl bg-yellow-50 p-3 mb-3">
              <Text className="font-bold text-black">{item.name}</Text>

              <View className="flex-row justify-end gap-3 mt-2">
                <TouchableOpacity
                  onPress={() => navigation.navigate('AlunosCompanhia', { companhiaId: item.id })}
                  className="bg-yellow-300 px-3 py-2 rounded"
                >
                  <Text className="font-bold text-black">Ver Alunos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => excluirCompanhia(item.id)}
                  className="bg-red-400 px-3 py-2 rounded"
                >
                  <Text className="font-bold text-white">Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
