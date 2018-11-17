import React from 'react';
import { Text, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

class Profile extends React.Component {
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
                <View style={styles.header}>
                    <Text>Profile</Text>
                </View>
                {this.state.loggedIn ? (
                    <React.Fragment>
                        <View style={{justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}}>
                            <Image
                                source={{uri: "https://images.unsplash.com/photo-1542360632-85c101674393?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3d3f62e80c37194d51641f94d5bdc8a4&auto=format&fit=crop&w=3288&q=80"}}
                                style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50, marginTop: 10}}
                            />
                            <View style={{marginRight: 10}}>
                                <Text>Name</Text>
                                <Text>@user</Text>
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
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eee"}}>
                            <Text>
                                Loaded images...
                            </Text>
                        </View>
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