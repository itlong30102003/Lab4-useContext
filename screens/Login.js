import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { login, useMyContextController } from "../context";
import auth from '@react-native-firebase/auth';
const Login =({navigation})=>{
    // Su dung store
    const [controller, dispatch] = useMyContextController();
    //lay thong tin userLogin tu store
    const {userLogin} = controller
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("123456");
    const [showPassword, setShowPassword] = useState(false);
    const checkEmail = ()=> {
        var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        return regex.test(email)
    }

    const checkPassword  = ()=>password.length >=6    
    
    const handleLogin = () =>{
        //Dang nhap thanh cong thi cap nhat thong tin nguoi dung dnag nhap tren userLogin
       login(dispatch,email,password) 
    }

    // Xử lý quên mật khẩu
    const handleForgotPassword = () => {
        if (!checkEmail()) {
            Alert.alert("Email không hợp lệ");
            return;
        }   
        auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert(`Email khôi phục mật khẩu đã được gửi tới ${email}`);
            })
            .catch(error => {
                console.log(error);
                Alert.alert("Có lỗi xảy ra, vui lòng thử lại");
            });
    };

    useEffect(()=>{
        //fecth userLogin tu store neu thay doi dua sang man hinh tuong ung
        if(userLogin===null)
            navigation.navigate("login")
        else if(userLogin.role ==="admin")
        {
            console.log('admin login')
            navigation.navigate("tabadmin")
        }
        else if(userLogin.role ==="customer")
        {
            console.log('customer login')
            navigation.navigate("tabcustomer")
        }
            
    },[userLogin]);

    return(
        <View style={style.container}>
            <Text style={style.title}>Login</Text>
            <TextInput 
                value={email}
                placeholder="Input Email"
                mode="outlined"
                style={style.textInput}
                onChangeText={setEmail}
                left={<TextInput.Icon icon={'email'}/>}
            />
            <HelperText type="error" visible={!checkEmail()}>
                Sai dia chi mail
            </HelperText>
            
            <TextInput 
                value={password}
                placeholder="Input Password"
                style={style.textInput}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                left={<TextInput.Icon icon={'key'}/>}
                right={<TextInput.Icon icon={"eye"} onPress={()=>setShowPassword(!showPassword)}/>}
            />
            <HelperText type="error" visible={!checkPassword()}>
                Password co it nhat 6 ky tu
            </HelperText>
            
            <Button disabled={!checkEmail() || !checkPassword()} mode="contained"
                onPress={handleLogin}
            >
                Login
            </Button>
            
            <View style={style.register}>
                <Text>You don't have account!</Text>
                <Button
                    onPress={()=> navigation.navigate("register")}
                
                >Register new account</Button>
            </View>
            <Button style={{margin:10}}mode="text" onPress={handleForgotPassword}>
                Forgot Password?
            </Button>
        </View>
    );
}
export default Login;

const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        padding: 15,
    },
    title:{
        color:"red",
        fontSize: 40,
        fontWeight:"bold",
        textAlign:'center',
        paddingBottom:30,
    },
    textInput:{
        borderRadius:10,
    },
    register:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center'

    },

})