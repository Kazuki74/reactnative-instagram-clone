import React from 'react';
import { Text, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

import PhotoList from '../components/PhotoList';

class Profile extends React.Component {
    state = {
        loggedIn: false,
        userId: '',
        currentUserName: '',
        currentUserUsername: '',
        currentUserAvatar: '',
    }

    componentDidMount() {
        f.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({
                    loggedIn: true,
                    userId: user.uid
                }, () => {
                    this.setCurrentUserInfo(user.uid);
                })
            } else {
                this.setState({
                    loggedIn: false
                })
            }
        })
    }

    setCurrentUserInfo = userId => {
        const currentUserRef = database.ref('users').child(userId);
        
        currentUserRef.child('name').once('value').then(snap => {
            this.setState({
                currentUserName: snap.val()
            })
        })

        currentUserRef.child('username').once('value').then(snap => {
            this.setState({
                currentUserUsername: snap.val()
            })
        })

        currentUserRef.child('avatar').once('value').then(snap => {
            this.setState({
                currentUserAvatar: snap.val()
            })
        })
    }

    render() {
        const { userId, currentUserAvatar, currentUserName, currentUserUsername } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Profile</Text>
                </View>
                {this.state.loggedIn ? (
                    <React.Fragment>
                        <View style={{justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}}>
                            <Image
                                source={{uri: currentUserAvatar}}
                                style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50, marginTop: 10}}
                            />
                            <View style={{marginRight: 10}}>
                                <Text>{currentUserName}</Text>
                                <Text>@{currentUserUsername}</Text>
                            </View>
                        </View>
                        <View style={{paddingBottom: 20, borderBottomWidth: 0.5}}>
                            <TouchableOpacity style={{marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: "grey", borderWidth: 0.5}}>
                                <Text style={{textAlign: "center", color: "grey"}}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: "grey", borderWidth: 0.5}}>
                                <Text style={{textAlign: "center", color: "grey"}}>
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: "grey", borderWidth: 0.5, backgroundColor: 'grey'}}
                                onPress={() => this.props.navigation.navigate('Upload')}
                            >
                                <Text style={{textAlign: "center", color: "white"}}>
                                    Upload New Photo
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <PhotoList isUser={true} userId={userId} navigation={this.props.navigation}/>
                    </React.Fragment>
                ) : (
                    <Text>You are not logged in</Text>
                )}
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        paddingTop: 30,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5
    },
})



export default Profile;