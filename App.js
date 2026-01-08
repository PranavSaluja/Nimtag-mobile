// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';

// Import screens
import LoginScreen from './LoginScreen';
import QrGeneratorScreen from './QrGeneratorScreen';
import HomeScreen from './screens/HomeScreen';
import TagsScreen from './screens/TagsScreen';
import TagDetailsScreen from './screens/TagDetailsScreen'; // NEW IMPORT
import RewardsScreen from './screens/RewardsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import setting detail screens
import AccountScreen from './screens/AccountScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import VaultScreen from './screens/VaultScreen';
import LoyaltyScreen from './screens/LoyaltyScreen';
import HelpScreen from './screens/HelpScreen';
import EditProfileScreen from './screens/EditProfileScreen';

import AuthService from './authService';
import { UserProvider, useUser } from './context/UserContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Updated Settings Tab Icon with Profile Image
function SettingsTabIcon({ focused, size }) {
    const { user } = useUser();

    if (user?.profileImage) {
        return (
            <View style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: focused ? 2 : 0,
                borderColor: focused ? '#FFD700' : 'transparent',
                overflow: 'hidden',
            }}>
                <Image
                    source={{ uri: user.profileImage }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: size / 2,
                    }}
                />
            </View>
        );
    }

    return (
        <Image
            source={require('./assets/images/settings-tab-icon.png')}
            style={[
                styles.tabIcon,
                { tintColor: focused ? '#FFD700' : '#A0A0A0' }
            ]}
        />
    );
}

// Bottom Tab Navigator Component
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#A0A0A0',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconSource;

                    if (route.name === 'HomeTab') {
                        iconSource = require('./assets/images/home-tab-icon.png');
                        return (
                            <Image
                                source={iconSource}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? '#FFD700' : '#A0A0A0' }
                                ]}
                            />
                        );
                    } else if (route.name === 'TagsTab') {
                        iconSource = require('./assets/images/tags-tab-icon.png');
                        return (
                            <Image
                                source={iconSource}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? '#FFD700' : '#A0A0A0' }
                                ]}
                            />
                        );
                    } else if (route.name === 'RewardsTab') {
                        iconSource = require('./assets/images/rewards-tab-icon.png');
                        return (
                            <Image
                                source={iconSource}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? '#FFD700' : '#A0A0A0' }
                                ]}
                            />
                        );
                    } else if (route.name === 'SettingsTab') {
                        return <SettingsTabIcon focused={focused} size={size} />;
                    }
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

// Main App Component wrapped with UserProvider
function AppContent() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = AuthService.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    if (initializing) {
        return (
            <View style={appStyles.loadingContainer}>
                <Text style={appStyles.loadingText}>Loading App...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? "MainTabs" : "Login"}>
                {/* Main Screens */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />

                {/* Other screens that can be navigated to from anywhere */}
                <Stack.Screen name="QR Generator" component={QrGeneratorScreen} options={{ headerShown: false }} />
                <Stack.Screen name="TagDetails" component={TagDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />

                {/* SETTING DETAIL SCREENS */}
                <Stack.Screen name="AccountScreen" component={AccountScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
                <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
                <Stack.Screen name="VaultScreen" component={VaultScreen} />
                <Stack.Screen name="LoyaltyScreen" component={LoyaltyScreen} />
                <Stack.Screen name="HelpScreen" component={HelpScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#2E3D49',
        borderTopWidth: 0,
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
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

const appStyles = StyleSheet.create({
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