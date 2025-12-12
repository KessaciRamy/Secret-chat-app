import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { fetchDiscussions } from "../api/discussions";

export function DashboardScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRooms();
  },[]);

  async function loadRooms() {
    setLoading(true);
    const data =  await fetchDiscussions();
    setRooms(data);
    console.log(rooms)
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Salons disponibles</Text>

        <Button
          title="Créer un salon"
          onPress={() => navigation.navigate("CreateForm")}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ width: "100%", marginTop: 20 }}>
          {rooms.map((room) => (
            <View key={room.id} style={styles.room}>
              <View>
                <Text style={{ fontWeight: "bold" }}>{room.theme}</Text>
                <Text style={{ color: "#555" }}>
                  {room.subject || "Aucun sujet"}
                </Text>
                <Text style={{ color: "#555" }}>
                  {room.max_users || "10"}
                </Text>
              </View>

              <Button
                title="Rejoindre"
                onPress={() => navigation.navigate("ChatRoom", { roomId: room.id })}
              />
            </View>
          ))}
        </ScrollView>
      )}
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
