import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/SidebarComponent";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../components/alert";
import UserService from "../services/services_user";

export default function UserProfileScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const [feedbackAlert, setFeedbackAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await UserService.getUserProfile();
        setUserData(profile);
      } catch (error: any) {
        setFeedbackAlert({
          visible: true,
          title: "Erro",
          message: error.message || "Erro ao carregar perfil",
        });
      }
    };

    loadProfile();
  }, []);

  const saveProfileChanges = async () => {
    try {
      await UserService.updateUserProfile(userData.nome, userData.telefone);
      setEditing(false);
      setFeedbackAlert({
        visible: true,
        title: "Sucesso",
        message: "Dados atualizados com sucesso!",
      });
    } catch (error: any) {
      setFeedbackAlert({
        visible: true,
        title: "Erro",
        message: error.message || "Não foi possível atualizar os dados.",
      });
    }
  };

  const confirmDelete = async () => {
    setAlertVisible(false);
    try {
      await UserService.deleteUserAccount();

      setFeedbackAlert({
        visible: true,
        title: "Conta excluída",
        message: "Sua conta foi excluída com sucesso!",
      });

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 1000);
    } catch (error: any) {
      setFeedbackAlert({
        visible: true,
        title: "Erro",
        message: error.message || "Erro inesperado ao excluir conta.",
      });
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
        <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <View className="border border-black rounded-xl bg-yellow-100 p-4 mb-4">
          <Text className="text-lg font-bold mb-2 text-black">
            Informações do Usuário
          </Text>

          {editing ? (
            <>
              <Text className="text-black font-semibold">Nome:</Text>
              <TextInput
                value={userData.nome}
                onChangeText={(text) =>
                  setUserData({ ...userData, nome: text })
                }
                className="border border-black rounded-md p-2 mb-2 bg-white"
              />

              <Text className="text-black font-semibold">Telefone:</Text>
              <TextInput
                value={userData.telefone}
                onChangeText={(text) =>
                  setUserData({ ...userData, telefone: text })
                }
                className="border border-black rounded-md p-2 mb-2 bg-white"
                keyboardType="phone-pad"
              />

              <Text className="text-black font-semibold">Email:</Text>
              <TextInput
                editable={false}
                value={userData.email}
                className="border border-black rounded-md p-2 mb-2 bg-gray-100"
              />

              <Text className="text-black font-semibold">Senha:</Text>
              <TextInput
                editable={false}
                value="********"
                className="border border-black rounded-md p-2 mb-2 bg-gray-100"
              />

              <TouchableOpacity
                onPress={saveProfileChanges}
                className="bg-yellow-400 p-3 rounded-xl items-center mt-2"
              >
                <Text className="font-bold text-black">Salvar Alterações</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-black">Nome: {userData.nome}</Text>
              <Text className="text-black">Telefone: {userData.telefone}</Text>
              <Text className="text-black">Email: {userData.email}</Text>
              <Text className="text-black">Senha: ********</Text>
            </>
          )}
        </View>

        {!editing && (
          <TouchableOpacity
            onPress={() => setEditing(true)}
            className="bg-yellow-400 p-3 rounded-xl items-center mb-3"
          >
            <Text className="font-bold text-black">Editar Informações</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setAlertVisible(true)}
          className="bg-red-400 p-3 rounded-xl items-center"
        >
          <Text className="font-bold text-white">Excluir Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Alerta de Confirmação de Exclusão */}
      <CustomAlert
        visible={alertVisible}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir sua conta?"
        onClose={() => setAlertVisible(false)}
        onConfirm={confirmDelete}
        showCancel
      />

      {/* Alerta de Feedback (erro/sucesso) */}
      <CustomAlert
        visible={feedbackAlert.visible}
        title={feedbackAlert.title}
        message={feedbackAlert.message}
        onClose={() => setFeedbackAlert({ ...feedbackAlert, visible: false })}
      />
    </SafeAreaView>
  );
}
