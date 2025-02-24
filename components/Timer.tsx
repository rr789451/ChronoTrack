import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { timerStyles } from '../app/styles/timer.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerProps {
  id: string;
  name: string;
  duration: number;
  halfwayAlert?: boolean;
  initialStatus?: 'idle' | 'running' | 'paused' | 'completed';
  initialTimeRemaining?: number;
  onComplete?: (id: string) => void;
  onStatusChange?: (id: string, status: string, timeRemaining: number) => void;
}

export default function Timer({ 
  id,
  name, 
  duration, 
  halfwayAlert = false,
  initialStatus = 'idle',
  initialTimeRemaining,
  onComplete,
  onStatusChange
}: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    initialTimeRemaining !== undefined ? initialTimeRemaining : duration
  );
  const [status, setStatus] = useState(initialStatus);
  const [halfwayAlertShown, setHalfwayAlertShown] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(1)).current;
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletingRef = useRef(false);
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    const saveTimerState = async () => {
      try {
        const timerState = {
          id,
          status,
          timeRemaining,
          halfwayAlertShown
        };
        await AsyncStorage.setItem(`timer_${id}`, JSON.stringify(timerState));
      } catch (error) {
        console.error('Error saving timer state:', error);
      }
    };
    
    saveTimerState();
    
    if (onStatusChange) {
      onStatusChange(id, status, timeRemaining);
    }
  }, [id, status, timeRemaining, halfwayAlertShown, onStatusChange]);
  
  const progressPercentage = Math.round((timeRemaining / duration) * 100);
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: timeRemaining / duration,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeRemaining, duration, progressAnim]);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (status === 'running' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        
        setTimeRemaining(prev => {
          const newValue = prev - 1;
          
          if (newValue <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            if (!isCompletingRef.current) {
              isCompletingRef.current = true;
              
              setTimeout(() => {
                if (isMountedRef.current) {
                  setStatus('completed');
                  if (onComplete) {
                    try {
                      onComplete(id);
                    } catch (error) {
                      console.error('Error in completion handler:', error);
                    }
                  }
                  isCompletingRef.current = false;
                }
              }, 0);
            }
            
            return 0;
          }
          
          if (halfwayAlert && !halfwayAlertShown && newValue <= Math.floor(duration / 2)) {
            setHalfwayAlertShown(true);
            Alert.alert(
              "Halfway Point",
              `You're halfway through the "${name}" timer!`
            );
          }
          
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, timeRemaining, halfwayAlert, halfwayAlertShown, duration, id, name, onComplete]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleTimer = () => {
    if (status === 'completed') return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Haptic error (non-critical):', error);
    }
    
    setStatus(prev => prev === 'running' ? 'paused' : 'running');
  };
  
  const resetTimer = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.error('Haptic error (non-critical):', error);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimeRemaining(duration);
    setStatus('idle');
    setHalfwayAlertShown(false);
  };
  
  const getBackgroundColor = () => {
    if (status === 'completed') {
      return '#4CAF50'; 
    } else {
      return '#0B4357'; 
    }
  };
  
  return (
    <View style={timerStyles.timerCard}>
      <View style={timerStyles.leftContainer}>
        <Text style={timerStyles.timerName}>{name}</Text>
        {status === 'completed' && (
          <Text style={timerStyles.completedText}>Completed</Text>
        )}
        {status === 'running' && (
          <Text style={timerStyles.runningText}>Running</Text>
        )}
        {status === 'paused' && (
          <Text style={timerStyles.pausedText}>Paused</Text>
        )}
        
        <Text style={timerStyles.timerDigits}>
          {formatTime(timeRemaining)}
        </Text>
        
        <View style={timerStyles.percentageContainer}>
          <View style={timerStyles.progressBarContainer}>
            <Animated.View 
              style={[
                timerStyles.progressBarFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: status === 'completed' ? '#4CAF50' : '#0B4357' 
                }
              ]} 
            />
          </View>
          <Text style={timerStyles.percentageText}>{progressPercentage}%</Text>
        </View>
        
        <View style={timerStyles.statusContainer}>
          <TouchableOpacity 
            style={timerStyles.resetButton} 
            onPress={resetTimer}
          >
            <Text style={timerStyles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[
        timerStyles.rightContainer, 
        { backgroundColor: getBackgroundColor() }
      ]}>
        <TouchableOpacity 
          style={[
            timerStyles.controlButton,
            status === 'completed' && timerStyles.disabledButton
          ]}
          onPress={toggleTimer}
          disabled={status === 'completed'}
        >
          {status === 'running' ? (
            <View style={timerStyles.pauseIcon}>
              <View style={timerStyles.pauseBar} />
              <View style={timerStyles.pauseBar} />
            </View>
          ) : (
            <View style={[
              timerStyles.playIcon,
              status === 'completed' && timerStyles.disabledIcon
            ]} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}