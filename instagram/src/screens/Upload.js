import React from 'react';
import { Text, FlatList, StyleSheet, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

class Upload extends React.Component {
    state = {
        loggedIn: false
    s4 = () => {
        return Math.floor((1+ Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    componentDidMount() {
        f.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({
                    loggedIn: true
                })
            } else {
                this.setState({
                    loggedIn: false
                })
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loggedIn ? (
                    <Text>Hello, World!</Text>
                ) : (
                    <Text>You are not logged in</Text>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default Upload;