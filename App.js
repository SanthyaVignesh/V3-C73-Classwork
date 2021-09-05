import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomNavigatorTab  from './components/BottomNavigatorTab';
import * as Font from "expo-font";
import {Oldenburg_400Regular } from '@expo-google-fonts/oldenburg';



export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      fontLoaded :false
    }
  }

  render(){
    const {fontLoaded} = this.state;
    if(fontLoaded){
      return <BottomNavigatorTab/>
    }
    return null;
  }

  async loadFonts(){
      await Font.loadAsync({
        Oldenburg_400Regular : Oldenburg_400Regular
      });

      this.setState({
        fontLoaded : true
      })
  }
  
  componentDidMount(){
    this.loadFonts();
  }
  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
