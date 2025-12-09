import React from 'react';
import { View, Text, Button, StyleSheet } from "react-native";

export function HomeScreen( {navigation} ){
    return(
        <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans SecretChat</Text>

      <Text style={styles.text}>Que souhaitez-vous faire ?</Text>

      <Button
        title="Commencer votre propre discussion"
        onPress={() => navigation.navigate("CreateForm")}
      />

      <View style={{ height: 20 }} />

      <Button
        title="Rejoindre une discussion déjà créée"
        onPress={() => navigation.navigate("Dashboard")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
});
