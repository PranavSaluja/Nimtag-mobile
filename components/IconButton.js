import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, Platform } from 'react-native';

const IconButton = ({ icon, label, onPress, style, textStyle, iconStyle }) => {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Image source={icon} style={[styles.icon, iconStyle]} />
            <Text style={[styles.label, textStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8, // Adjust as needed
    },
    icon: {
        width: 35, // Default icon size
        height: 35,
        marginBottom: 5,
        tintColor: '#E0E0E0', // Default light gray color for icons
    },
    label: {
        fontSize: 12,
        color: '#E0E0E0', // Default light gray color for labels
        textAlign: 'center',
    },
});

export default IconButton;