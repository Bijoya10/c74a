import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image,TextInput,KeyboardAvoidingView,ToastAndroid} from 'react-native';

import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner";

import * as firebase from "firebase";
import db  from "../config";



export default  class  TransactionScreen extends React.Component{

    constructor(){
      super();
      this.state={
        hasCameraPermissions:null,
        scanned:false,
        scannedData:"",
        buttonState:"normal",
        scannedBookId:"",
        scannedStudentId:"",
        transactionMessage:""
      }
    }
    getCameraPermissions=async(id)=>{
      const {status}=await Permissions.askAsync(Permissions.CAMERA);
      this.setState({
        hasCameraPermissions:status==="granted",
        buttonState:id,
        scanned:false
      }
      );

    }
    handleBarCodeScanner=async({type,data})=>{
      this.setState({scanned:true,
      scannedData:data,
      buttonState:'normal'  

    });

    }

    handletransaction=async()=>{
      var transactionMessage=null;
      db.collection("books").doc(this.state.scannedBookId).get().then((doc)=>{
        var book=doc.data();
        if(book.bookAvailability){
          this.initiateBookIssue();
          transactionMessage="Book Issued";
          ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        }else {
          this.initiateBookReturn();
          transactionMessage="return";
          ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        }
      })
      this.setState({
        transactionMessage:transactionMessage,

      });
    }
    initiateBookIssue=async()=>{
      db.collection("transaction").add({
        studentId:this.state.scannedStudentId,
        bookId:this.state.scannedBookId,
        date:firebase.firestore.Timestamp.now().toDate(),
        transactiontype:"issue",
      });
      db.collection("books").doc(this.state.scannedBookId).update({
        bookAvailability:false
      })
      db.collection("students").doc(this.state.scannedStudentId).update({
        numberOfBookIssued:firebase.firestore.FieldValue.increment(1)
      })
      this.setState({
        scannedBookId:"",
        scannedStudentId:""
      })
    }

    initiateBookReturn=async()=>{
      db.collection("transaction").add({
        studentId:this.state.scannedStudentId,
        bookId:this.state.scannedBookId,
        date:firebase.firestore.Timestamp.now().toDate(),
        transactiontype:"return",
      });
      db.collection("books").doc(this.state.scannedBookId).update({
        bookAvailability:true
      })
      db.collection("students").doc(this.state.scannedStudentId).update({
        numberOfBookIssued:firebase.firestore.FieldValue.increment(-1)
      })
      this.setState({
        scannedBookId:"",
        scannedStudentId:""
      })
    }

  render(){
    const hasCameraPermissions=this.state.hasCameraPermissions;
    const scanned=this.state.scanned;
    const buttonState=this.state.buttonState;

    if(buttonState!=="normal" && hasCameraPermissions){
      return(
        <BarCodeScanner 
        onBarCodeScanned={scanned? undefined:this.handleBarCodeScanner}
        style={StyleSheet.absoluteFillObject}>
        </BarCodeScanner>
      );
    }
else if(buttonState==="normal"){
 
    return(
      <KeyboardAvoidingView style={{justifyContent:'center',alignItems:'center'}} behavior="padding" enabled>
        
        <View>
          <Image 
          source={require("../assets/booklogo.jpg")}
          style = {{width:200,height:200}}
          
          />
          <Text> WILY </Text>
        </View>
     <View style={styles.inputView}>
      <TextInput
      onChangeText={text=>{this.setState({scannedBookId:text})}}
      style={styles.inputBox}
      placeholder="BookId"
      value={this.state.scannedBookId}

      >
      </TextInput>
        <TouchableOpacity style={styles.button}
            onPress={()=>{
              this.getCameraPermissions("BookId");
            }}
        >

          <Text style={styles.buttonText}> Scan</Text>

        </TouchableOpacity>
        
      </View>

      <View style={styles.inputView}>
      <TextInput
        onChangeText={text=>{this.setState({scannedStudentId:text})}}

      style={styles.inputBox}
      placeholder="StudentId"
      value={this.state.scannedStudentId}
      >
      </TextInput>
        
          <TouchableOpacity style={styles.button}
              onPress={()=>{
                this.getCameraPermissions("StudentId");
              }}
          >

          <Text style={styles.buttonText}> Scan</Text>

        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}
            onPress={async()=>{
              this.handletransaction();
            }}
        >

          <Text style={styles.buttonText}> Submit</Text>

        </TouchableOpacity>

      </KeyboardAvoidingView>
    )
  }
  }

  
}

const styles=StyleSheet.create({

  displayText:{
      fontSize:15,
      color:'blue'
  },

  button:{
    backgroundColor:'pink',
    width:40,
    height:35
  },

  buttonText:{
    fontSize:15,
    color:'red'
  },

  inputView:{
    flexDirection:"row",
    margin:20
  },

  inputBox:{
    backgroundColor:'pink',
    width:40,
    height:35,
    fontSize:20

  },


})

