// navigation/TabNavigator.js (Updated to show profile image in tab icon)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import { useUser } from '../context/UserContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useUser();

  const ProfileTabIcon = ({ focused, size }) => {
    if (user.profileImage) {
      return (
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: focused ? 2 : 0,
          borderColor: focused ? '#2E8B8B' : 'transparent',
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
      <Ionicons 
        name={focused ? 'person' : 'person-outline'} 
        size={size} 
        color={focused ? '#2E8B8B' : '#8E8E93'} 
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2E8B8B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={focused ? '#2E8B8B' : '#8E8E93'} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              size={size} 
              color={focused ? '#2E8B8B' : '#8E8E93'} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;