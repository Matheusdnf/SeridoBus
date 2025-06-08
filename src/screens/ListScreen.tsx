import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../components/SidebarComponent'; // ajuste o caminho se precisar
import { Picker } from '@react-native-picker/picker';

type NomeItem = {
  nome: string;
  acao: 'Ida' | 'Volta';
  inst: string;
  sit: 'associado' | 'cadastrado' | 'carona';
};

export default function SeridoBusApp({ navigation }: { navigation: any }) {
  const loggedIn = true;
  const userName = "Marlison";
  const userSituation = "associado";

  const [menuVisible, setMenuVisible] = useState(false);
  const [viewList, setViewList] = useState<'ida' | 'volta' | 'add'>('ida');
  const [names, setNames] = useState<NomeItem[]>([
    { nome: "Juan", acao: "Ida", inst: "UFRN", sit: "cadastrado" },
    { nome: "Juan", acao: "Volta", inst: "UFRN", sit: "cadastrado" },
    { nome: "João", acao: "Ida", inst: "UFRN", sit: "carona" },
    { nome: "João", acao: "Volta", inst: "UFRN", sit: "carona" },
    { nome: "Matheus", acao: "Ida", inst: "UFRN", sit: "associado" },
  ]);

  const [inst, setInst] = useState('');
  const [sit, setSit] = useState<'associado' | 'cadastrado' | 'carona'>('carona');
  const [acao, setAcao] = useState<'Ida' | 'Volta' | 'Ida e volta'>('Ida');
  const [name, setName] = useState('');

  const prioridade: Record<string, number> = {
    associado: 1,
    cadastrado: 2,
    carona: 3,
  };

  const listaFiltradaOrdenada = names
    .filter(item => item.acao.toLowerCase() === viewList)
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
        <View className="border border-black px-3 py-2 rounded-xl mb-2 bg-yellow-100">
          <Text className="font-bold text-black">Quadro de avisos</Text>
          <Text className="text-black">O ônibus deverá sair 20 minutos mais cedo, às 11h30.</Text>
        </View>
        {(viewList === 'ida' || viewList === 'volta') && (
          <View className="mb-2 px-3 py-2 border border-black rounded-xl bg-yellow-100">
            <Text className="font-bold">Resumo:</Text>
            <Text>Total: {listaFiltradaOrdenada.length}</Text>
            {Object.entries(
              listaFiltradaOrdenada.reduce((acc: Record<string, number>, item: NomeItem) => {
                acc[item.inst] = (acc[item.inst] || 0) + 1;
                return acc;
              }, {})
            ).map(([inst, count]) => (
              <Text key={inst}>
                {inst}: {count}
              </Text>
            ))}
          </View>
        )}

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity onPress={() => setViewList('add')} className={`px-3 py-2 rounded-xl bg-yellow-400 ${viewList === 'add' ? 'opacity-100' : 'opacity-70'}`}>
            <Text className="text-black font-bold">Adicionar nome</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewList('ida')} className={`px-3 py-2 rounded-xl bg-yellow-400 ${viewList === 'ida' ? 'opacity-100' : 'opacity-70'}`}>
            <Text className="text-black font-bold">Lista Ida</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewList('volta')} className={`px-3 py-2 rounded-xl bg-yellow-400 ${viewList === 'volta' ? 'opacity-100' : 'opacity-70'}`}>
            <Text className="text-black font-bold">Lista Volta</Text>
          </TouchableOpacity>
        </View>

        {viewList === 'add' ? (
          <View className="gap-4">
            {!loggedIn && (
              <TextInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                className="border border-black p-2 rounded-md"
              />
            )}

            <View>
              <Picker
                selectedValue={inst}
                onValueChange={(itemValue) => setInst(itemValue)}
                style={{
                  height: 50,
                  color: inst ? 'black' : 'gray',
                }}
                dropdownIconColor="black"
                className="border border-black rounded-md bg-white px-3"
              >
                <Picker.Item label="Selecione a instituição" value="" enabled={false} />
                <Picker.Item label="UFRN" value="UFRN" />
                <Picker.Item label="IFRN" value="IFRN" />
                <Picker.Item label="FCST" value="FCST" />
                <Picker.Item label="UERN" value="UERN" />
                <Picker.Item label="UNP" value="UNP" />
                <Picker.Item label="Centro" value="Centro" />
              </Picker>
            </View>



            {/* Seleção: Ida, Volta ou ambos */}
            <View className="flex-row justify-between">
              {(['Ida', 'Volta', 'Ida e volta'] as const).map((opcao) => (
                <TouchableOpacity
                  key={opcao}
                  onPress={() => setAcao(opcao)}
                  className={`flex-1 py-2 mx-1 rounded ${acao === opcao ? 'bg-yellow-400' : 'bg-gray-300'}`}
                >
                  <Text className="text-center font-bold">{opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>


            <TouchableOpacity
              onPress={() => {
                const finalNome = loggedIn ? userName : name.trim();
                const finalSit = loggedIn ? userSituation : sit;
                if (!finalNome || !inst.trim()) return;

                const novos: NomeItem[] = [];

                if (acao === 'Ida' || acao === 'Ida e volta') {
                  novos.push({ nome: finalNome, acao: 'Ida', inst: inst.trim(), sit: finalSit });
                }
                if (acao === 'Volta' || acao === 'Ida e volta') {
                  novos.push({ nome: finalNome, acao: 'Volta', inst: inst.trim(), sit: finalSit });
                }

                setNames([...names, ...novos]);
                setName('');
                setInst('');
                setSit('cadastrado');
                setAcao('Ida');
                setViewList('ida');
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
                <Text className="w-[10%] font-bold text-center">#</Text>
                <Text className="w-[30%] font-bold text-center">Nome</Text>
                <Text className="w-[30%] font-bold text-center">Instituição</Text>
                <Text className="w-[30%] font-bold text-center">Situação</Text>
              </View>
            )}

            renderItem={({ item, index }: { item: NomeItem; index: number }) => (
              <View className="flex-row border-b border-black p-2 bg-yellow-50">
                <Text className="w-[10%] text-center">{index + 1}</Text>
                <Text className="w-[30%] text-center">{item.nome}</Text>
                <Text className="w-[30%] text-center">{item.inst}</Text>
                <Text className="w-[30%] text-center capitalize">{item.sit}</Text>
              </View>
            )}
            ListEmptyComponent={<Text className="text-center text-gray-500">Nada na lista</Text>}
          />

        )}
        
      </View>
    </SafeAreaView>
  );
}
