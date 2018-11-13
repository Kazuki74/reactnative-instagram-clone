import React from 'react';
import { Text, FlatList, StyleSheet, View, Image } from 'react-native';

class Profile extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Hello, World!</Text>
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



export default Profile;