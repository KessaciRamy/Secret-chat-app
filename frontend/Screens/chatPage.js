import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import * as ScreenCapture from "expo-screen-capture";
import { API_URL } from '../config';
import { socket } from '../utils/socket';

export function ChatScreen({navigation, route}){
    const { roomId, tempId, users, messages, isAdmin } = route.params;

    const [message, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
    // Prevent screenshots & screen recording
    ScreenCapture.preventScreenCaptureAsync();

    //  Detect capture attempts (mostly iOS)
    const sub = ScreenCapture.addScreenshotListener(() => {
      Alert.alert(
        "Capture détectée",
        "Les captures d’écran sont interdites dans cette discussion."
      );
    });

    return () => {
      // Allow screenshots again when leaving
      ScreenCapture.allowScreenCaptureAsync();
      sub.remove();
    };
  }, []);

    useEffect(() => {
        socket.on('new_message', (msg) => {
            setMessages(prev => [...prev, { ...msg, type: 'user'}]);
        });

        socket.on('system_message', (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: 'system'}]);
        });

        socket.on('user_left', (msg) => {
            console.log('[USER LEFT EVENT]', msg);
            setMessages(prev => [...prev, {...msg, type: 'system'}]);
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
        <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Discussion anonyme</Text>
            <TouchableOpacity onPress={leaveDiscussion}>
              <Text style={styles.leave}>Quitter</Text>
            </TouchableOpacity>
          </View>

          {!started && isAdmin && (
            <TouchableOpacity style={styles.startButton} onPress={startDiscussion}>
              <Text style={styles.startText}>Démarrer la discussion</Text>
            </TouchableOpacity>
          )}

          {/* Messages */}
          <Text style={styles.system}>
            l'application protege votre vie privée mais ne protege pas vos bouches de dire des betises
          </Text>
          <Text style={styles.system}>
            Ne revelez rien de secret comme vos informations personnelles
          </Text>
          <FlatList
            data={message}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) =>
              item.type === "system" ? (
                <Text style={styles.system}>{item.text}</Text>
              ) : (
                <View style={styles.messageBubble}>
                  <Text style={styles.pseudo}>{item.pseudo}</Text>
                  <Text style={styles.msgText}>{item.text}</Text>
                </View>
              )
            }
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              editable={started}
              placeholder={
                started
                  ? "Écrire un message..."
                  : "En attente que l’admin démarre"
              }
              placeholderTextColor="#6B7280"
              value={text}
              onChangeText={setText}
              style={[styles.input, !started && styles.disabled]}
            />

            <TouchableOpacity
              style={[styles.sendButton, !started && styles.disabledBtn]}
              onPress={sendMessage}
              disabled={!started}
            >
              <Text style={styles.sendText}>Envoyer</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F14",
    paddingTop: 45,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#1F2937",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  leave: {
    color: "#EF4444",
    fontSize: 14,
  },

  startButton: {
    backgroundColor: "#5B5FFF",
    margin: 15,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },

  startText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  messageBubble: {
    backgroundColor: "#1A1A22",
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 12,
    borderRadius: 14,
  },

  pseudo: {
    color: "#5B5FFF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  msgText: {
    color: "#E5E7EB",
    fontSize: 15,
  },

  system: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginVertical: 8,
    fontStyle: "italic",
  },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#1F2937",
    backgroundColor: "#0F0F14",
  },

  input: {
    flex: 1,
    backgroundColor: "#1A1A22",
    color: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 42,
  },

  sendButton: {
    backgroundColor: "#5B5FFF",
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: "center",
  },

  sendText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  disabled: {
    backgroundColor: "#111827",
  },

  disabledBtn: {
    opacity: 0.5,
  },
});
