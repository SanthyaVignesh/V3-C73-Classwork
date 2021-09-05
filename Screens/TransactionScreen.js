import * as React from 'react';
import {Text,View,StyleSheet,TextInput, TouchableOpacity, ImageBackground ,Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

const bgImg = require("../assets/images/background2.png");
const appIcon = require("../assets/images/appIcon.png");
const appName = require("../assets/images/appName.png");


export default class TransactionScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            domState : "normal",
            hasCamPermission : null,
            scanned : false,
            bookId : "",
            studentId : ""
        };
    }

    getCameraPermission = async (domState)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);

        this.setState({
            hasCamPermission : status === 'granted',
            domState : domState,
            scanned : false
        });
    }

    handleBarCodeScanned = async ({type,data}) =>{
        const {domState} = this.state;

        if(domState === "bookId"){
            this.setState ({
                bookId : data,
                domState : "normal",
                scanned : true
            })
        }
        else if(domState === "studentId"){
            this.setState ({
                studentId : data,
                domState : "normal",
                scanned : true
            })
        }
       
    }

    

    render(){
        const {domState,hasCamPermission,scanned,bookId,studentId} = this.state;
        if(domState !== "normal"){
            return(
                <BarCodeScanner onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}/>
            )
        }
        else{
            return(
                
                <View style = {styles.viewContainer}>
                    <ImageBackground source = {bgImg} style = {styles.bgImage}>
                    <View  style = {styles.upperContainer}>
                        <Image source = {appIcon} style = {styles.appIcon}></Image>
                        <Image source = {appName} style = {styles.appName}></Image>
                    </View>
                    <View style = {styles.lowerContainer}>
                        <View style = {styles.textinputContainer}>
                            <TextInput 
                                style = {styles.textStyle}
                                placeholder = {"Book id"}
                                placeholderTextColor = {"#FFFFFF"}
                                value = {bookId}
                            />
                            <TouchableOpacity 
                                style = {styles.button}
                                onPress = {()=>{
                                    this.getCameraPermission("bookId")
                                }}>
                                    <Text style= {styles.buttonText}>Scan</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {[styles.textinputContainer, {marginTop : 25}]} >
                        <TextInput 
                                style = {styles.textStyle}
                                placeholder = {"Student id"}
                                placeholderTextColor = {"#FFFFFF"}
                                value = {studentId}
                            />
                            <TouchableOpacity 
                                style = {styles.button}
                                onPress = {()=>{
                                    this.getCameraPermission("studentId")
                                }}>
                                    <Text style= {styles.buttonText}>Scan</Text>
                            </TouchableOpacity>

                        </View>
                    </View>  
                    </ImageBackground> 
                </View>
            );
    
        }
    }
}

const styles =  StyleSheet.create({
    bgImage :{
        flex : 1,
        resizeMode : "cover",
        justifyContent :"center"
    },
    upperContainer:{    
        flex : 0.5,
        justifyContent : "center",
        alignItems : "center"
    },
    appIcon:{
        width : 200,
        height : 200,
        resizeMode : "contain",
        marginTop : 80
    },
    appName :{
        width : 80,
        height : 80,
        resizeMode : "contain"
    },
    viewContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems  : "center",
        backgroundColor :  "#5653D4"
    },
    lowerContainer :{
        flex : 0.5,
        alignItems : "center"
    },
    textinputContainer : {
        borderWidth :2,
        borderRadius : 10,
        flexDirection : "row",
        backgroundColor : "#9DFD24",
        borderColor : "#FFFFFF"
    },
    textStyle : {   
        color : "#ffffff",
        fontSize : 18,
        fontFamily : "Oldenburg_400Regular",
        width : "57%",
        height : 50,
        padding :10,
        borderColor : "#FFFFFF",
        borderRadius : 10,
        borderWidth : 3,

    },
    button :{
        width : "43%",
        height : 55,
        justifyContent : "center",
        alignItems : "center",
        backgroundColor : "#F48D20",
        borderRadius : 15
    },
    buttonText : {
        fontSize : 24,
        fontFamily : "Oldenburg_400Regular",
        color : "#FFFFFF"
    }
})