import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useMyContextController } from "../../context";
import ImagePicker from 'react-native-image-crop-picker';
import storage, { ref } from "@react-native-firebase/storage";


const AddNewService =({navigation})=>{
    const [controller, dispatch] = useMyContextController()
    const {userLogin} = controller
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const hasErrorServiceName = ()=> serviceName==""
    const hasErrorPrice = ()=> price <= 0
    const SERVICES = firestore().collection("SERVICES")
    
    const handleAddnewService =()=>{
        SERVICES.add(
            { 
                serviceName,
                price,
                createBy: userLogin.fullName
            }
        )
        .then(reponse => { 
            //tham chieu den file anh / service / id 
            const refImage = storage().ref("/services/"+ reponse.id +".png")
            //upload image to refImage
            if(image!="")  
            {
                refImage.putFile(image)
                .then(()=>{
                    //get link refImage => update image of SERVICE
                    refImage.getDownloadURL()
                    .then(link => SERVICES.doc(reponse.id)
                    .update({image: link,id: reponse.id}))
                    navigation.navigate("Service")
                })
                .catch(e => console.log(e.message))
            }
            else
            {
                SERVICES.doc(reponse.id).update({id: reponse.id})
                navigation.navigate("Service")
            }
            Alert.alert("Add new service success") 
        })
        .catch(e => Alert.alert("Add new service fail"))
    }

    const handleUploadImage =()=>{
        ImagePicker.openPicker({
            mediaType:"photo",
            height:300,
            width:400,
            cropping: true
        })
        .then(image=> setImage(image.path))
        .catch(e => console.log(e.message))
    }

    return(
        <View style={style.container}>
{/* image */}
            <Text>Image *</Text>
            <Button onPress={handleUploadImage}> 
                Upload Image
            </Button>
            {(image!="")&&(<Image source={{uri: image}} style={{height:300}}/>)}

            
{/* service name */}
            <Text>Service Name *</Text>
            <TextInput 
                label={"Input Service Name"}
                value={serviceName}
                onChangeText={setServiceName}
            />
            <HelperText type="error" visible={hasErrorServiceName()}>
                Service Name isn't empty
            </HelperText>
{/* price */}
            <Text>Price *</Text>
            <TextInput 
                value={price}
                label={"Input Price"}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <HelperText type="error" visible={hasErrorPrice()}>
                Price{" > "}0 
            </HelperText>
          
            <Button mode="contained"
                onPress={handleAddnewService}
                disabled={hasErrorServiceName()|| hasErrorPrice()}
            >
                Add New Service
            </Button>

            {/* <Image source={require(image)} height={300} width={300} /> */}
        </View>
    )
}
export default AddNewService;

const style = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
    },
})