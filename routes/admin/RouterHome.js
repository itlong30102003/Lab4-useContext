import { createStackNavigator } from "@react-navigation/stack";
import Service from "../../screens/admin/Service";
import AddService from "../../screens/admin/AddService";
import ServiceDetail from "../../screens/admin/ServiceDetail";
import { useMyContextController } from "../../context";
import { Avatar, IconButton } from "react-native-paper";
import AddNewService from "../../screens/admin/AddService";

const Stack = createStackNavigator()

const RouterHome =({navigation})=>{
    const [controller, dispatch] = useMyContextController();
    const {userLogin} = controller;
    console.log(   userLogin);
    return(
        <Stack.Navigator
            initialRouteName="Service"
            screenOptions={{
                title: userLogin.fullName!=null&& userLogin.fullName,
                headerLeft:() => null,
                headerRight:(props) => <Avatar.Icon icon={"account"} 
                                                onPress={()=> navigation.Navigate("setting")} size={40}
                                            style={{ 
                                                backgroundColor:"white",
                                                color:"black",
                                                margin:10,
                                                
                                            }}
                                        />,
                headerStyle:{
                    backgroundColor:"pink",
                },
                headerTitleAlign:"center"
            }}
        >
            <Stack.Screen name="Service" component={Service}/>
            <Stack.Screen name="AddService" component={AddNewService}/>
            <Stack.Screen name="ServiceDetail" component={ServiceDetail}/>
        </Stack.Navigator>
    )
}
export default RouterHome;