import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppLayout from "../../components/AppLayout"; // importou layout
import { Destination } from "../../models/Destination";
import DestinationService from "../../services/services_Destination";
import CustomAlert from "../../components/alert";

export default function ListDestinationScreen({ navigation }: { navigation: any }) {
  const [data, setData] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [DestinationName, setDestinationName] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  // Estados do alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | null>(null);
  const [alertShowCancel, setAlertShowCancel] = useState(false);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOnConfirm(null);
    setAlertShowCancel(false);
    setAlertVisible(true);
  };

  const showConfirmAlert = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOnConfirm(() => onConfirm);
    setAlertShowCancel(true);
    setAlertVisible(true);
  };

  const fetchDestinations = useCallback(async () => {
    try {
      setIsLoading(true);
      const Destinations = await DestinationService.ListDestinations();
      setData(Destinations);
    } catch (error) {
      console.error("Erro ao buscar destinos:", error);
      showAlert("Erro", "Não foi possível carregar os destinos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleAddDestination = async () => {
    if (!DestinationName.trim()) {
      showAlert("Atenção", "O nome do destino não pode ser vazio.");
      return;
    }

    try {
      const newDestination = new Destination(
        0,
        DestinationName.trim().toUpperCase()
      );
      await DestinationService.RegisterDestination(newDestination);
      setDestinationName("");
      await fetchDestinations();
      showAlert("Sucesso", "Destino adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar destino:", error);
      showAlert("Erro", "Não foi possível adicionar do destino.");
    }
  };

  const openEditModal = (Destination: Destination) => {
    setEditingDestination(Destination);
    setDestinationName(Destination.name);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingDestination(null);
    setDestinationName("");
  };

  const handleUpdateDestination = async () => {
    if (!editingDestination || !DestinationName.trim()) {
      showAlert("Atenção", "O nome do Destino não pode ser vazio.");
      return;
    }

    try {
      const updatedDestination = {
        ...editingDestination,
        name: DestinationName.trim().toUpperCase(),
      };
      await DestinationService.EditDestinations(updatedDestination);
      closeEditModal();
      await fetchDestinations();
      showAlert("Sucesso", "Destino atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar destino:", error);
      showAlert("Erro", "Não foi possível atualizar destino.");
    }
  };

  const handleDelete = (Destination: Destination) => {
    showConfirmAlert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o destino "${Destination.name}"?`,
      async () => {
        try {
          await DestinationService.DeleteDestination(Destination);
          await fetchDestinations();
          showAlert("Sucesso", "Destino excluído com sucesso!");
        } catch (error) {
          console.error("Erro ao deletar destino:", error);
          showAlert("Erro", "Não foi possível deletar o destino.");
        }
      }
    );
  };

  return (
    <AppLayout title="SeridoBus" navigation={navigation}>
      <View className="p-4 space-y-4">
        {/* Formulário */}
        <Text className="text-lg font-bold text-black">Cadastrar Destino</Text>
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Nome do destino"
          value={DestinationName}
          onChangeText={setDestinationName}
        />
        <TouchableOpacity
          onPress={handleAddDestination}
          className="bg-yellow-400 py-2 rounded-lg items-center"
        >
          <Text className="font-bold text-black">Adicionar Destino</Text>
        </TouchableOpacity>

        {/* Lista */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#fbbf24" className="mt-10" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => (
              <View className="flex-row border-b border-black bg-yellow-200 p-2">
                <Text className="w-[10%] font-bold text-center">#</Text>
                <Text className="w-[70%] font-bold text-center">Destino</Text>
                <Text className="w-[20%] font-bold text-center">Ações</Text>
              </View>
            )}
            renderItem={({ item, index }) => (
              <View className="flex-row border-b border-black p-2 bg-yellow-50">
                <Text className="w-[10%] text-center">{index + 1}</Text>
                <Text className="w-[70%] text-center">{item.name}</Text>
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
                Nenhum Destino cadastrada.
              </Text>
            }
          />
        )}
      </View>

      {/* Modal de Edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-4 text-black">Editar Destino</Text>
            <TextInput
              className="border border-black rounded-lg p-2 mb-4"
              placeholder="Destino"
              value={DestinationName}
              onChangeText={setDestinationName}
            />
            <View className="flex-row justify-between">
              <Pressable
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onPress={closeEditModal}
              >
                <Text className="text-black font-bold">Cancelar</Text>
              </Pressable>
              <Pressable
                className="bg-yellow-400 px-4 py-2 rounded-lg"
                onPress={handleUpdateDestination}
              >
                <Text className="text-black font-bold">Atualizar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Componente de Alerta Externo */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertOnConfirm ?? undefined}
        showCancel={alertShowCancel}
      />
    </AppLayout>
  );
}
