import { useState, useEffect } from "react";
import { Alert, StyleSheet, Switch, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from "../context";

const UpdateProfile = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(true);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(userLogin ? userLogin.email : "");

  const checkEmail = () => {
    var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(email);
  };

  useEffect(() => {
    if (userLogin) {
      const userRef = firestore().collection("USERS").doc(userLogin.email);
      userRef.get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setFullName(data.fullName);
          setPhone(data.phone);
          setAddress(data.address);
          setGender(data.gender);
        }
      })
    }
  }, [userLogin]);

  const updateProfile = () => {
    if (!checkEmail()) {
      Alert.alert("Email không hợp lệ");
      return;
    }
    if (userLogin) {
      const userRef = firestore().collection("USERS").doc(userLogin.email);
      userRef.update({
        fullName,
        phone,
        address,
        gender
      })
      .then(() => {
        Alert.alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error updating profile, please try again.");
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <TextInput
        label="Full Name"
        value={fullName}
        placeholder="Enter Full Name"
        mode="outlined"
        style={styles.textInput}
        onChangeText={setFullName}
      />

      <TextInput
        label="Phone"
        value={phone}
        placeholder="Enter Phone Number"
        mode="outlined"
        style={styles.textInput}
        onChangeText={setPhone}
      />

      <TextInput
        label="Address"
        value={address}
        placeholder="Enter Address"
        mode="outlined"
        style={styles.textInput}
        onChangeText={setAddress}
      />

      <View style={styles.gender}>
        <Text> Female : Male </Text>
        <Switch value={gender} onValueChange={setGender}/>
      </View>

      <Button mode="contained" style={styles.button} onPress={updateProfile}>
        Update Profile
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
  textInput: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  gender:{
    flexDirection:'row',
    alignItems:'center',
    margin:10
},
});

export default UpdateProfile;
