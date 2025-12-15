import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native";

export function HomeScreen( {navigation} ){
    // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
    return(
        <View style={styles.container}>
          <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          >
          <Image
            source={require("../assets/Secret_Chat_Remli11.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
          </Animated.View>

      <Text style={styles.title}>Bienvenue dans SecretChat</Text>
          <Text style={styles.subtitle}>
        Discussions anonymes et respect de la vie privée
          </Text>
      <Text style={styles.subtitle}>Que souhaitez-vous faire ?</Text>
          <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("CreateForm")}
      >
        <Text style={styles.primaryText}>Commencer votre propre discussion</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.secondaryText}>Rejoindre une discussion déjà créée</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262022",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40, 
  },

  logoContainer: {
    marginBottom: 25,
  },

  logo: {
    width: 300,
    height: 300,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    
    
  },

  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 45,
    maxWidth: 260,
    lineHeight: 20,
  },

  primaryButton: {
    backgroundColor: "#5B5FFF",
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 15,
    width: "85%",
    alignItems: "center",
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#5B5FFF",
    paddingVertical: 14,
    borderRadius: 30,
    width: "85%",
    alignItems: "center",
  },

  secondaryText: {
    color: "#5B5FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
