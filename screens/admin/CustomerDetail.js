import { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const CustomerDetail = ({ route, navigation }) => {
    const { customerId } = route.params; // Nhận customerId từ params
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState(true); // true cho Male, false cho Female

    useEffect(() => {
        const customerRef = firestore().collection("USERS").doc(customerId);
        const unsubscribe = customerRef.onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                setFullName(data.fullName);
                setEmail(data.email);
                setPhone(data.phone);
                setAddress(data.address);
                setGender(data.gender);
            }
        });

        return () => unsubscribe(); // Clean up on unmount
    }, [customerId]);

    const handleUpdate = () => {
        const customerRef = firestore().collection("USERS").doc(customerId);
        customerRef
            .update({
                fullName,
                email,
                phone,
                address,
                gender,
            })
            .then(() => {
                Alert.alert("Success", "Customer information updated!");
                navigation.goBack(); // Quay lại danh sách khách hàng
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Update Customer</Text>

            <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                editable={false} // Không cho phép chỉnh sửa email
            />
            <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <Text style={styles.label}>Gender:</Text>
            <Button
                mode={gender ? "contained" : "outlined"}
                onPress={() => setGender(true)}
                style={styles.genderButton}
            >
                Male
            </Button>
            <Button
                mode={!gender ? "contained" : "outlined"}
                onPress={() => setGender(false)}
                style={styles.genderButton}
            >
                Female
            </Button>

            <Button mode="contained" onPress={handleUpdate} style={styles.updateButton}>
                Update Customer
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    genderButton: {
        marginRight: 10,
        marginBottom: 10,
    },
    updateButton: {
        marginTop: 20,
    },
});

export default CustomerDetail;
