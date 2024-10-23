import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../context";
import { Avatar, IconButton } from "react-native-paper";
import ServiceCustomer from "../../screens/customer/ServiceCustomer";
import AddNewAppointment from "../../screens/customer/AddNewAppointment";
import AppointmentDetail from "../../screens/customer/AppointmentDetail";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator()

const RouterServiceCustomer =({navigation})=>{
    const [controller, dispatch] = useMyContextController();
    const {userLogin} = controller;
    console.log(userLogin);
    return(
        <Stack.Navigator
            initialRouteName="ServiceCustomer"
            screenOptions={{
                title: userLogin.fullName!=null&& userLogin.fullName,
                headerLeft:() => null,
                headerRight: (props) => <TouchableOpacity
                                            onPress={() => navigation.navigate("Profile")}
                                            style={{
                                                margin: 10,
                                            }}
                                        >
                                            <Avatar.Icon
                                                icon={"account"}
                                                size={40}
                                                style={{
                                                    backgroundColor: "white",
                                                    color: "black",
                                                }}
                                            />
                                        </TouchableOpacity>,
                headerStyle:{
                    backgroundColor:"pink",
                },
                headerTitleAlign:"center"
            }}
        >
            <Stack.Screen name="ServiceCustomer" component={ServiceCustomer}/>
            <Stack.Screen name="AddNewAppointment" component={AddNewAppointment}/>
            <Stack.Screen name="AppointmentDetail" component={AppointmentDetail}/>
            
        </Stack.Navigator>
    )
}
export default RouterServiceCustomer;