import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../components/SidebarComponent'; // ajuste o caminho se estiver em outra pasta

type NomeItem = {
  nome: string;
  acao: string;
  inst: string;
  sit: string;
};

export default function SeridoBusApp({navigation}: {navigation: any}) {
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewList, setViewList] = useState(true);
  const [names, setNames] = useState<NomeItem[]>([
    { nome: "exemplo 1", acao: "Ida", inst: "UFRN", sit: "Cadastrado" },
    { nome: "exemplo 2", acao: "Volta", inst: "UFRN", sit: "Pendente" },
    { nome: "exemplo 3", acao: "Ida", inst: "UFRN", sit: "Confirmado" },
  ]);

  const [name, setName] = useState('');
  const [acao, setAcao] = useState('');
  const [inst, setInst] = useState('');
  const [sit, setSit] = useState('');

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

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity onPress={() => setViewList(false)} className="bg-yellow-400 px-3 py-2 rounded-xl">
            <Text className="text-black font-bold">Adicionar nome</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewList(true)} className="bg-yellow-400 px-3 py-2 rounded-xl">
            <Text className="text-black font-bold">Ver lista</Text>
          </TouchableOpacity>
        </View>

        {viewList ? (
          <FlatList
            data={names}
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
                <Text className="w-[25%] text-center">{item.sit}</Text>
              </View>
            )}
            ListEmptyComponent={<Text className="text-center text-gray-500">Nada na lista</Text>}
          />

        ) : (
          <View className="gap-4">
            <TextInput placeholder="Nome" value={name} onChangeText={setName} className="border border-black p-2 rounded-md" />
            <TextInput placeholder="Ação" value={acao} onChangeText={setAcao} className="border border-black p-2 rounded-md" />
            <TextInput placeholder="Instituição" value={inst} onChangeText={setInst} className="border border-black p-2 rounded-md" />
            <TextInput placeholder="Situação" value={sit} onChangeText={setSit} className="border border-black p-2 rounded-md" />
            <TouchableOpacity
              onPress={() => {
                if (name.trim()) {
                  setNames([...names, { nome: name, acao, inst, sit }]);
                  setName('');
                  setAcao('');
                  setInst('');
                  setSit('');
                  setViewList(true);
                }
              }}
              className="bg-yellow-400 p-3 rounded-xl items-center"
            >
              <Text className="font-bold text-black">Salvar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
