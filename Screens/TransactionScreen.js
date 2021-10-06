import * as React from 'react';
import {Text,View,StyleSheet,TextInput, TouchableOpacity, ImageBackground ,Image ,KeyboardAvoidingView, SafeAreaView, Dimensions} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from "../config";
import firebase from 'firebase'

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
            studentId : "",
            bookName:"",
            studentName:"" //Sorry.. There was = ok let us check now
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


    getBookDetails = (bookId)=>{
        bookId = bookId.trim();
        db.collection("books")
          .where("book_id", "==",bookId)
          .get()
          .then((snapshot)=>{
                snapshot.docs.map((doc)=>{
                    this.setState({
                        bookName : doc.data().book_details.book_name
                    })
                })
          })
    }

    getStudentDetails = (studentId)=>{
        studentId = studentId.trim();
        db.collection("students")
          .where("student_id", "==",studentId)
          .get()
          .then((snapshot)=>{
                snapshot.docs.map((doc)=>{
                    this.setState({//book_name as in firestore??pls wait
                        studentName : doc.data().student_details.student_name// I think state variable not created in constructor?? can that be
                    })
                })
          })
    }

    handleTransaction = ()=>{
        var {bookId , studentId} = this.state;
         this.getBookDetails(bookId);
         this.getStudentDetails(studentId);
        db.collection("books").doc(bookId).get().then(
            (doc)=>{
                var book = doc.data();
                if(book.is_book_available){
                    this.initiateBookIssue(studentId,bookId,this.state.studentName,this.state.bookName);
                    alert("Book Issued to the student");
                }
                else{
                    var {studentName,bookName} = this.state
                    this.initiateBookReturn(studentId,bookId,studentName,bookName);
                    alert("Book returned to the library");
                }
            }
        )
    }


    initiateBookIssue(studentId, bookId,studentName ,bookName){
        db.collection("transactions").add({
            student_id : studentId,
            student_name : studentName,
            book_id : bookId,
            book_name : bookName,
            date : firebase.firestore.Timestamp.now().toDate(),
            transaction_type : "issue"
        });

        db.collection("books")
            .doc(bookId)
            .update({
                is_book_available : false
            })

        db.collection("students")
            .doc(studentId)
            .update({
                no_of_books_issued : firebase.firestore.FieldValue.increment(1)
            })

        this.setState({
            bookId : "",
            studentId : ""
        })
    }

    initiateBookReturn(studentId,bookId,studentName,bookName){
        db.collection("transactions").add({
            student_id : studentId,
            student_name : studentName,
            book_id : bookId,
            book_name : bookName,
            date : firebase.firestore.Timestamp.now().toDate(),
            transaction_type : "return"
        });

        db.collection("books")
            .doc(bookId)
            .update({
                is_book_available : true
            })

        db.collection("students")
            .doc(studentId)
            .update({
                no_of_books_issued : firebase.firestore.FieldValue.increment(-1)
            })

        this.setState({
            bookId : "",
            studentId : ""
        })
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
                
                <KeyboardAvoidingView  behavior = "padding" style = {styles.viewContainer} >
                    <View style = {[styles.viewContainer,{flex : 1,alignItems :"center",justifyContent : "center"}]}>
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
                                onChangeText={(text)=>{this.setState({bookId:text})}}
                                value = {this.state.bookId}
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
                                onChangeText  = {(text)=>{
                                    this.setState({
                                        studentId : text
                                    })
                                }}
                                value = {this.state.studentId}
                            />
                            <TouchableOpacity 
                                style = {styles.button}
                                onPress = {()=>{
                                    this.getCameraPermission("studentId")
                                }}>
                                    <Text style= {styles.buttonText}>Scan</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style = {[styles.button,{marginTop : 25}]} onPress = {()=>{
                            this.handleTransaction();
                        }}>
                        <Text style = {styles.buttonText}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                    </View>  
                 
                    
                    </ImageBackground> 
                        </View>
                </KeyboardAvoidingView>
             
           
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
        backgroundColor :  "#5653D4",
        alignItems : "center"
    },
    lowerContainer :{
        flex : 0.5,
        alignItems : "center",
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
    },

})