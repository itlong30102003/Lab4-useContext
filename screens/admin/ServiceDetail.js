import firestore from "@react-native-firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Button, Dialog, HelperText, Icon, IconButton, Portal, TextInput } from "react-native-paper";
import { useMyContextController } from "../../context";
import ImagePicker from 'react-native-image-crop-picker';
import storage, { ref } from "@react-native-firebase/storage";
const ServiceDetail =({navigation, route})=>{
    const {id} = route.params.item
    const[service, setService] = useState({})

    const [controller, dispatch] = useMyContextController()
    const {userLogin} = controller
    

    const hasErrorServiceName = ()=> service.serviceName == ""
    const hasErrorPrice = ()=> service.price <= 0
    const SERVICES = firestore().collection("SERVICES")
    const [visible,setVisible] = useState(false)
    const hideDialog = () => setVisible(false)
    useEffect(()=>{
        SERVICES.doc(id).onSnapshot(reponse => setService(reponse.data()))
    },[])


    const handleUpdateService = () =>{
        //update image
        const refImage = storage().ref("/services/"+ id + ".png")
        refImage.putFile(service.image)
        .then(()=>{
            //update image
            //Getlink Image
            refImage.getDownloadURL()
            .then(link => {
                SERVICES.doc(id)
                .update({...service,create: userLogin.email, image: link})
            })
            SERVICES.doc(id)
            .update({...service, create: userLogin.email})
            navigation.navigate("Service")
        })
        .catch(e=> console.log(e.message))
    }

    const handleUploadImage =()=>{
        ImagePicker.openPicker({
            mediaType:"photo",
            height:300,
            width:400,
            cropping: true
        })
        .then(respone => setService({...service, image: respone.path}))
        .catch(e => console.log(e.message))
    }
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerRight: (props) => <IconButton icon={"delete"} {...props}
                onPress={()=> setVisible(true)}
            />
        })
    }, [])
    const handleDeleteService = () =>{
        SERVICES.doc(id).delete()
        .then(()=>navigation.navigate("Service"))
    }

    return(
        (service!=null)&&
        <View style={style.container}>
{/* image */}
            <Text>Image *</Text>
            <Button onPress={handleUploadImage}> 
                Upload Image
            </Button>
            {((service.image)&&(<Image source={{uri: service.image}} style={{height:300}}/>))}

            
{/* service name */}
            <Text>Service Name *</Text>
            <TextInput 
                label={"Input Service Name"}
                value={service.serviceName}
                onChangeText={(text)=> setService({...service, serviceName: text})}
            />
            <HelperText type="error" visible={hasErrorServiceName()}>
                Service Name isn't empty
            </HelperText>
{/* price */}
            <Text>Price *</Text>
            <TextInput 
                label={"Input Price"}
                value={service.price}
                onChangeText={(text)=> setService({...service, price: text})}
                keyboardType="numeric"
            />
            <HelperText type="error" visible={hasErrorPrice()}>
                Price{" > "}0 
            </HelperText>
          
            <Button mode="contained"
                onPress={handleUpdateService}
                disabled={hasErrorServiceName() && hasErrorPrice()}
            >
                Update Service
            </Button>
            
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Confirm Delete Service</Dialog.Title>
                    <Dialog.Content>
                    <Text variant="bodyMedium">Do you want to delete service ?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleDeleteService}>Yes</Button>
                        <Button onPress={hideDialog}>No</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* <Image source={require(image)} height={300} width={300} /> */}
        </View>
    )
}
export default ServiceDetail;

const style = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
    },
})