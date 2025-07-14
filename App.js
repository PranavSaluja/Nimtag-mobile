import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text, View, Platform } from 'react-native'; // Import Image and other components for tab icons

// Import screens
import LoginScreen from './LoginScreen';
import QrGeneratorScreen from './QrGeneratorScreen';
import HomeScreen from './screens/HomeScreen';
import TagsScreen from './screens/TagsScreen';
import RewardsScreen from './screens/RewardsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen'; // For profile and logout

import AuthService from './authService'; // To listen for auth state changes

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator Component
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // We'll handle headers within each screen
                tabBarActiveTintColor: '#FFD700', // Gold color for active tab
                tabBarInactiveTintColor: '#A0A0A0', // Light grey for inactive tab
                tabBarStyle: styles.tabBar, // Apply custom style to tab bar
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconSource;
                    const iconSize = 25; // Consistent icon size

                    if (route.name === 'HomeTab') {
                        iconSource = require('./assets/images/home-tab-icon.png');
                    } else if (route.name === 'TagsTab') {
                        iconSource = require('./assets/images/tags-tab-icon.png');
                    } else if (route.name === 'RewardsTab') {
                        iconSource = require('./assets/images/rewards-tab-icon.png');
                    } else if (route.name === 'SettingsTab') {
                        iconSource = require('./assets/images/settings-tab-icon.png');
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={[
                                styles.tabIcon,
                                { tintColor: focused ? '#FFD700' : '#A0A0A0' } // Apply tint based on focus
                            ]}
                        />
                    );
                },
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="TagsTab"
                component={TagsScreen}
                options={{ tabBarLabel: 'Tags' }}
            />
            <Tab.Screen
                name="RewardsTab"
                component={RewardsScreen}
                options={{ tabBarLabel: 'Rewards' }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{ tabBarLabel: 'Settings' }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null); // Firebase user state

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = AuthService.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) {
        return (
            <View style={appStyles.loadingContainer}>
                <Text style={appStyles.loadingText}>Loading App...</Text>
            </View>
        ); // Or a splash screen component
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? "MainTabs" : "Login"}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="QR Generator" component={QrGeneratorScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#2E3D49', // Dark background for tab bar
        borderTopWidth: 0, // Remove top border
        height: 80, // Adjust height as needed
        paddingBottom: 20, // Padding for text
        paddingTop: 10, // Padding for icons
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
});

const appStyles = StyleSheet.create({ // Styles for the initial loading screen
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2C3A',
    },
    loadingText: {
        color: 'white',
        fontSize: 20,
    },
});