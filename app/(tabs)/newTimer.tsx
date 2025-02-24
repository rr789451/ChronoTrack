import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { newTimerStyles } from '../styles/newTimer.styles';
import TimerService, { Timer } from '../../services/TimerService';

export default function NewTimer() {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [seconds, setSeconds] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      const savedCategories = await TimerService.getCategories();
      setCategories(savedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    
    if (categories.includes(newCategory.trim())) {
      Alert.alert('Error', 'This category already exists');
      return;
    }
    
    try {
      await TimerService.saveCategory(newCategory.trim());
      loadCategories(); 
      setCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
    }
  };
  
  const handleCreateTimer = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name');
      return;
    }
    
    if (!seconds.trim()) {
      Alert.alert('Error', 'Please enter a duration');
      return;
    }
    
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    
    const secs = parseInt(seconds || '0', 10);
    const totalDuration = secs;
    
    if (totalDuration <= 0) {
      Alert.alert('Error', 'Duration must be greater than 0');
      return;
    }
    
    const newTimer: Timer = {
      id: Date.now().toString(),
      name: name.trim(),
      duration: totalDuration,
      category: category,
      halfwayAlert: halfwayAlert,
      status: 'idle',
      timeRemaining: totalDuration
    };
    
    try {
      await TimerService.saveTimer(newTimer);
      Alert.alert('Success', 'Timer created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      resetForm()
    } catch (error) {
      Alert.alert('Error', 'Failed to create timer');
    }
  };

  const resetForm = () => {
    setName('');
    setSeconds('');
    setHalfwayAlert(false);
    setCategory('');
  };
  
  return (
    <SafeAreaView style={newTimerStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={newTimerStyles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={newTimerStyles.scrollContent}>
          <Text style={newTimerStyles.headerTitle}>Create New Timer</Text>
          <View style={newTimerStyles.form}>
            <View style={newTimerStyles.formGroup}>
              <Text style={newTimerStyles.label}>Timer Name</Text>
              <TextInput
                style={newTimerStyles.input}
                placeholder="Enter timer name"
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={newTimerStyles.formGroup}>
              <Text style={newTimerStyles.label}>Duration (in seconds)</Text>
              <View style={newTimerStyles.durationContainer}>
                <View style={newTimerStyles.durationInput}>
                  <TextInput
                    style={newTimerStyles.timeInput}
                    placeholder="00"
                    keyboardType="number-pad"
                    value={seconds}
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      setSeconds(numericText);
                    }}
                  />
                </View>
              </View>
            </View>
            
            <View style={newTimerStyles.formGroup}>
              <Text style={newTimerStyles.label}>Category</Text>
              <TouchableOpacity
                style={newTimerStyles.categorySelect}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={category ? newTimerStyles.categoryText : newTimerStyles.placeholder}>
                  {category || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={newTimerStyles.formGroup}>
              <View style={newTimerStyles.switchContainer}>
                <Text style={newTimerStyles.label}>Halfway Alert</Text>
                <Switch
                  value={halfwayAlert}
                  onValueChange={setHalfwayAlert}
                  trackColor={{ false: '#d1d1d6', true: '#000000' }}
                  thumbColor={halfwayAlert ? '#fff' : '#000'}
                />
              </View>
              <Text style={newTimerStyles.helperText}>
                Receive an alert when the timer reaches halfway point.
              </Text>
            </View>
            
            <TouchableOpacity
              style={newTimerStyles.createButton}
              onPress={handleCreateTimer}
            >
              <Text style={newTimerStyles.createButtonText}>Create Timer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="slide"
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
          >
            <View style={newTimerStyles.modalOverlay}>
              <View style={newTimerStyles.modalContent}>
                <View style={newTimerStyles.modalHeader}>
                  <Text style={newTimerStyles.modalTitle}>Select Category</Text>
                  <TouchableOpacity
                    onPress={() => setShowCategoryModal(false)}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={newTimerStyles.addCategoryContainer}>
                  <TextInput
                    style={newTimerStyles.addCategoryInput}
                    placeholder="Enter new category"
                    value={newCategory}
                    onChangeText={setNewCategory}
                  />
                  <TouchableOpacity
                    style={newTimerStyles.addCategoryButton}
                    onPress={handleAddCategory}
                  >
                    <Text style={newTimerStyles.addCategoryButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                
                {categories.length > 0 ? (
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={newTimerStyles.categoryItem}
                        onPress={() => {
                          setCategory(item);
                          setShowCategoryModal(false);
                        }}
                      >
                        <Text style={newTimerStyles.categoryItemText}>{item}</Text>
                        {category === item && (
                          <Ionicons name="checkmark" size={20} color="#000" />
                        )}
                      </TouchableOpacity>
                    )}
                    style={newTimerStyles.categoriesList}
                  />
                ) : (
                  <Text style={newTimerStyles.noCategoriesText}>
                    No categories yet. Add one above.
                  </Text>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};