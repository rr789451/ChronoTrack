import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import Timer from '../../components/Timer';
import { homeStyles } from '../styles/home.styles';
import TimerService, { Timer as TimerType, CompletedTimer } from '../../services/TimerService';

export default function HomeScreen() {
  const router = useRouter();
  
  const [timers, setTimers] = useState<TimerType[]>([]);
  const [sections, setSections] = useState<{ title: string; data: TimerType[] }[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [completedTimerId, setCompletedTimerId] = useState<string | null>(null);
  const [completedTimer, setCompletedTimer] = useState<TimerType | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const loadTimers = async () => {
    try {
      const storedTimers = await TimerService.getTimers();
      setTimers(storedTimers);
      
      const categories = Array.from(new Set(storedTimers.map(timer => timer.category)));
      
      const newSections = categories.map(category => ({
        title: category,
        data: storedTimers.filter(timer => timer.category === category)
      }));
      
      setSections(newSections);
      
      setExpandedCategories(new Set(categories));
    } catch (error) {
      console.error('Failed to load timers:', error);
    }
  };
  
  useEffect(() => {
    loadTimers();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadTimers();
    }, [])
  );
  
  const handleTimerComplete = async (timerId: string) => {
    
    try {
      const timer = await TimerService.getTimerById(timerId);
      if (!timer) {
        console.error(`Timer ${timerId} not found`);
        return;
      }
      
      
      const completedTimer: CompletedTimer = {
        id: timer.id,
        name: timer.name,
        category: timer.category,
        duration: timer.duration,
        completedAt: new Date().toISOString()
      };
      
      await TimerService.addTimerToHistory(completedTimer);
      
      const updatedTimer: TimerType = {
        ...timer,
        status: 'completed',
        timeRemaining: 0
      };
      
      await TimerService.updateTimer(updatedTimer);
      
      setCompletedTimer(updatedTimer);
      setCompletedTimerId(timer.id);
      setShowCompletionModal(true);
      
      setTimeout(() => loadTimers(), 300);
    } catch (error) {
      console.error('Failed to handle timer completion:', error);
    }
  };
  
  const handleTimerStatusChange = async (
    id: string, 
    status: string, 
    timeRemaining: number
  ) => {
    try {
      await TimerService.updateTimerState(
        id, 
        status as 'idle' | 'running' | 'paused' | 'completed',
        timeRemaining
      );
    } catch (error) {
      console.error('Failed to update timer state:', error);
    }
  };
  
  const toggleCategory = (category: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    
    if (newExpandedCategories.has(category)) {
      newExpandedCategories.delete(category);
    } else {
      newExpandedCategories.add(category);
    }
    
    setExpandedCategories(newExpandedCategories);
  };
  
  const startCategoryTimers = async (category: string) => {
    try {
      await TimerService.startCategoryTimers(category);
      setTimeout(() => loadTimers(), 500);
    } catch (error) {
      console.error('Failed to start category timers:', error);
      Alert.alert('Error', 'Failed to start timers');
    }
  };
  
  const pauseCategoryTimers = async (category: string) => {
    try {
      await TimerService.pauseCategoryTimers(category);
      setTimeout(() => loadTimers(), 500);
    } catch (error) {
      console.error('Failed to pause category timers:', error);
      Alert.alert('Error', 'Failed to pause timers');
    }
  };
  
  const resetCategoryTimers = async (category: string) => {
    try {
      await TimerService.resetCategoryTimers(category);
      setTimeout(() => loadTimers(), 500);
    } catch (error) {
      console.error('Failed to reset category timers:', error);
      Alert.alert('Error', 'Failed to reset timers');
    }
  };
  
  const renderSectionHeader = ({ section }: { section: { title: string; data: TimerType[] } }) => {
    const isExpanded = expandedCategories.has(section.title);
    
    return (
      <View style={homeStyles.sectionHeader}>
        <View style={homeStyles.sectionTitleContainer}>
          <TouchableOpacity
            style={homeStyles.expandButton}
            onPress={() => toggleCategory(section.title)}
          >
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
          <Text style={homeStyles.sectionTitle}>{section.title}</Text>
          <Text style={homeStyles.timerCount}>{section.data.length} timers</Text>
        </View>
        
        <View style={homeStyles.bulkActions}>
          <TouchableOpacity
            style={homeStyles.bulkActionButton}
            onPress={() => startCategoryTimers(section.title)}
          >
            <Ionicons name="play" size={20} color="#0B4357" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={homeStyles.bulkActionButton}
            onPress={() => pauseCategoryTimers(section.title)}
          >
            <Ionicons name="pause" size={20} color="#0B4357" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={homeStyles.bulkActionButton}
            onPress={() => resetCategoryTimers(section.title)}
          >
            <Ionicons name="refresh" size={20} color="#0B4357" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderTimer = ({ item }: { item: TimerType }) => {
    return (
      <Timer
        id={item.id}
        key={`${item.id}-${item.status}-${item.timeRemaining}`}
        name={item.name}
        duration={item.duration}
        halfwayAlert={item.halfwayAlert}
        initialStatus={item.status}
        initialTimeRemaining={item.timeRemaining}
        onComplete={handleTimerComplete}
        onStatusChange={handleTimerStatusChange}
      />
    );
  };
  
  const renderEmptyList = () => (
    <View style={homeStyles.emptyContainer}>
      <Ionicons name="timer-outline" size={64} color="#ccc" />
      <Text style={homeStyles.emptyTitle}>No Timers Yet</Text>
      <Text style={homeStyles.emptyText}>
        Create your first timer by tapping the button below.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>Timers</Text>
        <TouchableOpacity
          style={homeStyles.addButton}
          onPress={() => router.push('/newTimer')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item, section }) => 
            expandedCategories.has(section.title) ? renderTimer({ item }) : null
          }
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={homeStyles.listContent}
        />
      ) : (
        renderEmptyList()
      )}
      
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={homeStyles.modalOverlay}>
          <View style={homeStyles.modalContent}>
            <Text style={homeStyles.congratsText}>Congratulations!</Text>
            <Text style={homeStyles.timerNameText}>
              You completed: <Text style={homeStyles.highlightText}>{completedTimer?.name}</Text>
            </Text>
            <TouchableOpacity
              style={homeStyles.closeButton}
              onPress={() => setShowCompletionModal(false)}
            >
              <Text style={homeStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}