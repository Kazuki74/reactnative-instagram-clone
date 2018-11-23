import React from 'react';
import { Text, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../../config/config';
import { Permissions, ImagePicker } from 'expo';

class Upload extends React.Component {
    state = {
        userId: f.auth().currentUser.uid,
        loggedIn: false,
        imageId: '0',
        cameraStatus: "",
        cameraRollStatus: "",
        currentfFileType: "",
        storageRef: storage.ref('users'), 
    }

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

    uploadImage = async uri => {
        const { userId, imageId, storageRef } = this.state;
        const regEx = /(?:\.([^.]+))?$/;
        const currentfFileType = regEx.exec(uri)[1];
        this.setState({
            currentfFileType
        })
        const response = await fetch(uri);
        const blob = await response.blob();
        const filePath = imageId + '.' + this.state.currentfFileType
        const currentUserRef= storageRef.child(userId).child(`/img/${filePath}`);
        currentUserRef.put(blob).on('state_changed', snap => {
            console.log('Progress', snap.bytesTransferred, snap.totalBytes)
        })
    }
    
    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.loggedIn ? (
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => this.findNewImage()}>
                            <Text style={{fontSize: 28, paddingBottom: 5}}>Upload</Text>
                            <Text>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <Text>You are not logged in</Text>
                    </View>
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