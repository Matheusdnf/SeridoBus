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
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../../components/SidebarComponent";
import { Institution } from "../../models/Institution";
import InstitutionService from "../../services/services_intitution";
import CustomAlert from "../../components/alert";

export default function ListInstitutionScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [institutionName, setInstitutionName] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);

  // Estados do alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | null>(
    null
  );
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

  const fetchInstitutions = useCallback(async () => {
    try {
      setIsLoading(true);
      const institutions = await InstitutionService.ListInstitutions();
      setData(institutions);
    } catch (error) {
      console.error("Erro ao buscar instituições:", error);
      showAlert("Erro", "Não foi possível carregar as instituições.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const handleAddInstitution = async () => {
    if (!institutionName.trim()) {
      showAlert("Atenção", "O nome da instituição não pode ser vazio.");
      return;
    }

    try {
      const newInstitution = new Institution(
        0,
        institutionName.trim().toUpperCase()
      );
      await InstitutionService.RegisterInstitution(newInstitution);
      setInstitutionName("");
      await fetchInstitutions();
      showAlert("Sucesso", "Instituição adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar instituição:", error);
      showAlert("Erro", "Não foi possível adicionar a instituição.");
    }
  };

  const openEditModal = (institution: Institution) => {
    setEditingInstitution(institution);
    setInstitutionName(institution.name);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingInstitution(null);
    setInstitutionName("");
  };

  const handleUpdateInstitution = async () => {
    if (!editingInstitution || !institutionName.trim()) {
      showAlert("Atenção", "O nome da instituição não pode ser vazio.");
      return;
    }

    try {
      const updatedInstitution = {
        ...editingInstitution,
        name: institutionName.trim().toUpperCase(),
      };
      await InstitutionService.EditInstitutions(updatedInstitution);
      closeEditModal();
      await fetchInstitutions();
      showAlert("Sucesso", "Instituição atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar instituição:", error);
      showAlert("Erro", "Não foi possível atualizar a instituição.");
    }
  };

  const handleDelete = (institution: Institution) => {
    showConfirmAlert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a instituição "${institution.name}"?`,
      async () => {
        try {
          await InstitutionService.DeleteInstitution(institution);
          await fetchInstitutions();
          showAlert("Sucesso", "Instituição excluída com sucesso!");
        } catch (error) {
          console.error("Erro ao deletar instituição:", error);
          showAlert("Erro", "Não foi possível deletar a instituição.");
        }
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-yellow-400">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">SeridoBus</Text>
        <View className="w-7" />
      </View>

      <View className="p-4 space-y-4">
        {/* Formulário */}
        <Text className="text-lg font-bold text-black">
          Cadastrar Instituição
        </Text>
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Nome da instituição"
          value={institutionName}
          onChangeText={setInstitutionName}
        />
        <TouchableOpacity
          onPress={handleAddInstitution}
          className="bg-yellow-400 py-2 rounded-lg items-center"
        >
          <Text className="font-bold text-black">Adicionar instituição</Text>
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
                <Text className="w-[70%] font-bold text-center">
                  Instituição
                </Text>
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
                Nenhuma instituição cadastrada.
              </Text>
            }
          />
        )}
      </View>

      {/* Modal de Edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-4 text-black">
              Editar Instituição
            </Text>
            <TextInput
              className="border border-black rounded-lg p-2 mb-4"
              placeholder="Instituição"
              value={institutionName}
              onChangeText={setInstitutionName}
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
                onPress={handleUpdateInstitution}
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
    </SafeAreaView>
  );
}
