// screens/AccountScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const AccountScreen = () => {
    const navigation = useNavigation();
    const { user } = useUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Account',
            headerStyle: { backgroundColor: '#1E2C3A' },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' },
        });
    }, [navigation]);

    const navigateToEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        {user.profileImage ? (
                            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Ionicons name="person" size={40} color="#8E8E93" />
                            </View>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity style={styles.editProfileButton} onPress={navigateToEditProfile}>
                    <View style={styles.buttonContent}>
                        <Ionicons name="person-outline" size={24} color="white" />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2C3A',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A3B4A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
    },
    profileImageContainer: {
        marginRight: 15,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    placeholderImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#3A4B5A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#8E8E93',
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2E8B8B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        marginLeft: 12,
    },
});

export default AccountScreen;