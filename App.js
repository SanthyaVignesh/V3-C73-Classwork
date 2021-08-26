import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomNavigatorTab  from './components/BottomNavigatorTab';

export default class App extends React.Component {
  render(){
    return <BottomNavigatorTab/>
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
