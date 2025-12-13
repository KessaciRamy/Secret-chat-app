import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Connexion au salon...</Text>
    </View>
  );
}

