import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dummy Home Screen
function HomeScreen() {
  console.log('HomeScreen loaded');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
    </View>
  );
}


// Home Navigation (Single screen for simplicity)
function HomeNavigation() {
  return <HomeScreen />;
}


// Bottom Tab Navigation
export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } 
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#1e51fa',
          height: 70,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#d1d1d1',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
    </Tab.Navigator>
  );
}

// Styles for all screens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
