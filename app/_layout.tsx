import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0B4357',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            borderTopWidth: 1,
            borderTopColor: '#e1e4e8',
          },
        }}
      >
        <Tabs.Screen
          name="(tabs)/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/newTimer"
          options={{
            title: 'Add Timer',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}