// screens/TagsScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TagsScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Hide header if not needed, or customize it
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Tags</Text>
            {/* Add content related to tags here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2C3A', // Consistent dark background
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
});

export default TagsScreen;