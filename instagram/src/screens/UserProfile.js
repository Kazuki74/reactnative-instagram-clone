import React from 'react';
import { Text, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

import PhotoList from '../components/PhotoList';

class Profile extends React.Component {
    state = {
        loaded: false,
        userId: '',
        usersRef: database.ref('users'),
        name: '',
        username: '',
    }

    checkParams = () => {
        const params = this.props.navigation.state.params;
        if(params) {
            if(params.userId) {
                this.setState({
                    userId: params.userId
                }, () => {
                    this.fetchUserInfo();
                })
            }
        }
    }

    fetchUserInfo = () => {
        const userRef = this.state.usersRef.child(this.state.userId)

        userRef
            .child('username')
            .once('value')
            .then(snap => {
                if(snap.val()) {
                    const username = snap.val();
                    this.setState({ username })
                }
            }).catch(err => console.log(err))
        
        userRef
            .child('name')
            .once('value')
            .then(snap => {
                if(snap.val()) {
                    const name = snap.val();
                    this.setState({ name })
                }
            })

        userRef
            .child('avatar')
            .once('value')
            .then(snap => {
                if(snap.val()) {
                    const avatar = snap.val();
                    this.setState({ avatar, loaded: true })
                }
            })
    }

    componentDidMount() {
        this.checkParams();
    }

    render() {
        const userId = this.props.navigation.state.params.userId;
        const { name, username, avatar} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={ () => this.props.navigation.goBack() } style={{ marginLeft: 20 }}>
                        <Text style={{ fontWeight: "bold" }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', marginBottom: 10}}>
                    <Image
                        source={{uri: avatar}}
                        style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50, marginTop: 10}}
                    />
                    <View style={{marginRight: 10}}>
                        <Text>{name}</Text>
                        <Text>@{username}</Text>
                    </View>
                </View>
                <PhotoList isUser={true} userId={userId} navigation={this.props.navigation} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {

        flexDirection: "row",
        alignItems: "center",
        height: 70,
        paddingTop: 30,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5
    },
})



export default Profile;