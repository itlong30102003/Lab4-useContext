import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import TabAdmin from "./TabAdmin";
import TabCustomer from "./TabCustomer";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import UpdateProfile from "../screens/UpdateProfile";
import ChangePassword from "../screens/ChangePassword";
import CustomerDetail from "../screens/admin/CustomerDetail";

const Stack = createStackNavigator()
const MainRouter =({navigation})=>{
    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown:false
            }}>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="register" component={Register}/>
            <Stack.Screen name="tabadmin" component={TabAdmin}/>
            <Stack.Screen name="tabcustomer" component={TabCustomer}/>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="UpdateProfile" component={UpdateProfile}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword}/>
            <Stack.Screen name="CustomerDetail" component={CustomerDetail} />
        </Stack.Navigator>
    )
        
}
export default MainRouter;