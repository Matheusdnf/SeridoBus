import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import Sidebar from '../components/SidebarComponent';
import CustomAlert from '../components/alert';

import UserService from '../services/services_user';
import DestinationService from '../services/services_Destination';
import PassengersListService from '../services/PassengersListService';
import PassengerEntryService from '../services/PassengerEntryService';
import PassengersListUsersService from '../services/PassengersListUsersService';

import { Destination } from '../models/Destination';
import { TripTypeEnum } from '../models/TripTypeEnum';
import { ShiftEnum } from '../models/ShiftEnum';
import { SituationEnum } from '../models/SituationEnum';
import { PassengerEntry } from '../models/PassengerEntry';
import { UserAsPassenger } from '../models/UserAsPassenger';

export default function SeridoBusApp({ navigation }: { navigation: any }) {
  /* ---------- estados básicos ---------- */
  const [currentUser, setCurrentUser] = useState<UserAsPassenger | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [destinos, setDestinos] = useState<Destination[]>([]);
  const [carregandoDest, setCarregando] = useState(true);

  const [viewList, setViewList] = useState<'ida' | 'volta' | 'add'>('ida');
  const [entriesIda, setEntriesIda] = useState<PassengerEntry[]>([]);
  const [entriesVolta, setEntriesVolta] = useState<PassengerEntry[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listaIda, setListaIda] = useState<number | null>(null);
  const [listaVolta, setListaVolta] = useState<number | null>(null);

  /* ---------- alerts ---------- */
  const [dupAlertVisible, setDupAlertVisible] = useState(false);
  const [delAlert, setDelAlert] = useState<{ visible: boolean; entry: PassengerEntry | null }>({
    visible: false,
    entry: null,
  });

  /* ---------- form ---------- */
  const [destId, setDestId] = useState<number | null>(null);
  const [acao, setAcao] = useState<'Ida' | 'Volta' | 'Ida e volta'>('Ida');
  const [name, setName] = useState('');
  const [sit, setSit] = useState<'associado' | 'cadastrado' | 'carona'>('carona');
  const [searchText, setSearchText] = useState('');

  const loggedIn = !!currentUser;
  const userName = loggedIn ? currentUser!.name : '';
  const userSituation = currentUser?.associate
    ? 'associado'
    : currentUser?.adm_company
    ? 'cadastrado'
    : 'carona';

  /* ---------- helpers ---------- */
  const listaAtiva = viewList === 'ida' ? entriesIda : entriesVolta;

  const filtrados = useMemo(() => {
    const pri: Record<SituationEnum | string, number> = { associado: 1, cadastrado: 2, carona: 3 };
    return listaAtiva
      .filter((e) => {
        const destNome = destinos.find((d) => d.id === e.destination_id)?.name ?? '';
        return (
          e.name.toLowerCase().includes(searchText.toLowerCase()) ||
          destNome.toLowerCase().includes(searchText.toLowerCase())
        );
      })
      .sort((a, b) => pri[a.situation] - pri[b.situation]);
  }, [listaAtiva, searchText, destinos]);

  const destinoNome = (id: number) => destinos.find((d) => d.id === id)?.name ?? '—';

  /* ---------- efeitos ---------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await UserService.getCurrentUser();
        setCurrentUser(profile);
      } catch (e) {
        console.error(e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setDestinos(await DestinationService.ListDestinations());
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const carregarListas = useCallback(async () => {
    setLoadingList(true);
    try {
      const hoje = new Date().toISOString().slice(0, 10);
      const turno = ShiftEnum.Tarde;

      let listaI =
        (await PassengersListService.getByDateTripShift(hoje, TripTypeEnum.Ida, turno)) ??
        (await PassengersListService.create({
          date: hoje,
          trip_type: TripTypeEnum.Ida,
          shift: turno,
          company_id: 1,
          bus_id: null,
        }));
      setListaIda(listaI.id);
      setEntriesIda(await PassengerEntryService.list(listaI.id));

      let listaV =
        (await PassengersListService.getByDateTripShift(hoje, TripTypeEnum.Volta, turno)) ??
        (await PassengersListService.create({
          date: hoje,
          trip_type: TripTypeEnum.Volta,
          shift: turno,
          company_id: 1,
          bus_id: null,
        }));
      setListaVolta(listaV.id);
      setEntriesVolta(await PassengerEntryService.list(listaV.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (destinos.length) carregarListas();
  }, [carregarListas, destinos]);

  /* ---------- salvar passageiro ---------- */
  const nameOrUser = () => (loggedIn ? userName : name.trim());

  const addToList = async (listId: number | null) => {
    if (!listId) return;

    const inserted = await PassengerEntryService.add({
      passengers_list_id: listId,
      name: nameOrUser(),
      situation: (loggedIn ? userSituation : sit) as SituationEnum,
      destination_id: destId!,
    });

    if (!inserted) {
      setDupAlertVisible(true);
      return;
    }

    if (loggedIn) {
      await PassengersListUsersService.add(currentUser.id, listId);
    }
  };

  const handleSalvar = async () => {
    if (!nameOrUser() || !destId) return;
    if (acao === 'Ida' || acao === 'Ida e volta') await addToList(listaIda);
    if (acao === 'Volta' || acao === 'Ida e volta') await addToList(listaVolta);
    await carregarListas();
    setName('');
    setDestId(null);
    setSit('carona');
    setAcao('Ida');
    setViewList('ida');
  };

  /* ---------- remover passageiro ---------- */
  const canDelete = (e: PassengerEntry) =>
    loggedIn && (currentUser?.adm_company || e.name === userName);

  const askRemove = (entry: PassengerEntry) => {
    setDelAlert({ visible: true, entry });
  };

  const confirmRemove = async () => {
    if (!delAlert.entry) return;
    try {
      await PassengerEntryService.remove(delAlert.entry.id);
      await carregarListas();
    } catch (e) {
      console.error(e);
    } finally {
      setDelAlert({ visible: false, entry: null });
    }
  };

  /* ---------- UI ---------- */
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isAdmin={currentUser?.adm_company}
      />

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

      <View className="p-4">
        {/* resumo */}
        {viewList !== 'add' && (
          <View className="mb-2 px-3 py-2 border border-black rounded-xl bg-yellow-100">
            <Text className="font-bold">Resumo:</Text>
            <Text>Total: {filtrados.length}</Text>
            {Object.entries(
              filtrados.reduce((acc: Record<string, number>, x) => {
                const nm = destinoNome(x.destination_id);
                acc[nm] = (acc[nm] || 0) + 1;
                return acc;
              }, {})
            ).map(([d, c]) => (
              <Text key={d}>
                {d}: {c}
              </Text>
            ))}
          </View>
        )}

        {/* tabs */}
        <View className="flex-row gap-3 mb-4">
          {(['add', 'ida', 'volta'] as const).map((k) => (
            <TouchableOpacity
              key={k}
              onPress={() => setViewList(k)}
              className={`px-3 py-2 rounded-xl bg-yellow-400 ${
                viewList === k ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <Text className="font-bold text-black">
                {k === 'add' ? 'Adicionar nome' : k === 'ida' ? 'Lista Ida' : 'Lista Volta'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* search */}
        {viewList !== 'add' && (
          <TextInput
            placeholder="Pesquisar"
            value={searchText}
            onChangeText={setSearchText}
            className="border border-black p-2 rounded-md mb-4"
            style={{ height: 40, paddingLeft: 10 }}
          />
        )}

        {/* ADD FORM */}
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

            <Picker
              selectedValue={destId ?? ''}
              onValueChange={(v) => setDestId(v === '' ? null : Number(v))}
              style={{ height: 50 }}
              dropdownIconColor="black"
              className="border border-black rounded-md bg-white px-3"
            >
              {carregandoDest ? (
                <Picker.Item label="Carregando destinos..." value="" />
              ) : (
                <>
                  <Picker.Item label="Selecione o destino" value="" enabled={false} />
                  {destinos.map((d) => (
                    <Picker.Item key={d.id} label={d.name} value={d.id} />
                  ))}
                </>
              )}
            </Picker>

            <View className="flex-row justify-between">
              {(['Ida', 'Volta', 'Ida e volta'] as const).map((op) => (
                <TouchableOpacity
                  key={op}
                  onPress={() => setAcao(op)}
                  className={`flex-1 py-2 mx-1 rounded ${
                    acao === op ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <Text className="text-center font-bold">{op}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSalvar}
              className="bg-yellow-400 p-3 rounded-xl items-center"
            >
              <Text className="font-bold text-black">Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : loadingList ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={(e) => String(e.id)}
            ListHeaderComponent={() => (
              <View className="flex-row border-b border-black bg-yellow-200 p-2">
                {['#', 'Nome', 'Destino', 'Situação', ''].map((h, i) => (
                  <Text
                    key={h}
                    className={`${
                      i === 0 ? 'w-[10%]' : i === 4 ? 'w-[10%]' : 'w-[25%]'
                    } font-bold text-center`}
                  >
                    {h}
                  </Text>
                ))}
              </View>
            )}
            renderItem={({ item, index }) => (
              <View className="flex-row border-b border-black p-2 bg-yellow-50 items-center">
                <Text className="w-[10%] text-center">{index + 1}</Text>
                <Text className="w-[25%] text-center">{item.name}</Text>
                <Text className="w-[25%] text-center">{destinoNome(item.destination_id)}</Text>
                <Text className="w-[25%] text-center capitalize">{item.situation}</Text>

                {canDelete(item) && (
                  <TouchableOpacity className="w-[10%]" onPress={() => askRemove(item)}>
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={<Text className="text-center text-gray-500">Nada na lista</Text>}
          />
        )}
      </View>

      {/* alert de nome duplicado */}
      <CustomAlert
        visible={dupAlertVisible}
        title="Impossível adicionar nome"
        message="Nome já adicionado a uma das listas."
        onClose={() => setDupAlertVisible(false)}
        onConfirm={() => setDupAlertVisible(false)}
      />

      {/* alert de confirmar delete */}
      <CustomAlert
        visible={delAlert.visible}
        title="Remover passageiro"
        message={`Remover "${delAlert.entry?.name}" da lista?`}
        onClose={() => setDelAlert({ visible: false, entry: null })}
        onConfirm={confirmRemove}
        showCancel
      />
    </SafeAreaView>
  );
}
