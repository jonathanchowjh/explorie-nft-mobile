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

const black = '#000'
const styles = StyleSheet.create({
    bottom: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    subtitle: {
        color: black,
        fontSize: 15,
    },
    title: {
        color: black,
        fontSize: 20,
    }
});