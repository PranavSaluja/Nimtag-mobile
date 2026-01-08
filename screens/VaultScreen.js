// screens/VaultScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VaultScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Vault',
            headerStyle: { backgroundColor: '#1E2C3A' },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' },
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>eGold Vault</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2C3A',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default VaultScreen;