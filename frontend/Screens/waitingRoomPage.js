import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export function WaitingRoomScreen( {navigation} ) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon créé !</Text>
      <Text>En attente que les utilisateurs rejoignent…</Text>

      <View style={{ height: 25 }} />

      <Button title="Commencer sans attendre ?" onPress={() => {}} />

      <Button title="Annuler" onPress={() => navigation.replace('CreateForm')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 10 },
});
