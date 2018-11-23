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

    _checkPermissions = async () => {
        const { cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        const { cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);        
        this.setState({
            cameraStatus, cameraRollStatus
        })
    }

    findNewImage = async () => {
        this._checkPermissions();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        })
        if(result && !result.cancelled) {
            this.setState({
                imageId: this.uniqueId()
            }, () => this.uploadImage(result.uri))    
        }
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