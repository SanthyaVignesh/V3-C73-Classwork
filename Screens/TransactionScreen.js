import * as React from 'react';
import {Text,View,StyleSheet, TouchableOpacity} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default class TransactionScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            domState : "normal",
            hasCamPermission : null,
            scanned : false,
            scannedData : ""
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
        this.setState ({
            scannedData : data,
            domState : "normal",
            scanned : true
        })
    }

    

    render(){
        const {domState,hasCamPermission,scanned,scannedData} = this.state;
        if(domState === "scanner"){
            return(
                <BarCodeScanner onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}/>
            )
        }
        else{
            return(
                <View style = {styles.viewContainer}>
                    <Text style = {styles.textStyle}>
                        {hasCamPermission ? scannedData : "Request Camera Permission"}
                    </Text>
                    <TouchableOpacity style= { styles.button } onPress = {()=>{this.getCameraPermission("scanner")}}>
                        <Text style = {styles.textStyle}>
                            Scan QR Code
                        </Text>
                    </TouchableOpacity>
            </View>
            );
    
        }
    }
}

const styles =  StyleSheet.create({
    viewContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems  : "center",
        backgroundColor :  "#5653D4"
    },
    textStyle : {   
        color : "#ffffff",
        fontSize : 30
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
        color : "#FFFFFF"
    }
})