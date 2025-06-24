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

type BusItem = {
  bus: string;
  color: string;
  capacity: number;
};

export default function ListBusScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState<BusItem[]>([
    { bus: 'BRA2E19', color: 'branco', capacity: 55 },
    { bus: 'RGH2E19', color: 'amarelo', capacity: 59 },
  ]);

  const [bus, setBus] = useState('');
  const [color, setColor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddBus = () => {
    if (!bus || !color || !capacity) return;

    const newItem: BusItem = {
      bus: bus.trim().toUpperCase(),
      color: color.trim().toLowerCase(),
      capacity: parseInt(capacity),
    };

    setData((prev) => [...prev, newItem]);
    setBus('');
    setColor('');
    setCapacity('');
  };

  const openEditModal = (index: number) => {
    const item = data[index];
    setBus(item.bus);
    setColor(item.color);
    setCapacity(item.capacity.toString());
    setEditIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateBus = () => {
    if (editIndex === null) return;

    const updatedItem: BusItem = {
      bus: bus.trim().toUpperCase(),
      color: color.trim().toLowerCase(),
      capacity: parseInt(capacity),
    };

    const newData = [...data];
    newData[editIndex] = updatedItem;
    setData(newData);

    setEditModalVisible(false);
    setEditIndex(null);
    setBus('');
    setColor('');
    setCapacity('');
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
        <Text className="text-lg font-bold text-black">Cadastrar Ônibus</Text>
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Placa do ônibus"
          value={bus}
          onChangeText={setBus}
        />
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Cor do ônibus"
          value={color}
          onChangeText={setColor}
        />
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Capacidade"
          keyboardType="numeric"
          value={capacity}
          onChangeText={setCapacity}
        />
        <TouchableOpacity
          onPress={handleAddBus}
          className="bg-yellow-400 py-2 rounded-lg items-center"
        >
          <Text className="font-bold text-black">Adicionar ônibus</Text>
        </TouchableOpacity>

        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <View className="flex-row border-b border-black bg-yellow-200 p-2">
              <Text className="w-[10%] font-bold text-center">#</Text>
              <Text className="w-[30%] font-bold text-center">Ônibus</Text>
              <Text className="w-[20%] font-bold text-center">Cor</Text>
              <Text className="w-[20%] font-bold text-center">Capacidade</Text>
              <Text className="w-[20%] font-bold text-center">Ações</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View className="flex-row border-b border-black p-2 bg-yellow-50">
              <Text className="w-[10%] text-center">{index + 1}</Text>
              <Text className="w-[30%] text-center">{item.bus}</Text>
              <Text className="w-[20%] text-center">{item.color}</Text>
              <Text className="w-[20%] text-center">{item.capacity}</Text>
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
            <Text className="text-xl font-bold mb-4 text-black">Editar Ônibus</Text>
            <TextInput
              className="border border-black rounded-lg p-2 mb-2"
              placeholder="Placa"
              value={bus}
              onChangeText={setBus}
            />
            <TextInput
              className="border border-black rounded-lg p-2 mb-2"
              placeholder="Cor"
              value={color}
              onChangeText={setColor}
            />
            <TextInput
              className="border border-black rounded-lg p-2 mb-4"
              placeholder="Capacidade"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
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
                onPress={handleUpdateBus}
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
