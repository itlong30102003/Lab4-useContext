import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useMyContextController } from "../context";

const ChangePassword = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  const handleSendResetEmail = () => {
    if (userLogin && userLogin.email) {
      auth()
        .sendPasswordResetEmail(userLogin.email)
        .then(() => {
          Alert.alert("Password reset email sent! Please check your inbox.");
        })
        .catch(error => {
          console.log(error);
          Alert.alert("Failed to send password reset email. Please try again.");
        });
    } else {
      Alert.alert("No user is logged in.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.info}>A password reset link will be sent to your email.</Text>
      
      <Button 
        mode="contained" 
        style={styles.button} 
        onPress={handleSendResetEmail}
      >
        Send Reset Email
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
  },
  title: {
    color: "blue",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  info: {
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ChangePassword;
