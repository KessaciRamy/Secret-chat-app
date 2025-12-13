import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { API_URL } from '../config';
import { socket } from '../utils/socket';

export function ChatScreen({navigation, route}){
    const { roomId, tempId, users, messages, isAdmin } = route.params;

    const [message, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        socket.on('new_message', (msg) => {
            setMessages(prev => [...prev, { ...msg, type: 'user'}]);
        });

        socket.on('system_message', (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: 'system'}]);
        });

        socket.on('discussion_started', () => {
            setStarted(true);
        });

        socket.on('room_closed', ()=> {
            Alert.alert("Salon de discussion fermé");
            navigation.replace('Dashboard');
        });

        return () => {
            //en temps normal chaque event tu lui fais un off mais since im using it in just this screen pas la peine
            //si utilise un autre off dans un autre screen fait
            /*  socket.off('new_message');
                socket.off('system_message');
                socket.off('discussion_started');
                socket.off('room_closed');
            */
            socket.off();
        };
    }, []);


    function sendMessage() {
        if(!text.trim()) return;
        socket.emit('send_message', { text });
        setText('');
    }

    function startDiscussion() {
        socket.emit('start_discussion');
    }

    async function leaveDiscussion() {
        if (isAdmin) {
            await fetch(`${API_URL}/api/discussions/${roomId}/close`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ tempId }), 
            });
        }
        navigation.replace('Dashboard')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title='Quitter' onPress={leaveDiscussion} />
                <Text style={styles.title}>Discussion</Text>
            </View>

            {! started && isAdmin && (
                <Button title='Demarrer la disucussion'
                onPress={startDiscussion}/>
            )}

            <FlatList
            data={message}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => 
                item.type === "system" ? (
                    <Text style={styles.system}>{item.text}</Text>
                ) : (
                <View style={styles.message}>
                    <Text style={styles.pseudo}>{item.pseudo}</Text>
                    <Text style={styles.msgText}>{item.text}</Text>
                </View>
                )
            }
            />
            <View style={styles.inputRow}>
                <TextInput
                editable= {started}
                placeholder={
                    started 
                    ? "Votre message..."
                    : "En attente que l'admin demarre"
                }
                value={text}
                onChangeText={setText}
                style={[styles.input, !started && styles.disabled]}
                />
            <Button title="Envoyer" onPress={sendMessage} disabled={!started}/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  message: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  msgText: { fontSize: 16 },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  waiting: {
    padding: 15,
    textAlign: "center",
    color: "#666",
  },
  system: {
  textAlign: "center",
  color: "#777",
  marginVertical: 6,
  fontStyle: "italic",
},
disabled: {
  backgroundColor: "#eee",
},
pseudo: {
    fontWeight: "bold",
    marginBottom: 2,
},
});
