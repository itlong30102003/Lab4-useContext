import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Setting = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Setting Screen</Text>
            
            <Button 
                mode="contained" 
                style={styles.button}
                onPress={() => navigation.navigate('UpdateProfile')}
            >
                Update Profile
            </Button>
            <Button 
                mode="contained" 
                style={styles.button}
                onPress={() => navigation.navigate('ChangePassword')}
            >
                Change Password
            </Button>
        </View>
    );
}

export default Setting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        width: '80%',
        marginVertical: 10,
    },
});
