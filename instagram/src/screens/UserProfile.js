import React from 'react';
import { Text, FlatList, StyleSheet, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

class UserProfile extends React.Component {
    state = {
        loggedIn: false
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


export default UserProfile;