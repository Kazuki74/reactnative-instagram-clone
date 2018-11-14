import React from 'react';
import { Text, FlatList, StyleSheet, View, Image } from 'react-native';

class Feed extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Feed</Text>
                </View>
                <View>
                    <Text>sffsfs</Text>
                    <Text>fsfsfsfs</Text>
                </View>
                <View>
                    <Image 
                        source={{uri: "https://source.unsplash.com/random/500x" + Math.floor((Math.random()*800) + 500) }}
                        style={styles.image}
                    />
                </View>
                <View>
                    <Text>fsfsfs</Text>
                    <Text>fafafsf</Text>
                </View>
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
    image: {
        resizeMode: 'cover',
        width: '100%',
        height: 275
    }
})

export default Feed;