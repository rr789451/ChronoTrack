import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
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
  const firstRenderRef = useRef(true);
  const isMountedRef = useRef(true);
  
  const [timeRemaining, setTimeRemaining] = useState(
    initialTimeRemaining !== undefined ? initialTimeRemaining : duration
  );
  const [status, setStatus] = useState(initialStatus);
  const [halfwayAlertShown, setHalfwayAlertShown] = useState(false);
  
  const [progressPercentage, setProgressPercentage] = useState(
    initialTimeRemaining !== undefined 
      ? Math.min(100, Math.max(0, (initialTimeRemaining / duration) * 100)) 
      : 100
  );
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletingRef = useRef(false);
  const lastSyncedState = useRef({
    status: initialStatus,
    timeRemaining: initialTimeRemaining !== undefined ? initialTimeRemaining : duration
  });
  
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      
      setStatus(initialStatus);
      setTimeRemaining(initialTimeRemaining !== undefined ? initialTimeRemaining : duration);
      setProgressPercentage(
        initialTimeRemaining !== undefined 
          ? Math.min(100, Math.max(0, (initialTimeRemaining / duration) * 100))
          : 100
      );
      
      lastSyncedState.current = {
        status: initialStatus,
        timeRemaining: initialTimeRemaining !== undefined ? initialTimeRemaining : duration
      };
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!firstRenderRef.current) {
      const statusChanged = initialStatus !== lastSyncedState.current.status;
      const timeChanged = initialTimeRemaining !== undefined && initialTimeRemaining !== lastSyncedState.current.timeRemaining;
      
      if (statusChanged && initialStatus === 'idle') {
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setStatus('idle');
        setTimeRemaining(duration);  
        setProgressPercentage(100);  
        setHalfwayAlertShown(false);
        
        lastSyncedState.current = {
          status: 'idle',
          timeRemaining: duration
        };
      } 
      else if (statusChanged) {
        setStatus(initialStatus);
        lastSyncedState.current.status = initialStatus;
      }
    }
  }, [initialStatus, initialTimeRemaining, id, duration]);

  useEffect(() => {
    
    if (initialStatus !== undefined && initialStatus !== status) {
      setStatus(initialStatus);
    }
    
    if (initialTimeRemaining !== undefined && initialTimeRemaining !== timeRemaining) {
      setTimeRemaining(initialTimeRemaining);
      
      const newProgressPercentage = Math.min(100, Math.max(0, (initialTimeRemaining / duration) * 100));
      setProgressPercentage(newProgressPercentage);
    }
  }, [initialStatus, initialTimeRemaining, id]);
  
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
      let lastUpdateTime = Date.now();
      let elapsedSinceLastSecond = 0;
      
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        
        const now = Date.now();
        const deltaTime = now - lastUpdateTime;
        lastUpdateTime = now;
        
        elapsedSinceLastSecond += deltaTime;
        
        const exactProgress = (timeRemaining - elapsedSinceLastSecond / 1000) / duration * 100;
        const boundedProgress = Math.min(100, Math.max(0, exactProgress));
        setProgressPercentage(boundedProgress);
        
        if (elapsedSinceLastSecond >= 1000) {
          elapsedSinceLastSecond = elapsedSinceLastSecond % 1000;
          
          setTimeRemaining(prev => {
            const newValue = prev - 1;
            
            if (newValue <= 0) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              
              setProgressPercentage(0);
              
              if (!isCompletingRef.current) {
                isCompletingRef.current = true;

                setStatus('completed');
                
                setTimeout(() => {
                  if (isMountedRef.current) {
                    if (onComplete) {
                      try {
                        onComplete(id);
                      } catch (error) {
                        console.error('Error in completion handler:', error);
                      }
                    }
                    isCompletingRef.current = false;
                  }
                }, 100);
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
        }
      }, 33); 
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, halfwayAlert, halfwayAlertShown, duration, id, name, onComplete, timeRemaining]);
  
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
    
    const newStatus = status === 'running' ? 'paused' : 'running';
    setStatus(newStatus);
    
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
    
    setStatus('idle');
    setTimeRemaining(duration);
    setProgressPercentage(100);
    setHalfwayAlertShown(false);
    
    
    lastSyncedState.current = {
      status: 'idle',
      timeRemaining: duration
    };
    
    const saveResetState = async () => {
      try {
        await AsyncStorage.setItem(`timer_${id}`, JSON.stringify({
          id,
          status: 'idle',
          timeRemaining: duration,
          halfwayAlertShown: false
        }));
      } catch (error) {
        console.error('Error directly saving reset state:', error);
      }
    };
    saveResetState();
  };
  
  const getBackgroundColor = () => {
    if (status === 'completed') {
      return '#4CAF50'; 
    } else {
      return '#0B4357'; 
    }
  };

  const displayProgressPercentage = Math.round(progressPercentage);
  
  return (
    <View style={timerStyles.timerCard}>
      <View style={timerStyles.leftContainer}>
        <Text style={timerStyles.timerName}>{name}</Text>
        
        {status === 'completed' && (
          <Text style={timerStyles.completedText}>Completed</Text>
        )}
        {status === 'running' && (
          <Text style={[timerStyles.completedText, { color: '#0B4357' }]}>Running</Text>
        )}
        {status === 'paused' && (
          <Text style={[timerStyles.completedText, { color: '#FFA500' }]}>Paused</Text>
        )}
        
        <Text style={timerStyles.timerDigits}>
          {formatTime(timeRemaining)}
        </Text>
        
        <View style={timerStyles.percentageContainer}>
          <View style={timerStyles.progressBarContainer}>
            <View 
              style={[
                timerStyles.progressBarFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: status === 'completed' ? '#4CAF50' : '#0B4357' 
                }
              ]} 
            />
          </View>
          <Text style={timerStyles.percentageText}>{displayProgressPercentage}%</Text>
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