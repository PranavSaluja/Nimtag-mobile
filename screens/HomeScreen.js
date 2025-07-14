import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../components/IconButton'; // Assuming this path
import AuthService from '../authService'; // To get current user info

const HomeScreen = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('Owner'); // Default to "Owner"
    const [userGold, setUserGold] = useState('0.120g eGold'); // Dummy gold balance

    // Hide the default header for HomeScreen
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            // Attempt to get user's display name or use a default
            setUserName(currentUser.displayName || currentUser.email || 'Owner');
            // If you have actual gold balance in Firebase, fetch it here
        }
    }, []);

    const handleProfilePress = () => {
        navigation.navigate('ProfileScreen'); // Navigate to a ProfileScreen for logout
    };

    const handleAddTag = () => {
        navigation.navigate('QR Generator'); // Navigate to your QR Generator Screen
    };

    const handleMyCarTagPress = () => {
        // This could navigate to a specific tag detail screen or directly to QR Generator for editing
        Alert.alert("My Car Tag", "Navigating to My Car Tag details (or QR Generator for editing)");
        navigation.navigate('QR Generator'); // For now, just go to QR Generator
    };

    const handleViewVault = () => {
        Alert.alert("View Vault", "Navigating to eGold vault details.");
        // navigation.navigate('VaultScreen'); // Placeholder for a future Vault screen
    };

    const handleQuickAction = (actionName) => {
        Alert.alert("Quick Action", `"${actionName}" clicked!`);
        // Implement navigation or specific logic here for other quick actions
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Top Bar: Nimtag & Profile Icon */}
            <View style={styles.topBar}>
                <Text style={styles.nimtagLogoText}>Nimtag</Text>
                <TouchableOpacity onPress={handleProfilePress}>
                    <Image
                        source={require('../assets/images/profile-icon.png')} // Replace with actual profile icon
                        style={styles.profileIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Welcome Section */}
            <Text style={styles.welcomeText}>Welcome, {userName}</Text>

            {/* eGold Balance Card */}
            <View style={styles.eGoldCard}>
                <View style={styles.eGoldBalanceRow}>
                    <Image
                        source={require('../assets/images/gold-coin-icon.png')} // Replace with actual gold coin icon
                        style={styles.goldCoinIcon}
                    />
                    <Text style={styles.eGoldAmount}>{userGold}</Text>
                </View>
                <TouchableOpacity style={styles.viewVaultButton} onPress={handleViewVault}>
                    <Text style={styles.viewVaultButtonText}>View Vault</Text>
                </TouchableOpacity>
            </View>

            {/* Your Tags Section */}
            <Text style={styles.sectionTitle}>Your Tags</Text>
            <TouchableOpacity style={styles.tagItemCard} onPress={handleMyCarTagPress}>
                <View style={styles.tagItemLeft}>
                    <Image
                        source={require('../assets/images/qr-code-icon-white.png')} // Replace with QR code icon
                        style={styles.tagIcon}
                    />
                    <View>
                        <Text style={styles.tagName}>My Car Tag</Text>
                        <Text style={styles.tagStats}>Scans this week: 3</Text>
                        <Text style={styles.tagStats}>Last call: 7:20 pm</Text>
                    </View>
                </View>
                <Image
                    source={require('../assets/images/arrow-right-white.png')} // Replace with right arrow icon
                    style={styles.arrowIcon}
                />
            </TouchableOpacity>

            {/* Quick Actions Section */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
                <IconButton
                    icon={require('../assets/images/add-tag-icon.png')} // Plus icon
                    label="Add Tag"
                    onPress={handleAddTag}
                    iconStyle={{ tintColor: '#FFD700' }} // Example tint
                    textStyle={{ color: '#E0E0E0' }}
                    style={styles.quickActionButton}
                />
                <IconButton
                    icon={require('../assets/images/view-analytics-icon.png')} // Bars icon
                    label="View Analytics"
                    onPress={() => handleQuickAction('View Analytics')}
                    iconStyle={{ tintColor: '#FFD700' }}
                    textStyle={{ color: '#E0E0E0' }}
                    style={styles.quickActionButton}
                />
                <IconButton
                    icon={require('../assets/images/privacy-settings-icon.png')} // Lock icon
                    label="Privacy Settings"
                    onPress={() => handleQuickAction('Privacy Settings')}
                    iconStyle={{ tintColor: '#FFD700' }}
                    textStyle={{ color: '#E0E0E0' }}
                    style={styles.quickActionButton}
                />
                <IconButton
                    icon={require('../assets/images/invite-earn-gold-icon.png')} // Gift icon
                    label="Invite & Earn Gold"
                    onPress={() => handleQuickAction('Invite & Earn Gold')}
                    iconStyle={{ tintColor: '#FFD700' }}
                    textStyle={{ color: '#E0E0E0' }}
                    style={styles.quickActionButton}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2C3A', // Dark blue background
    },
    contentContainer: {
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 20, // Adjust for status bar
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    nimtagLogoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    profileIcon: {
        width: 30,
        height: 30,
        tintColor: 'white', // Ensure the icon is visible on dark background
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 25,
    },
    eGoldCard: {
        backgroundColor: '#2E3D49', // Slightly lighter dark blue
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        alignItems: 'flex-start', // Align content to the left
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    eGoldBalanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    goldCoinIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    eGoldAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700', // Gold color
    },
    viewVaultButton: {
        backgroundColor: '#3A4B5C', // Even lighter dark blue for button
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25, // More rounded pill shape
        alignSelf: 'flex-start', // Align button to the left
    },
    viewVaultButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        marginTop: 10,
    },
    tagItemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2E3D49',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    tagItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
        tintColor: 'white', // White QR icon
    },
    tagName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    tagStats: {
        fontSize: 14,
        color: '#A0A0A0', // Light grey for stats
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: 'white', // White arrow
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    quickActionButton: {
        backgroundColor: '#2E3D49',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 5, // Slightly less horizontal padding
        width: '48%', // Two columns with some gap
        marginBottom: 15,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    // Styles for IconButton are in components/IconButton.js, but
    // specific overrides for quick action buttons can be defined here.
});
export default HomeScreen;