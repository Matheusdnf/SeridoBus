import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { User } from './model/User';

export default function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const addUser = () => {
    const newUser = new User(name, email, cellphone);
    setUsers([...users, newUser]);
    setName("");
    setEmail("");
    setCellphone("");
  }

  const delUser = (email: string) => {
    setUsers(users.filter(u => u.email !== email));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Usuários do Sistema</Text>
      <View style={styles.form}>
        <Text>Nome</Text>
        <TextInput placeholder="Digite o nome" value={name} onChangeText={setName} />
        <Text>Email</Text>
        <TextInput placeholder="Digite o email" value={email} onChangeText={setEmail} />
        <Text>Telefone</Text>
        <TextInput placeholder="Digite o telefone" value={cellphone} onChangeText={setCellphone} />
        <Button title="Salvar" onPress={addUser} />
      </View>
      <ScrollView style={styles.list}>
        {users.map((u: User) => (
          <View key={u.email} style={styles.card}>
            <Text>Nome: {u.name}</Text>
            <Text>Email: {u.email}</Text>
            <Text>Telefone: {u.cellphone}</Text>
            <Button title="Excluir" onPress={() => delUser(u.email)} />
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#ADD8E6',
    alignItems: "flex-start",
    justifyContent: "space-around",
    padding: 15,
    width: "100%",
  },
  list: {
    marginTop: 10,
    backgroundColor: "#90EE90",
    padding: 15,
    width: "100%",
  },
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  titulo: {
    fontSize: 25,
    color: "blue",
    margin: 5,
  }
});
