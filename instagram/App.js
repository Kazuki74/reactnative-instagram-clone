import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Feed from './src/screens/Feed';
import Profile from './src/screens/Profile';
import Upload from './src/screens/Upload';
import UserProfile from './src/screens/UserProfile';
import Comments from './src/screens/Comments';
import { auth } from 'firebase';

const TabStack = createBottomTabNavigator({
  Feed: {screen: Feed},
  Upload: {screen: Upload},
  Profile: {screen: Profile}
})

const MainStack = createStackNavigator({
  Home: { screen: TabStack },
  User: { screen: UserProfile },
  Comments: { screen: Comments }
},{
  initialRouteName: "Home", //Sets the default screen of the stack. Must match one of the keys in route configs.
  mode: 'modal', //Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on Android.
  headerMode: 'none' //Specifies how the header should be rendered: none - No header will be rendered.
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