import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Contato } from './model/Contato';

export default function App() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contatos, setContatos] = useState(new Array<Contato>());

  const addContato = () => {
    contatos.push(new Contato(nome, email, phone));
    setNome("");
    setEmail("");
    setPhone("");
  }

  const delContato = (email: string) => {
    setContatos(contatos.filter(c => c.email !== email));
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Easy Agenda</Text>
      <View style={styles.form}>
        <Text>Nome</Text>
        <TextInput placeholder="Digite o nome" value={nome} onChangeText={setNome}></TextInput>
        <Text>Email</Text>
        <TextInput placeholder="Digite o email" value={email} onChangeText={setEmail}></TextInput>
        <Text>Fone</Text>
        <TextInput placeholder="Digite phone" value={phone} onChangeText={setPhone}></TextInput>
        <Button title="Salvar" onPress={addContato}></Button>
      </View>
      <ScrollView style={styles.list}>
        {contatos.map((c: Contato) => (
          <View key={c.email}>
            <Text>Nome: {c.name}</Text>
            <Text>Email: {c.email}</Text>
            <Text>Phone: {c.phone}</Text>
            <Button title="Excluir" onPress={() => delContato(c.email)} />
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View >
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
  form:{
    backgroundColor: '#ADD8E6',
    alignItems: "flex-start",
    justifyContent: "space-around",
    padding: 15,
  },
  list: {
    marginTop: 10,
    backgroundColor: "#90EE90",
    padding: 15,
  },
  titulo: {
    fontSize: 25,
    color: "blue",
    margin: 5,
  }
});
