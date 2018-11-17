import React from 'react';
import { Text, FlatList, StyleSheet, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

class Feed extends React.Component {
    state = {
        photo_feed: [0,1,2,3,4],
        refreshing: false,
        loading: false,
        photosRef: database.ref('photos'),
        usersRef: database.ref('users')
    }

    componentDidMount() {
        this.loadFeed();
    }

    loadFeed = () => {
        this.setState({
            refreshing: true,
            loading: true,
            photo_feed: []
        })

        this.state.photosRef
            .orderByChild('posted')
            .once('value')
            .then(snap => {
                const exists = (snap.val() !== null);
                if(exists) data = snap.val();
                var photo_feed = this.state.photo_feed;
                    for(var photo in data) {
                        var photoObj = data[photo];
                        this.state.usersRef.child(photoObj.author).child('username').once('value').then(snap => {
                            const exists = (snap.val() !== null);
                            if(exists) data = snap.val();
                            photo_feed.push({
                                id: photo,
                                url: photoObj.url,
                                caption: photoObj.caption,
                                posted: photoObj.posted,
                                author: data
                            })
                            this.setState({
                                refreshing: false,
                                loading: false,
                                photo_feed
                            })
                        }).catch(err => console.log(err));
                    }
            }).catch(err => console.log(err));
    }

    loadNewFeed = () => {
        this.loadFeed();
    }

    pluralaCheck = s => {
        if(s === 1){
            return 'ago'
        }else{
            return 's ago'
        }
    }

    timeConverter = timestamp => {
        const a = new Date(timestamp * 1000);
        const seconds = Math.floor((new Date() - a) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if(interval > 1){
            return interval + ' year' + this.pluralaCheck(interval);
        }

        interval = Math.floor(seconds / 2592000);
        if(interval > 1){
            return interval + ' month' + this.pluralaCheck(interval);
        }

        interval = Math.floor(seconds / 86400);
        if(interval > 1){
            return interval + ' day' + this.pluralaCheck(interval);
        }

        interval = Math.floor(seconds / 3600);
        if(interval > 1){
            return interval + ' hour' + this.pluralaCheck(interval);
        }

        interval = Math.floor(seconds / 60);
        if(interval > 1){
            return interval + ' minute' + this.pluralaCheck(interval);
        }

        return Math.floor(seconds) + ' second' + this.pluralaCheck(interval);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Feed</Text>
                </View>
                {this.state.loading === true ? (
                    <View>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <FlatList 
                        style={styles.feed}
                        refreshing={this.state.refreshing}
                        onRefresh={this.loadNewFeed}
                        data={this.state.photo_feed}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index})=> (
                            <View key={index} style={styles.photoInfoWrapper}>
                                <View style={styles.photoInfo}>
                                    <Text>{this.timeConverter(item.posted)}</Text>
                                    <Text>@{item.author}</Text>
                                </View>
                                <View>
                                    <Image 
                                        source={{uri: item.url}}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={styles.imageBottom}>
                                    <Text>Caption text here...</Text>
                                    <Text style={styles.comments}>View Comment...</Text>
                                </View>
                            </View>
                        )}
                    />
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
    feed: {
        flex: 1,
        backgroundColor: "#eee"
    },
    photoInfoWrapper: {
        width: '100%',
        overflow: 'hidden',
        marginBottom: 5,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    photoInfo: {
        padding: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        resizeMode: 'cover',
        width: '100%',
        height: 275
    },
    imageBottom: {
        padding: 5
    },
    comments: {
        marginTop: 10,
        textAlign: 'center'
    }
})

export default Feed;