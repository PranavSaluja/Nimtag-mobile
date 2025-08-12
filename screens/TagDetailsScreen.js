// screens/TagDetailsScreen.js
import React, { useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TagDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tag } = route.params;
    const [tagData, setTagData] = useState(tag);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my ${tagData.tagName}: ${tagData.qrDataString}`,
                url: tagData.qrDataString,
                title: `${tagData.tagName} QR Code`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleDeleteTag = () => {
        Alert.alert(
            'Delete Tag',
            `Are you sure you want to delete "${tagData.tagName}"? This action cannot be undone.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: deleteTag,
                },
            ]
        );
    };

    const deleteTag = async () => {
        try {
            const existingTags = await AsyncStorage.getItem('savedTags');
            let savedTags = existingTags ? JSON.parse(existingTags) : [];

            // Remove the tag
            savedTags = savedTags.filter(t => t.id !== tagData.id);

            await AsyncStorage.setItem('savedTags', JSON.stringify(savedTags));

            Alert.alert('Tag Deleted', `"${tagData.tagName}" has been deleted.`);
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting tag:', error);
            Alert.alert('Error', 'Failed to delete tag. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{tagData.tagName}</Text>
                <View style={styles.placeholder} />
            </View>

            {/* QR Code Section */}
            <View style={styles.qrSection}>
                <View style={styles.qrContainer}>
                    <QRCode
                        value={tagData.qrDataString}
                        size={200}
                        color="black"
                        backgroundColor="white"
                    />
                </View>
                <Text style={styles.qrLabel}>Scan to view details</Text>
            </View>

            {/* Tag Information */}
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Tag Information</Text>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Vehicle Number:</Text>
                    <Text style={styles.infoValue}>{tagData.vehicleNumber}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Owner Name:</Text>
                    <Text style={styles.infoValue}>{tagData.ownerName}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Contact Number:</Text>
                    <Text style={styles.infoValue}>{tagData.contactNumber}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Car Name:</Text>
                    <Text style={styles.infoValue}>{tagData.carName}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Car Color:</Text>
                    <Text style={styles.infoValue}>{tagData.carColor}</Text>
                </View>
            </View>

            {/* Statistics Section */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Statistics</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tagData.scansThisWeek}</Text>
                        <Text style={styles.statLabel}>Scans this week</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{tagData.lastCall}</Text>
                        <Text style={styles.statLabel}>Last call</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Created:</Text>
                    <Text style={styles.infoValue}>{formatDate(tagData.createdAt)}</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareButtonText}>Share QR Code</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTag}>
                    <Text style={styles.deleteButtonText}>Delete Tag</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2C3A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A3B47',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    qrSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    qrLabel: {
        fontSize: 16,
        color: '#B0C4DE',
        marginTop: 15,
    },
    infoSection: {
        backgroundColor: '#2A3B47',
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    statsSection: {
        backgroundColor: '#2A3B47',
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3A4B57',
    },
    infoLabel: {
        fontSize: 14,
        color: '#B0C4DE',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#B0C4DE',
        textAlign: 'center',
    },
    actionSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    shareButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        paddingVertical: 15,
        borderRadius: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default TagDetailsScreen;