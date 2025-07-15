import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Sidebar from './SidebarComponent';
import { UserContext } from '../contexts/UserContext';

type Props = {
  title: string;
  navigation: any;
  children: React.ReactNode;
};

export default function AppLayout({ title, navigation, children }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { currentUser, loading } = useContext(UserContext);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} currUser={currentUser} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-yellow-400">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo da página */}
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
