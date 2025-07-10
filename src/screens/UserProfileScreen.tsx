import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../components/SidebarComponent';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [editing, setEditing] = useState(false);

  const [userData, setUserData] = useState({
    nome: 'Marlison',
    email: 'marlison@email.com',
    instituicao: 'UFRN',
    situacao: 'associado',
  });

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => console.log('Conta excluída') },
      ]
    );
  };

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

      <View className="p-4">
        <View className="border border-black rounded-xl bg-yellow-100 p-4 mb-4">
          <Text className="text-lg font-bold mb-2 text-black">Informações do Usuário</Text>

          {editing ? (
            <>
            {/* Precisa saber o que é permitido editar */} 

              <Text className="text-black font-semibold">Nome:</Text>
              <TextInput
                value={userData.nome}
                onChangeText={(text) => setUserData({ ...userData, nome: text })}
                className="border border-black rounded-md p-2 mb-2 bg-white"
              />

              <Text className="text-black font-semibold">Email:</Text>
              <TextInput
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                className="border border-black rounded-md p-2 mb-2 bg-white"
              />

              <Text className="text-black font-semibold">Instituição:</Text>
              <TextInput
                value={userData.instituicao}
                onChangeText={(text) => setUserData({ ...userData, instituicao: text })}
                className="border border-black rounded-md p-2 mb-2 bg-white"
              />

              <Text className="text-black font-semibold">Situação:</Text>
              <TextInput
                value={userData.situacao}
                onChangeText={(text) => setUserData({ ...userData, situacao: text })}
                className="border border-black rounded-md p-2 mb-2 bg-white"
              />

              <TouchableOpacity
                onPress={() => setEditing(false)}
                className="bg-yellow-400 p-3 rounded-xl items-center mt-2"
              >
                <Text className="font-bold text-black">Salvar Alterações</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-black">Nome: {userData.nome}</Text>
              <Text className="text-black">Email: {userData.email}</Text>
              <Text className="text-black">Instituição: {userData.instituicao}</Text>
              <Text className="text-black capitalize">Situação: {userData.situacao}</Text>
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
          onPress={handleDelete}
          className="bg-red-400 p-3 rounded-xl items-center"
        >
          <Text className="font-bold text-white">Excluir Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
