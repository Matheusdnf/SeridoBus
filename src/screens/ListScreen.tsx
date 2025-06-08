import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../components/SidebarComponent'; // ajuste o caminho se precisar

type NomeItem = {
  nome: string;
  acao: 'Ida' | 'Volta';
  inst: string;
  sit: 'associado' | 'cadastrado' | 'carona';
};

export default function SeridoBusApp({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewList, setViewList] = useState<'ida' | 'volta' | 'add'>('ida');
  const [names, setNames] = useState<NomeItem[]>([
    { nome: "Juan", acao: "Ida", inst: "UFRN", sit: "cadastrado" },
    { nome: "Juan", acao: "Volta", inst: "UFRN", sit: "cadastrado" },
    { nome: "Marlison", acao: "Ida", inst: "UFRN", sit: "carona" },
    { nome: "Marlison", acao: "Volta", inst: "UFRN", sit: "carona" },
    { nome: "Matheus", acao: "Ida", inst: "UFRN", sit: "associado" },
  ]);

  const [name, setName] = useState('');
  const [acao, setAcao] = useState<'Ida' | 'Volta'>('Ida');
  const [inst, setInst] = useState('');
  const [sit, setSit] = useState<'associado' | 'cadastrado' | 'carona'>('cadastrado');

  const prioridade: Record<string, number> = {
    associado: 1,
    cadastrado: 2,
    carona: 3,
  };

  // filtra e ordena a lista pelo acao e prioridade
  const listaFiltradaOrdenada = names
    .filter(item => item.acao.toLowerCase() === viewList) // viewList = 'ida' ou 'volta'
    .sort((a, b) => prioridade[a.sit] - prioridade[b.sit]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      <View className="flex-row items-center justify-between px-4 py-3 bg-yellow-400">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">SeridoBus</Text>
        <View className="w-7" />
      </View>

      <View className="p-4">
        <View className="border border-black p-3 rounded-xl mb-4 bg-yellow-100">
          <Text className="font-bold text-black mb-2">Quadro de avisos</Text>
          <Text className="text-black">O ônibus deverá sair 20 minutos mais cedo, às 11h30.</Text>
        </View>

        {/* Botões para escolher lista Ida, Volta ou Adicionar */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => setViewList('add')}
            className={`px-3 py-2 rounded-xl bg-yellow-400 ${viewList === 'add' ? 'opacity-100' : 'opacity-70'}`}
          >
            <Text className="text-black font-bold">Adicionar nome</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewList('ida')}
            className={`px-3 py-2 rounded-xl bg-yellow-400 ${viewList === 'ida' ? 'opacity-100' : 'opacity-70'}`}
          >
            <Text className="text-black font-bold">Lsta Ida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewList('volta')}
            className={`px-3 py-2 rounded-xl bg-yellow-400 ${viewList === 'volta' ? 'opacity-100' : 'opacity-70'}`}
          >
            <Text className="text-black font-bold">Lista Volta</Text>
          </TouchableOpacity>
        </View>

        {viewList === 'add' ? (
          <View className="gap-4">
            <TextInput
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              className="border border-black p-2 rounded-md"
            />

            {/* Seleção de Ação: Ida ou Volta */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setAcao('Ida')}
                className={`flex-1 py-2 mr-2 rounded ${
                  acao === 'Ida' ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              >
                <Text className="text-center font-bold">Ida</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAcao('Volta')}
                className={`flex-1 py-2 rounded ${
                  acao === 'Volta' ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              >
                <Text className="text-center font-bold">Volta</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Instituição"
              value={inst}
              onChangeText={setInst}
              className="border border-black p-2 rounded-md"
            />

            {/* Seleção de Situação */}
            <View className="flex-row justify-between">
              {(['associado', 'cadastrado', 'carona'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setSit(status)}
                  className={`flex-1 py-2 mx-1 rounded ${
                    sit === status ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <Text className="text-center font-bold capitalize">{status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => {
                if (name.trim()) {
                  setNames([...names, { nome: name.trim(), acao, inst: inst.trim() || '-', sit }]);
                  setName('');
                  setAcao('Ida');
                  setInst('');
                  setSit('cadastrado');
                  setViewList('ida');
                }
              }}
              className="bg-yellow-400 p-3 rounded-xl items-center"
            >
              <Text className="font-bold text-black">Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={listaFiltradaOrdenada}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={() => (
              <View className="flex-row border-b border-black bg-yellow-200 p-2">
                <Text className="w-[25%] font-bold text-center">Nome</Text>
                <Text className="w-[25%] font-bold text-center">Ação</Text>
                <Text className="w-[25%] font-bold text-center">Instituição</Text>
                <Text className="w-[25%] font-bold text-center">Situação</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="flex-row border-b border-black p-2 bg-yellow-50">
                <Text className="w-[25%] text-center">{item.nome}</Text>
                <Text className="w-[25%] text-center">{item.acao}</Text>
                <Text className="w-[25%] text-center">{item.inst}</Text>
                <Text className="w-[25%] text-center capitalize">{item.sit}</Text>
              </View>
            )}
            ListEmptyComponent={<Text className="text-center text-gray-500">Nada na lista</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
