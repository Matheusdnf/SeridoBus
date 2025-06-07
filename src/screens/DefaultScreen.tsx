import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

export default function DefaultScreen({ navigation }: { navigation: any }) {
  const dados = [
    { id: 1, nome: "exemplo", inst: "UFRN", requer: "Ida", situacao: "Cadastrado", data: "00/00/0000 - 00:00" },
    { id: 2, nome: "exemplo", inst: "UFRN", requer: "Ida", situacao: "Cadastrado", data: "00/00/0000 - 00:00" },
    { id: 3, nome: "exemplo", inst: "UFRN", requer: "Ida", situacao: "Cadastrado", data: "00/00/0000 - 00:00" },
  ];

  const avisoDoDia = "⚠️ Lembre-se: o ônibus sairá às 7h em ponto amanhã.";

  return (
    <View className="flex-1 p-6 bg-gray-100">
      {/* Título */}
      <Text className="text-3xl font-bold mb-4 text-center">Lista de Passageiros</Text>

      {/* Aviso do dia (centralizado e estilizado) */}
      <View className="items-center mb-6">
        <View className="bg-gray-200 px-4 py-3 rounded-lg w-full max-w-xl">
          <Text className="text-center font-bold text-gray-800 mb-1">Aviso do Dia</Text>
          <Text className="text-center text-gray-700">{avisoDoDia}</Text>
        </View>
      </View>

      {/* Botão de adicionar */}
      <View className="flex-row justify-end mb-4">
        <Pressable
          onPress={() => navigation.navigate("Home")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-semibold">Adicionar Nome</Text>
        </Pressable>
      </View>

      {/* Tabela/Listagem */}
      <ScrollView className="border border-gray-300 rounded bg-white">
        {/* Cabeçalho */}
        <View className="flex-row border-b border-gray-300 bg-gray-200 p-2">
          <Text className="w-[10%] font-bold text-center">ID</Text>
          <Text className="w-[25%] font-bold text-center">Nome</Text>
          <Text className="w-[15%] font-bold text-center">Insti.</Text>
          <Text className="w-[15%] font-bold text-center">Requer</Text>
          <Text className="w-[20%] font-bold text-center">Situação</Text>
          <Text className="w-[15%] font-bold text-center">D/H</Text>
        </View>

        {/* Itens */}
        {dados.map((item) => (
          <View key={item.id} className="flex-row border-b border-gray-200 p-2">
            <Text className="w-[10%] text-center">{item.id}</Text>
            <Text className="w-[25%] text-center">{item.nome}</Text>
            <Text className="w-[15%] text-center">{item.inst}</Text>
            <Text className="w-[15%] text-center">{item.requer}</Text>
            <Text className="w-[20%] text-center">{item.situacao}</Text>
            <Text className="w-[15%] text-center">{item.data}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
