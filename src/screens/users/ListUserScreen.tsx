import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // IMPORT CORRETO DO PICKER
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../../components/SidebarComponent';

type ShiftEnum = 'Manhã' | 'Tarde' | 'Noite';
type SituacaoEnum = 'associado' | 'cadastrado' | 'carona';

type UserItem = {
  name: string;
  email: string;
  cellphone?: string;
  shift: ShiftEnum[];
  situacao: SituacaoEnum;
};

function CustomCheckbox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
      }}
    >
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          backgroundColor: value ? 'black' : 'white',
        }}
      >
        {value && <Ionicons name="checkmark" size={18} color="white" />}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ListUserScreen({ navigation }: { navigation: any }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([
    {
      name: 'João Silva',
      email: 'joao@email.com',
      shift: ['Manhã', 'Tarde'],
      situacao: 'associado',
    },
    {
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      shift: ['Noite'],
      situacao: 'cadastrado',
    },
  ]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [shift, setShift] = useState<ShiftEnum[]>([]);
  const [situacao, setSituacao] = useState<SituacaoEnum>('associado');
  const [searchText, setSearchText] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function toggleShift(shiftName: ShiftEnum) {
    if (shift.includes(shiftName)) {
      setShift(shift.filter((s) => s !== shiftName));
    } else {
      setShift([...shift, shiftName]);
    }
  }

  const handleAddUser = () => {
    if (!name.trim() || !email.trim()) return;
    if (shift.length === 0) {
      alert('Selecione pelo menos um turno');
      return;
    }

    const newUser: UserItem = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      cellphone: cellphone.trim() || undefined,
      shift,
      situacao,
    };
    setUsers((prev) => [...prev, newUser]);
    setName('');
    setEmail('');
    setCellphone('');
    setShift([]);
    setSituacao('associado');
  };

  const openEditModal = (index: number) => {
    const user = users[index];
    setName(user.name);
    setEmail(user.email);
    setCellphone(user.cellphone || '');
    setShift(user.shift);
    setSituacao(user.situacao);
    setEditIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateUser = () => {
    if (editIndex === null) return;
    if (shift.length === 0) {
      alert('Selecione pelo menos um turno');
      return;
    }

    const updatedUser: UserItem = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      cellphone: cellphone.trim() || undefined,
      shift,
      situacao,
    };
    const newUsers = [...users];
    newUsers[editIndex] = updatedUser;
    setUsers(newUsers);

    setEditModalVisible(false);
    setEditIndex(null);
    setName('');
    setEmail('');
    setCellphone('');
    setShift([]);
    setSituacao('associado');
  };

  const handleDelete = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditModalVisible(false);
      setEditIndex(null);
    }
  };

  // Filtra os usuários pelo nome conforme o texto da pesquisa (case insensitive)
  const filteredUsers = useMemo(() => {
    const text = searchText.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(text));
  }, [searchText, users]);

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
        <Text className="text-lg font-bold text-black">Cadastrar Usuário</Text>
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          className="border border-black rounded-lg p-2"
          placeholder="Celular (opcional)"
          value={cellphone}
          onChangeText={setCellphone}
          keyboardType="phone-pad"
        />

        <Text className="font-bold mt-2 mb-1">Turno (selecione um ou mais):</Text>
        {(['Manhã', 'Tarde', 'Noite'] as ShiftEnum[]).map((s) => (
          <CustomCheckbox
            key={s}
            label={s}
            value={shift.includes(s)}
            onChange={() => toggleShift(s)}
          />
        ))}

        <Text className="font-bold mt-2 mb-1">Situação:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 8,
            overflow: 'hidden',
            padding: 10
          }}
        >
          <Picker
            selectedValue={situacao}
            onValueChange={(itemValue) => setSituacao(itemValue as SituacaoEnum)}
            mode="dropdown"
          >
            <Picker.Item label="associado" value="associado" />
            <Picker.Item label="cadastrado" value="cadastrado" />
            <Picker.Item label="carona" value="carona" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={handleAddUser}
          className="bg-yellow-400 py-2 rounded-lg items-center mt-4"
        >
          <Text className="font-bold text-black">Adicionar usuário</Text>
        </TouchableOpacity>

        {/* Barra de Pesquisa */}
        <TextInput
          placeholder="Pesquisar por nome..."
          value={searchText}
          onChangeText={setSearchText}
          className="border border-black rounded-lg p-2 mt-6 mb-2"
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <View className="flex-row border-b border-black bg-yellow-200 p-2">
              <Text className="w-[10%] font-bold text-center">#</Text>
              <Text className="w-[30%] font-bold text-center">Nome</Text>
              <Text className="w-[40%] font-bold text-center">Instituição</Text>
              <Text className="w-[20%] font-bold text-center">Ações</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                paddingVertical: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FEF9C3', 
                alignItems: 'center',
              }}
            >
              <Text className="w-[10%] text-center">{index + 1}</Text>
              <Text className="w-[30%] text-center">{item.name}</Text>
              <Text className="w-[40%] text-center">{item.situacao}</Text>
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
          style={{ maxHeight: 300 }}
        />
      </View>

      {/* Modal de edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
              elevation: 5,
            }}
          >
            <Text className="text-xl font-bold mb-4">Editar Usuário</Text>

            <TextInput
              className="border border-black rounded-lg p-2 mb-2"
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              className="border border-black rounded-lg p-2 mb-2"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              className="border border-black rounded-lg p-2 mb-2"
              placeholder="Celular (opcional)"
              value={cellphone}
              onChangeText={setCellphone}
              keyboardType="phone-pad"
            />

            <Text className="font-bold mt-2 mb-1">Turno (selecione um ou mais):</Text>
            {(['Manhã', 'Tarde', 'Noite'] as ShiftEnum[]).map((s) => (
              <CustomCheckbox
                key={s}
                label={s}
                value={shift.includes(s)}
                onChange={() => toggleShift(s)}
              />
            ))}

            <Text className="font-bold mt-2 mb-1">Situação:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              <Picker
                selectedValue={situacao}
                onValueChange={(itemValue) => setSituacao(itemValue as SituacaoEnum)}
                mode="dropdown"
              >
                <Picker.Item label="associado" value="associado" />
                <Picker.Item label="cadastrado" value="cadastrado" />
                <Picker.Item label="carona" value="carona" />
              </Picker>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                style={{
                  backgroundColor: '#ccc',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleUpdateUser}
                style={{
                  backgroundColor: '#FACC15',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
