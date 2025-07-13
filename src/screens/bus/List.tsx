// ListBusScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, Modal, Pressable, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../../components/SidebarComponent';
import BusService from '../../services/services_bus';   // <= novo import
import { Bus } from '../../models/Bus';

export default function ListBusScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  // campos de formulário
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  // ------- CARREGAR LISTA -------
  useEffect(() => {
    (async () => {
      try {
        const buses = await BusService.ListBus();
        setData(buses);
        console.log('Buses loaded:', buses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------- ADICIONAR -------
  const handleAddBus = async () => {
    if (!name || !color || !capacity) return;
    try {
      const created = await BusService.RegisterBus({
        name, color, maxCapacity: Number(capacity)
      } as any);
      setData(prev => [...prev, created]);
      setName(''); setColor(''); setCapacity('');
    } catch (err) {
      console.error(err);
    }
  };

  // ------- EDITAR -------
  const openEditModal = (bus: Bus) => {
    setName(bus.name);
    setColor(bus.color);
    setCapacity(String(bus.maxCapacity));
    setEditingBus(bus);
    setEditModalVisible(true);
  };

  const handleUpdateBus = async () => {
    if (!editingBus) return;
    try {
      const updated = await BusService.EditBus({
        id: editingBus.id,
        name, color,
        maxCapacity: Number(capacity)
      } as any);
      setData(prev =>
        prev.map(b => (b.id === updated.id ? updated : b))
      );
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
    }
  };

  // ------- EXCLUIR -------
  const handleDelete = async (bus: Bus) => {
    try {
      await BusService.DeleteBus({ id: bus.id } as any);
      setData(prev => prev.filter(b => b.id !== bus.id));
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setEditModalVisible(false);
    setEditingBus(null);
    setName(''); setColor(''); setCapacity('');
  };

  if (loading) {   // spinner simples
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // …continuação do ListBusScreen.tsx

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      <View className="flex-row items-center justify-between px-4 py-3 bg-yellow-400">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-black">SeridoBus</Text>

        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View className="p-4 space-y-4">
        {/* Formulário */}
        <Text className="text-lg font-bold text-black">Cadastrar Ônibus</Text>

        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Placa do ônibus"
          value={name}
          onChangeText={setName}
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

        {/* Lista */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
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
              <Text className="w-[30%] text-center">{item.name}</Text>
              <Text className="w-[20%] text-center">{item.color}</Text>
              <Text className="w-[20%] text-center">{item.maxCapacity}</Text>
              <View className="w-[20%] flex-row justify-center space-x-2">
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Ionicons name="create" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Ionicons name="trash" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-4">
              Nenhum ônibus cadastrado.
            </Text>
          }
        />
      </View>

      {/* Modal de edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-4 text-black">
              Editar Ônibus
            </Text>

            <TextInput
              className="border border-black rounded-lg p-2 mb-2"
              placeholder="Placa"
              value={name}
              onChangeText={setName}
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
                onPress={closeModal}
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
