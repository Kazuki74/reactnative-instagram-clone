import React from 'react';
import { Text, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../../config/config';
import { Permissions, ImagePicker } from 'expo';

class Upload extends React.Component {
    state = {
        userId: '',
        loggedIn: false,
        imageId: '0',
        cameraStatus: "",
        cameraRollStatus: "",
        currentfFileType: "",
        storageRef: storage.ref('users'), 
        progress: 0,
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
                    loggedIn: true,
                    userId: f.auth().currentUser.uid
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
        console.log(result)
        if(result && !result.cancelled) {
            this.setState({
                imageId: this.uniqueId()
            }, () => this.uploadImage(result.uri))    
        }
    }

    uploadImage = async uri => {
        const { imageId } = this.state;
        const regEx = /(?:\.([^.]+))?$/;
        const currentfFileType = regEx.exec(uri)[1];
        this.setState({
            currentfFileType
        })
        // not working on expo sdk31
        // const response = await fetch(uri);
        // const blob = await response.blob();
        const filePath = imageId + '.' + this.state.currentfFileType

        const oReq = new XMLHttpRequest();
        oReq.open("GET", uri, true);
        oReq.responseType = "blob";
        oReq.onload = () => {
            blob = oReq.response;
            //Call function to complete upload with the new blob to handle the uploadTask.
            // this.completeUploadBlob(blob, FilePath);
            this.completeUploadBlob(blob, filePath);
        }
        oReq.send();
    }

    completeUploadBlob = (blob, filePath) => {
        const { userId, imageId, storageRef } = this.state;

        const uploadTask = storageRef.child(userId).child('/img').child(filePath).put(blob);

        uploadTask.on("state_changed", snap => {
            const progress = ((snap.bytesTransferred / snap.totalBytes) * 100 ).toFixed(0);
            console.log(`${progress}%`);
            this.setState({
                progress
            }, err => {
                console.log(err)
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    this.processUpload(downloadURL);
                })
                .catch(err => {
                    console.log(err);
                })
            })
        })
    }
    
    render() {
        this.state.storageRef.child(this.state.userId).child('/img').child('3dc7b77d-89b7-98a0-6300-44b9-cbd4-b0fb.jpg').getDownloadURL().then(downloadURL => {
            console.log(downloadURL)
        })
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