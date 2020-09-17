import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';

import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner";
import { TextInput } from 'react-native-gesture-handler';



export default  class  TransactionScreen extends React.Component{

    constructor(){
      super();
      this.state={
        hasCameraPermissions:null,
        scanned:false,
        scannedData:"",
        buttonState:"normal",
        scannedBookId:"",
        scannedStudentId:""
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
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <View>
          <Image 
          source={require("../assets/booklogo.jpg")}
          style = {{width:200,height:200}}
          
          />
          <Text> WILY </Text>
        </View>
     <View style={styles.inputView}>
      <TextInput
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

      </View>
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

