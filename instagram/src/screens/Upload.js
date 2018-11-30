import React from 'react';
import { Text, FlatList, StyleSheet, View, Image, TouchableOpacity, TextInput, ActivityIndicator, Dime } from 'react-native';
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
        imageSelected: false,
        uploading: false,
        caption: '',
        imageUri: ''
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
                imageId: this.uniqueId(),
                imageUri: result.uri,
                imageSelected: true
            })    
        } else {
            this.setState({ imageSelected: false })
        }
    }

    uploadImage = async uri => {
        const { imageId } = this.state;
        const regEx = /(?:\.([^.]+))?$/;
        const currentfFileType = regEx.exec(uri)[1];
        this.setState({
            currentfFileType,
            uploading: true
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
            this.setState({ progress });
            }, err => {
                console.log(err);
            }, () => {
                this.setState({
                    uploading: false
                })
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    console.log('File available at ' + downloadURL);
                })
                .catch(err => {
                    console.log(err);
                })
            }
        )
    }

    uploadPublish = () => {
        if(this.state.caption !== '') {
            this.uploadImage(this.state.imageUri);
        } else {
            alert('Please enter a caption.');
        }
    }
    
    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.loggedIn ? (
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5}}>
                            <Text>Upload</Text>
                        </View>
                        { this.state.imageSelected === true ? (
                            <View style={{flex: 1}}>
                                <View style={{ padding: 5 }}>
                                    <Text style={{marginTop: 5}}>Caption...</Text>
                                    <TextInput 
                                        editable={true}
                                        placeholder={"Enter your caption..."}
                                        maxLength={150}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={text => this.setState({ caption: text })}
                                        style={{ 
                                            marginVertical: 10,
                                            height: 100,
                                            padding: 5,
                                            borderColor: 'grey',
                                            borderWidth: 1,
                                            borderRadius: 3,
                                            backgroundColor: 'white',
                                            color: 'black'
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => { this.uploadPublish() }}
                                    style={{flex: 1, alignItems: 'center'}}
                                >
                                    <Text>Publish</Text>
                                </TouchableOpacity>
                                { this.state.uploading === true ? (
                                    <View style={{ marginTop: 10 }}>
                                        { this.state.progress !== 100 ? (
                                            <ActivityIndicator size="small" color="blue"/>
                                        ) : 
                                            <Text>
                                                Processing...
                                            </Text>
                                        }
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                                <Image 
                                    source={{ uri: this.state.imageUri }}
                                    style={{ marginTop: 10, resizeMode: 'cover', width: "100%", height: 275 }}
                                />
                            </View>
                        ) : (
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.findNewImage()}>
                                    <Text style={{fontSize: 28, paddingBottom: 5}}>Upload</Text>
                                    <Text>Select Photo</Text>
                                </TouchableOpacity>
                            </View>
                        )}
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