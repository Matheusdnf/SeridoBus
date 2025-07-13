import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define seu tipo de rotas da stack aqui:
type RootStackParamList = {
  Login: undefined;
  List: undefined;
  ListBus: undefined;
  ListDestination: undefined;
  ListUsers: undefined;
  UserProfile: undefined
  ListCompany: undefined
};

type NavigationProps = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.menuItems}>
            <Text style={styles.item} onPress={() => navigation.replace('List')}>Lista</Text>
            <Text style={styles.item} onPress={() => navigation.replace('ListBus')}>Ônibus</Text>
            <Text style={styles.item} onPress={() => navigation.replace('ListDestination')}>Destinos</Text>
            <Text style={styles.item} onPress={() => navigation.replace('ListUsers')}>Usuários</Text>
            <Text style={styles.item} onPress={() => navigation.replace('UserProfile')}>Perfil de usuário</Text>
            {/* <Text style={styles.item} onPress={() => navigation.replace('ListCompany')}>Companhias</Text> */}
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.replace('Login')}
          >
            <Ionicons name="exit-outline" size={20} color="black" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItems: {
    gap: 20,
  },
  item: {
    fontSize: 18,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  logoutContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcd34d',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 8,
  },
});

export default Sidebar;
