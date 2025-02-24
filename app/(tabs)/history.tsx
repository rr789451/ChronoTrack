import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Share,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { historyStyles } from '../styles/history.styles';
import TimerService, { CompletedTimer } from '../../services/TimerService';

export default function HistoryScreen() {
  const [history, setHistory] = useState<CompletedTimer[]>([]);
  
  const loadHistory = async () => {
    try {
      const timerHistory = await TimerService.getTimerHistory();
      setHistory(timerHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };
  
  useEffect(() => {
    loadHistory();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );
  
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all timer history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await TimerService.clearTimerHistory();
              loadHistory();
            } catch (error) {
              console.error('Failed to clear history:', error);
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const exportHistory = async () => {
    if (history.length === 0) {
      Alert.alert('No Data', 'There is no history data to export.');
      return;
    }
    
    try {
      const historyJson = JSON.stringify(history, null, 2);
      const fileName = `timer_history_${new Date().toISOString().slice(0, 10)}.json`;
      
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, historyJson);
        
        if (Platform.OS === 'ios') {
          await Sharing.shareAsync(fileUri);
        } else {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            Alert.alert('Error', 'Sharing is not available on this device');
          }
        }
      } else {
        const blob = new Blob([historyJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export history:', error);
      Alert.alert('Error', 'Failed to export history data');
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins < 60) {
      return `${mins}m ${secs}s`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m ${secs}s`;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const renderHistoryItem = ({ item }: { item: CompletedTimer }) => (
    <View style={historyStyles.historyItem}>
      <View style={historyStyles.historyDetails}>
        <Text style={historyStyles.historyTitle}>{item.name}</Text>
        <Text style={historyStyles.historyCategory}>{item.category}</Text>
        <Text style={historyStyles.historyTime}>
          Duration: {formatTime(item.duration)}
        </Text>
        <Text style={historyStyles.historyDate}>
          Completed: {formatDate(item.completedAt)}
        </Text>
      </View>
      <View style={historyStyles.checkmarkContainer}>
        <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
      </View>
    </View>
  );
  
  const renderEmptyList = () => (
    <View style={historyStyles.emptyContainer}>
      <Ionicons name="list-outline" size={64} color="#ccc" />
      <Text style={historyStyles.emptyTitle}>No History Yet</Text>
      <Text style={historyStyles.emptyText}>
        Completed timers will appear here.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={historyStyles.container}>
      <View style={historyStyles.header}>
        <Text style={historyStyles.headerTitle}>Timer History</Text>
        <View style={historyStyles.headerButtons}>
          {history.length > 0 && (
            <>
              <TouchableOpacity 
                style={historyStyles.headerButton}
                onPress={exportHistory}
              >
                <Ionicons name="download-outline" size={22} color="#0B4357" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={historyStyles.headerButton}
                onPress={handleClearHistory}
              >
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item) => `${item.id}-${item.completedAt}`}
        renderItem={renderHistoryItem}
        contentContainerStyle={historyStyles.listContent}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
}