import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../../components/SidebarComponent';

import UserAdminService from '../../services/UserAdminService';
import { SituationEnum } from '../../models/SituationEnum';
import UserService from '../../services/services_user';

type UserItem = {
  id: string;
  name: string;
  cellphone: string | null;
  situation: SituationEnum;
  adm_company: boolean;
};

export default function ListUserScreen({ navigation }: { navigation: any }) {
  /* ---------- estados ---------- */
  const [menuVisible, setMenuVisible] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [situation, setSituation] = useState<SituationEnum>(SituationEnum.Associado);
  const [isAdminToggle, setIsAdminToggle] = useState(false);          // no modal
  const [searchText, setSearchText] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentAdmin, setIsCurrentAdmin] = useState<boolean>(false);

  /* ---------- carregar usuário logado ---------- */
  useEffect(() => {
      const loadUser = async () => {
        try {
          const profile = await UserService.getCurrentUser();
          setCurrentUserId(profile.id);
        } catch (e) {
          console.error(e);
        }
      };
      loadUser();
    }, []);

  /* ---------- carregar lista ---------- */
  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await UserAdminService.list();
      const formatted = data.map((u: any) => ({
        id: u.id,
        name: u.name ?? '',
        cellphone: u.cellphone ? String(u.cellphone) : null,
        situation: u.situation as SituationEnum,
        adm_company: !!u.adm_company,
      }));
      setUsers(formatted);

      // descobre se o logado é admin
      if (currentUserId) {
        const me = formatted.find((u) => u.id === currentUserId);
        setIsCurrentAdmin(!!me?.adm_company);
      }
    } catch {
      Alert.alert('Erro', 'Falha ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [currentUserId]);

  /* ---------- abrir modal ---------- */
  const openEditModal = (user: UserItem) => {
    setName(user.name);
    setCellphone(user.cellphone ?? '');
    setSituation(user.situation);
    setIsAdminToggle(user.adm_company);
    setEditUserId(user.id);
    setEditModalVisible(true);
  };

  /* ---------- salvar ---------- */
  const handleUpdateUser = async () => {
    if (!editUserId) return;
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const updates = {
        name: name.trim(),
        cellphone: cellphone.trim() === '' ? null : cellphone.trim(),
        situation: situation.charAt(0).toUpperCase() + situation.slice(1), // enum do BD
        adm_company: isAdminToggle,
      };
      await UserAdminService.update(editUserId, updates);

      // atualiza localmente
      setUsers((old) =>
        old.map((u) => (u.id === editUserId ? { ...u, ...updates, situation } : u)),
      );

      // se editou a si próprio e mudou adm, reflete na flag
      if (editUserId === currentUserId) setIsCurrentAdmin(isAdminToggle);

      setEditModalVisible(false);
      setEditUserId(null);
      setName('');
      setCellphone('');
      setSituation(SituationEnum.Associado);
      setIsAdminToggle(false);
    } catch {
      Alert.alert('Erro', 'Falha ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- toggle admin direto na lista ---------- */
  const toggleAdminInline = async (user: UserItem) => {
    try {
      await UserAdminService.update(user.id, {
        name: user.name,
        cellphone: user.cellphone,
        situation: user.situation,
        adm_company: !user.adm_company,
      });
      setUsers((old) =>
        old.map((u) =>
          u.id === user.id ? { ...u, adm_company: !user.adm_company } : u,
        ),
      );

      if (user.id === currentUserId) setIsCurrentAdmin(!user.adm_company);
    } catch {
      Alert.alert('Erro', 'Falha ao alterar privilégio');
    }
  };

  /* ---------- filtro ---------- */
  const filteredUsers = useMemo(() => {
    const txt = searchText.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(txt));
  }, [searchText, users]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-yellow-400">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">SeridoBus</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* corpo */}
      <View className="p-4">
        <TextInput
          placeholder="Pesquisar por nome..."
          value={searchText}
          onChangeText={setSearchText}
          className="border border-black rounded-lg p-2 mb-4"
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View className="flex-row border-b border-black bg-yellow-200 p-2">
              {['#', 'Nome', 'Situação', 'Adm', 'Ações'].map((h, idx) => (
                <Text
                  key={h}
                  className={`${
                    idx === 0 ? 'w-[8%]' : idx === 3 ? 'w-[12%]' : idx === 4 ? 'w-[20%]' : 'w-[30%]'
                  } font-bold text-center`}
                >
                  {h}
                </Text>
              ))}
            </View>
          )}
          renderItem={({ item, index }) => (
            <View className="flex-row border-b border-black p-2 bg-yellow-50 items-center">
              <Text className="w-[8%] text-center">{index + 1}</Text>
              <Text className="w-[30%] text-center">{item.name}</Text>
              <Text className="w-[30%] text-center">{item.situation}</Text>

              {/* checkbox de admin */}
              <View className="w-[12%] items-center">
                {isCurrentAdmin ? (
                  <TouchableOpacity onPress={() => toggleAdminInline(item)}>
                    <Ionicons
                      name={item.adm_company ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={item.adm_company ? '#16a34a' : 'black'}
                    />
                  </TouchableOpacity>
                ) : (
                  <Ionicons
                    name={item.adm_company ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={item.adm_company ? '#16a34a' : 'grey'}
                  />
                )}
              </View>

              <View className="w-[20%] flex-row justify-center space-x-2">
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Ionicons name="create" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* modal edição */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-6">
          <View className="bg-white rounded-xl p-6">
            <Text className="text-xl font-bold mb-4">Editar Usuário</Text>

            <TextInput
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              className="border border-black rounded-lg p-2 mb-2"
            />
            <TextInput
              placeholder="Celular (opcional)"
              value={cellphone}
              onChangeText={setCellphone}
              keyboardType="phone-pad"
              className="border border-black rounded-lg p-2 mb-4"
            />

            <Text className="font-bold mb-1">Situação</Text>
            <View className="border border-black rounded-lg mb-4 overflow-hidden">
              <Picker
                selectedValue={situation}
                onValueChange={(v) => setSituation(v as SituationEnum)}
                dropdownIconColor="black"
              >
                {Object.values(SituationEnum).map((s) => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>

            {/* toggle adm */}
            {isCurrentAdmin && (
              <TouchableOpacity
                className="flex-row items-center mb-4"
                onPress={() => setIsAdminToggle(!isAdminToggle)}
              >
                <Ionicons
                  name={isAdminToggle ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={isAdminToggle ? '#16a34a' : 'black'}
                />
                <Text className="ml-2">Administrador</Text>
              </TouchableOpacity>
            )}

            <View className="flex-row justify-between">
              <Pressable
                onPress={() => setEditModalVisible(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleUpdateUser}
                className="bg-yellow-400 px-4 py-2 rounded-lg"
              >
                <Text className="font-bold">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
