import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";

export function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Salons disponibles</Text>

        <Button
          title="Créer un salon"
          onPress={() => navigation.navigate("CreateForm")}
        />
      </View>

      <ScrollView style={{ width: "100%", marginTop: 20 }}>
        {/* Exemple de salons */}
        <View style={styles.room}>
          <Text>Discussion : Programmation</Text>
          <Button title="Rejoindre" onPress={() => {}} />
        </View>

        <View style={styles.room}>
          <Text>Discussion : Sport</Text>
          <Button title="Rejoindre" onPress={() => {}} />
        </View>

        <View style={styles.room}>
          <Text>Discussion : Jeux vidéo</Text>
          <Button title="Rejoindre" onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  room: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
