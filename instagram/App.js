import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Feed from './src/screens/Feed.js';
import Profile from './src/screens/Profile.js';
import Upload from './src/screens/Upload.js';
import { auth } from 'firebase';

const MainStack = createBottomTabNavigator({
  Feed: {screen: Feed},
  Upload: {screen: Upload},
  Profile: {screen: Profile}
})

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.login();
  }

  login = async() => {
    try{
      let user = await auth().signInWithEmailAndPassword('example@example.com', 'password');
    }catch(err){
      console.log(err);
    }
  }

  

  render() {
    return (
      <MainStack />
    );
  }
}