import * as React from 'react'
import { StyleSheet, Button, Image } from 'react-native'
import { View, Text } from '../../components/Themed'
import logo from '../../assets/images/logo-label.png'
import { RootTabScreenProps } from '../../types'

export default function FirstStepScreen({ navigation }: RootTabScreenProps<'Step1'>) {
    return (
        <View style={styles.container}>
            <Image source={logo}></Image>
            <Text style={styles.subtitle}>Explore the world, one NFT at a time</Text>
            <View style={styles.footer}>
                <Button title="Next" onPress={() => navigation.navigate('Step2')}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        padding: 15,
        backgroundColor: 'white',
        color: '#FF0000'
    }
});