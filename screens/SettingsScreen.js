// screens/SettingsScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

// Helper component for a single setting item
const SettingItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingItemLeft}>
            <Image source={icon} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <Image
            source={require('../assets/images/arrow-right-gold.png')} // Make sure this icon exists
            style={styles.arrowIcon}
        />
    </TouchableOpacity>
);

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { user } = useUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Hide header as per design
        });
    }, [navigation]);

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Profile Section at Top */}
            <View style={styles.profileSection}>
                <TouchableOpacity
                    style={styles.profileImageContainer}
                    onPress={() => navigateToScreen('ProfileScreen')}
                >
                    {user?.profileImage ? (
                        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Image
                                source={require('../assets/images/account-icon.png')}
                                style={styles.defaultProfileIcon}
                            />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                        {user?.firstName || 'User'} {user?.lastName || ''}
                    </Text>
                    <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
                </View>
            </View>

            {/* Settings Heading */}
            <Text style={styles.heading}>Settings</Text>

            {/* Setting Items */}
            <SettingItem
                icon={require('../assets/images/account-icon.png')}
                label="Account"
                onPress={() => navigateToScreen('AccountScreen')}
            />
            <SettingItem
                icon={require('../assets/images/privacy-settings-icon.png')}
                label="Privacy"
                onPress={() => navigateToScreen('PrivacyScreen')}
            />
            <SettingItem
                icon={require('../assets/images/notifications-icon.png')}
                label="Notifications"
                onPress={() => navigateToScreen('NotificationsScreen')}
            />
            <SettingItem
                icon={require('../assets/images/vault-icon.png')}
                label="Vault"
                onPress={() => navigateToScreen('VaultScreen')}
            />
            <SettingItem
                icon={require('../assets/images/invite-earn-gold-icon.png')}
                label="Loyalty"
                onPress={() => navigateToScreen('LoyaltyScreen')}
            />
            <SettingItem
                icon={require('../assets/images/help-icon.png')}
                label="Help"
                onPress={() => navigateToScreen('HelpScreen')}
            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2C3A', // Dark background
    },
    contentContainer: {
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 20, // Adjust for status bar
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E3D49',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    profileImageContainer: {
        marginRight: 15,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    placeholderImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: '#3A4B5A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    defaultProfileIcon: {
        width: 30,
        height: 30,
        tintColor: '#FFD700',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 3,
    },
    profileEmail: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    heading: {
        fontSize: 32, // Large bold heading
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30, // Space below heading
        marginTop: 20, // Space from top if no other elements
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2E3D49', // Darker card background
        borderRadius: 12, // Rounded corners
        paddingVertical: 18, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        marginBottom: 12, // Space between items
        shadowColor: '#000', // Subtle shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        width: 26, // Icon size
        height: 26,
        marginRight: 15,
        tintColor: '#FFD700', // Gold tint for icons
    },
    settingLabel: {
        fontSize: 18, // Label text size
        color: 'white',
        fontWeight: '500', // Medium weight
    },
    arrowIcon: {
        width: 18, // Arrow size
        height: 18,
        tintColor: '#FFD700', // Gold tint for arrow
    },
});

export default SettingsScreen;