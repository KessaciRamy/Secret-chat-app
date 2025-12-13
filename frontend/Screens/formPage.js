import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { API_URL } from "../config";
export function FormScreen({ navigation }) {

  const [theme, setTheme] = useState('');
  const [subject, setSubject] = useState('');
  const [maxUsers, setMaxUsers] = useState('');

  async function handleCreate() {
    try{
        const res = await fetch(`${API_URL}/api/discussions`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify({ theme, subject, max_users: parseInt(maxUsers) || 10})
        });
        const data = await res.json();
        if(!res.ok) {
          Alert.alert("Erreur", data.error || "Erreur serveur");
          return;
        }
        console.log('salon created');
        navigation.replace("WaitingRoom", {roomId: data.roomId});
    } catch(err){
        console.error(err);
        Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un salon de discussion</Text>

      <TextInput 
      placeholder="Thème de la discussion" 
      style={styles.input}
      value={theme}
      onChangeText={setTheme} />

      <TextInput 
      placeholder="Sujet" 
      style={styles.input} 
      value={subject}
      onChangeText={setSubject}/>

      <TextInput
        placeholder="Limite de personnes"
        keyboardType="numeric"
        style={styles.input}
        value={maxUsers}
        onChangeText={setMaxUsers}
      />

      <Button
        title="Créer"
        onPress={handleCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
});
