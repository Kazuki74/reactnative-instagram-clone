import React from 'react';
import { Text, FlatList, StyleSheet, View, Image } from 'react-native';

class Feed extends React.Component {
    state = {
        photo_feed: [0,1,2,3,4],
        refreshing: false
    }

    loadNewFeed = () => {
        this.setState({
            refresh: true
        })
        this.setState({
            photo_feed: [5,6,7,8,9],
            refresh: false
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Feed</Text>
                </View>
                <FlatList 
                    style={styles.feed}
                    refreshing={this.state.refreshing}
                    onRefresh={this.loadNewFeed}
                    data={this.state.photo_feed}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index})=> (
                        <View key={index} style={styles.photoInfoWrapper}>
                            <View style={styles.photoInfo}>
                                <Text>sffsfs</Text>
                                <Text>fsfsfsfs</Text>
                            </View>
                            <View>
                                <Image 
                                    source={{uri: "https://source.unsplash.com/random/500x" + Math.floor((Math.random()*800) + 500) }}
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