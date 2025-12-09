import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export function FormScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un salon de discussion</Text>

      <TextInput placeholder="Thème de la discussion" style={styles.input} />
      <TextInput placeholder="Sujet" style={styles.input} />
      <TextInput
        placeholder="Limite de personnes"
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        title="Créer"
        onPress={() => navigation.replace("WaitingRoom")}
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
