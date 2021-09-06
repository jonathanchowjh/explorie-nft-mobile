import * as React from 'react'
import { StyleSheet, Button, ImageBackground } from 'react-native'
import { View, Text } from '../../components/Themed'
import { RootTabScreenProps } from '../../types'
import explorerImage from '../../assets/images/exploreeveryday.png'

export default function SecondStepScreen({ navigation }: RootTabScreenProps<'Step2'>) {
    return (
        <View style={styles.container}>
            <ImageBackground source={explorerImage} resizeMode="cover" style={styles.image}></ImageBackground>
            <View style={styles.bottom}>
                <Text style={styles.title}>Venture out your door to collect NFTs</Text>
                <Text style={styles.subtitle}>Enjoy a quick stroll through the neighbourhood</Text>
                <Button title="Next" onPress={() => console.log()}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        color: 'black',
    },
    subtitle: {
        fontSize: 15,
        color: 'black',
    },
    image: {
        flex: 1,
        justifyContent: "center"
    }
});