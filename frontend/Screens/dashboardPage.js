import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
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
    console.log(data);
    console.log(rooms);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Salons disponibles</Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateForm")}
        >
          <Text style={styles.createText}>＋</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5B5FFF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {rooms.map((room) => (
            <View key={room.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.theme}>{room.theme}</Text>

                <Text style={styles.subject}>
                  {room.subject || "Aucun sujet"}
                </Text>

                <Text style={styles.users}>
                  👥 {room.max_users || 10} personnes max
                </Text>
              </View>

              <TouchableOpacity
                style={styles.joinButton}
                onPress={() =>
                  navigation.navigate("WaitingRoom", { roomId: room.id })
                }
              >
                <Text style={styles.joinText}>Rejoindre</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F14",
    padding: 20,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  createButton: {
    backgroundColor: "#5B5FFF",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  createText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1A1A22",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  theme: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  subject: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 6,
  },

  users: {
    color: "#6B7280",
    fontSize: 12,
  },

  joinButton: {
    backgroundColor: "#5B5FFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginLeft: 10,
  },

  joinText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
