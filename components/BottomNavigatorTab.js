import * as React from 'react';
import  {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TransactionScreen from "../Screens/TransactionScreen";
import SearchScreen from "../Screens/SearchScreen";

const Tab = createBottomTabNavigator();

export default class BottomNavigatorTab extends React.Component{
    render(){
        return(
           <NavigationContainer>
               <Tab.Navigator>
                   <Tab.Screen name = "Transaction" component = {TransactionScreen}/>
                   <Tab.Screen name = "Search" component = {SearchScreen}/>
               </Tab.Navigator>
           </NavigationContainer>
        );
    }
}