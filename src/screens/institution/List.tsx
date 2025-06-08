import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../../components/SidebarComponent';

type InstitutionItem = {
  institution: string;
};

export default function ListInstitutionScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState<InstitutionItem[]>([
    { institution: 'UFRN' },
    { institution: 'IFRN' },
    { institution: 'FCST' },
  ]);

  const [institution, setInstitution] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddInstitution = () => {
    if (!institution.trim()) return;
    const newItem: InstitutionItem = { institution: institution.trim().toUpperCase() };
    setData((prev) => [...prev, newItem]);
    setInstitution('');
  };

  const openEditModal = (index: number) => {
    const item = data[index];
    setInstitution(item.institution);
    setEditIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateInstitution = () => {
    if (editIndex === null) return;

    const updatedItem: InstitutionItem = { institution: institution.trim().toUpperCase() };
    const newData = [...data];
    newData[editIndex] = updatedItem;
    setData(newData);

    setEditModalVisible(false);
    setEditIndex(null);
    setInstitution('');
  };

  const handleDelete = (index: number) => {
    setData(data.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditModalVisible(false);
      setEditIndex(null);
    }
  };

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

      <View className="p-4 space-y-4">
        <Text className="text-lg font-bold text-black">Cadastrar Instituição</Text>
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Nome da instituição"
          value={institution}
          onChangeText={setInstitution}
        />
        <TouchableOpacity
          onPress={handleAddInstitution}
          className="bg-yellow-400 py-2 rounded-lg items-center"
        >
          <Text className="font-bold text-black">Adicionar instituição</Text>
        </TouchableOpacity>

        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <View className="flex-row border-b border-black bg-yellow-200 p-2">
              <Text className="w-[10%] font-bold text-center">#</Text>
              <Text className="w-[70%] font-bold text-center">Instituição</Text>
              <Text className="w-[20%] font-bold text-center">Ações</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View className="flex-row border-b border-black p-2 bg-yellow-50">
              <Text className="w-[10%] text-center">{index + 1}</Text>
              <Text className="w-[70%] text-center">{item.institution}</Text>
              <View className="w-[20%] flex-row justify-center space-x-2">
                <TouchableOpacity onPress={() => openEditModal(index)}>
                  <Ionicons name="create" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Ionicons name="trash" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500">Nada na lista</Text>
          }
        />
      </View>

      {/* Modal de Edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-4 text-black">Editar Instituição</Text>
            <TextInput
              className="border border-black rounded-lg p-2 mb-4"
              placeholder="Instituição"
              value={institution}
              onChangeText={setInstitution}
            />
            <View className="flex-row justify-between">
              <Pressable
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onPress={() => setEditModalVisible(false)}
              >
                <Text className="text-black font-bold">Cancelar</Text>
              </Pressable>
              <Pressable
                className="bg-yellow-400 px-4 py-2 rounded-lg"
                onPress={handleUpdateInstitution}
              >
                <Text className="text-black font-bold">Atualizar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
