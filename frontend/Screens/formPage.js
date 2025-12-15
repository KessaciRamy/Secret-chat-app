import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { API_URL } from "../config";
export function FormScreen({ navigation }) {

  const [theme, setTheme] = useState('');
  const [subject, setSubject] = useState('');
  const [maxUsers, setMaxUsers] = useState('');
  const [submit, setSubmit] = useState(false);

  async function handleCreate() {
    try{
        setSubmit(true);
        const res = await fetch(`${API_URL}/api/discussions`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify({ theme, subject, max_users: parseInt(maxUsers) || 10})
        });
        const data = await res.json();
        if(!res.ok) {
          Alert.alert("Erreur", data.error || "Erreur serveur");
          setSubmit(false);
          return;
        }
        console.log('salon created');
        setSubmit(false)
        navigation.replace("WaitingRoom", {roomId: data.roomId});
    } catch(err){
        setSubmit(false);
        console.error(err);
        Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>

        <Text style={styles.title}>Créer un salon</Text>
        <Text style={styles.subtitle}>
          Les discussions sont anonymes et temporaires
        </Text>

        <View style={styles.card}>

          <TextInput
            placeholder="Thème de la discussion"
            placeholderTextColor="#6B7280"
            style={styles.input}
            value={theme}
            onChangeText={setTheme}
          />

          <TextInput
            placeholder="Sujet (optionnel)"
            placeholderTextColor="#6B7280"
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
          />

          <TextInput
            placeholder="Nombre maximum de participants"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            style={styles.input}
            value={maxUsers}
            onChangeText={setMaxUsers}
          />

          <TouchableOpacity
            style={[styles.button, submit && styles.disabledBtn]}
            onPress={handleCreate}
            disabled={submit}
          >
            <Text style={styles.buttonText}>
              {submit ? "Création..." : "Créer le salon"}
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F14",
    padding: 20,
    paddingTop: 70,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#1A1A22",
    borderRadius: 18,
    padding: 20,
  },

  input: {
    backgroundColor: "#0F0F14",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#5B5FFF",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  disabledBtn: {
    opacity: 0.6,
  },
});
