import * as React from 'react'
import { StyleSheet, Button, ImageBackground } from 'react-native'
import { View, Text } from '../../components/Themed'

export default function StepTemplate({
    navigation,
    navigationTarget,
    image,
    title,
    subtitle,
}) {
    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}></ImageBackground>
            <View style={styles.bottom}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Button title="Next" onPress={() => navigation.navigate(navigationTarget)}></Button>
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
        fontSize: 15,
    },
    title: {
        fontSize: 20,
    }
});