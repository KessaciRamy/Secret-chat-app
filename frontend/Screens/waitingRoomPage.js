import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { socket } from "../utils/socket";

export function WaitingRoomScreen( {navigation, route} ) {
  const { roomId } = route.params;

  useEffect(() => {
    socket.emit('join_room', { roomId }, (res) => {
      if(res?.error){
        alert(res.error);
        navigation.replace('Dashboard');
        return;
      };
      navigation.replace('Chat', {
        roomId,
        tempId: res.tempId,
        users: res.users,
        messages: res.messages,
        isAdmin:res.users.find(u => u.tempId === res.tempId)?.isAdmin
      });
    });
  }, [roomId]);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5B5FFF" />
      <Text style={styles.title}>Connexion au salon...</Text>
      <Text style={styles.subtitle}>Veuillez patienter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F14",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    maxWidth: 260,
  },
});
