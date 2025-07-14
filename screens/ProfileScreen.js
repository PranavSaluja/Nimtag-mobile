// screens/ProfileScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../authService';

const ProfileScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Or customize it with a back button
        });
    }, [navigation]);

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        const result = await AuthService.signOut();
                        if (result.success) {
                            navigation.replace('Login'); // Navigate back to LoginScreen
                        } else {
                            Alert.alert('Logout Error', result.error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Profile</Text>
            <Text style={styles.subheading}>User details and account management options go here.</Text>
            <Button title="Logout" onPress={handleLogout} color="#FF6347" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2C3A', // Consistent dark background
        padding: 20,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    subheading: {
        fontSize: 16,
        color: '#A0A0A0',
        textAlign: 'center',
        marginBottom: 40,
    },
});

export default ProfileScreen;