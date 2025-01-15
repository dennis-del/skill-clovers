import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import LoginScreen from './screens/LoginScreen';  
import HomeScreen from './screens/HomeScreen';    
import SignUpScreen from './screens/SignUpScreen'; 
import IndexScreen from './screens/IndexScreen';
import CoursePage from './screens/CoursePage';
import PaymentScreen from './screens/PaymentScreen';
import ModuleScreen from './screens/ModuleScreen';
import WebViewPaymentScreen from './screens/WebViewPaymentScreen';
import BottomTabs from './screens/BottomTab';
import ProfileScreen from './screens/ProfileScreen';
import ContactPage from './screens/ContactPage';
import AboutUsPage from './screens/AboutUsPage';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';




const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth(); // Get the user from context

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Index" 
        component={IndexScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Course" 
        component={CoursePage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Module" 
        component={ModuleScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BottomTab" 
        component={BottomTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="WebViewPaymentScreen" 
        component={WebViewPaymentScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Contact" 
        component={ContactPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="About" 
        component={AboutUsPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}