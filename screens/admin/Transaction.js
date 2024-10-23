import { useState, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("APPOINTMENTS")
            .onSnapshot(async (snapshot) => {
                const transactionList = [];

                // Lặp qua các giao dịch và lấy tên dịch vụ
                for (const doc of snapshot.docs) {
                    const appointmentData = doc.data();
                    const serviceDoc = await firestore()
                        .collection("SERVICES")
                        .doc(appointmentData.serviceID)
                        .get();

                    if (serviceDoc.exists) {
                        transactionList.push({
                            id: doc.id,
                            ...appointmentData,
                            serviceName: serviceDoc.data().serviceName, // Thêm tên dịch vụ
                        });
                    }
                }

                setTransactions(transactionList);
            });

        return () => unsubscribe(); // Clean up on unmount
    }, []);

    const handleAccept = async (transactionId) => {
        // Cập nhật trạng thái thành "Accepted"
        await firestore().collection("APPOINTMENTS").doc(transactionId).update({
            state: "Accepted"
        });
    };

    const handleDelete = (transactionId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => {
                    await firestore().collection("APPOINTMENTS").doc(transactionId).delete();
                }},
            ]
        );
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.transactionCard}>
                <Text style={styles.textBold}>Service Name: {item.serviceName}</Text>
                <Text>Date and Time: {new Date(item.datetime.seconds * 1000).toLocaleString()}</Text>
                <Text>Status: {item.state}</Text>
                <Text>Customer: {item.customerID}</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleAccept(item.id)}
                    >
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>List of Transactions</Text>

            {/* FlatList hiển thị các giao dịch */}
            <FlatList
                data={transactions}
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
    transactionCard: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
    },
    textBold: {
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        width: "45%",
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "red",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Transactions;