// screens/TagsScreen.js
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TagsScreen = () => {
    const navigation = useNavigation();
    const [savedTags, setSavedTags] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Load saved tags when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadSavedTags();
        }, [])
    );

    const loadSavedTags = async () => {
        try {
            const tags = await AsyncStorage.getItem('savedTags');
            if (tags) {
                setSavedTags(JSON.parse(tags));
            }
        } catch (error) {
            console.error('Error loading saved tags:', error);
        }
    };

    const handleTagPress = (tag) => {
        navigation.navigate('TagDetails', { tag });
    };

    const renderTagItem = ({ item }) => (
        <TouchableOpacity
            style={styles.tagCard}
            onPress={() => handleTagPress(item)}
        >
            <View style={styles.tagContent}>
                <Text style={styles.tagName}>{item.tagName}</Text>
                <Text style={styles.tagScans}>Scans this week: {item.scansThisWeek || 0}</Text>
                <Text style={styles.tagLastCall}>Last call: {item.lastCall || 'Never'}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Tags Saved</Text>
            <Text style={styles.emptySubText}>
                Create your first tag by tapping the + button above
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.heading}>Your Tags</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('QR Generator')}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Tags List */}
            <View style={styles.content}>
                {savedTags.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={savedTags}
                        renderItem={renderTagItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2C3A',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E2C3A',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    tagCard: {
        backgroundColor: '#2A3B47',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A4B57',
    },
    tagContent: {
        flex: 1,
    },
    tagName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    tagScans: {
        fontSize: 14,
        color: '#B0C4DE',
        marginBottom: 4,
    },
    tagLastCall: {
        fontSize: 14,
        color: '#B0C4DE',
    },
    arrow: {
        fontSize: 24,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 16,
        color: '#B0C4DE',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default TagsScreen;