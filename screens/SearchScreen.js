import  React from  'react';
import {View,Text,FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import db from "../config";

export default class SearchScreen extends React.Component{
    
    constructor(){
        super();
        this.state={
            allTransactions:[]
        }
    }
    componentDidMount=async()=>{
        var query = await db.collection("transaction").get();
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()]
            });
        })
    }
    render(){
        return(
        <FlatList
            data = {this.state.allTransactions}
            renderItem
        />
        )
    }
}