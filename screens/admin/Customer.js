import { useState, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";

const Customers = ({ navigation }) => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("USERS")
            .where("role", "==", "customer") // Lọc chỉ lấy những người dùng có role là customer thì Admin mới quản lý thôi
            .onSnapshot(snapshot => {
                const customerList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCustomers(customerList);
            });

        return () => unsubscribe(); // Clean up on unmount
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.customerCard}
            onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
        >
            <Text style={styles.textBold}>Full Name: {item.fullName}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Address: {item.address}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>List of Customers</Text>
            <FlatList
                data={customers}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    customerCard: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
    },
    textBold: {
        fontWeight: "bold",
    },
});

export default Customers;
