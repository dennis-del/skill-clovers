import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { forgotPasswordApi, resetPasswordApi } from '../services/allApi';  // Import your API functions
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isReset, setIsReset] = useState(false); // To toggle between forgot and reset password screen
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Function to handle forgot password (sending reset email)
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    const emailRegex = /^[\w-.]+@[\w-]+\.+[a-z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      const response = await forgotPasswordApi({ email });
      Alert.alert('Success', `A reset password link has been sent to ${email}`);
      setIsReset(true);  // Switch to reset password screen
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link. Please try again later.');
    }
  };

  // Function to handle reset password (actually resetting the password)
  const handleResetPassword = async () => {
    if (!token || !newPassword) {
        Alert.alert('Error', 'Please provide both token and new password.');
        return;
    }

    try {
        const reqBody = {
            token: token,
            password: newPassword // Ensure this key matches what the backend expects
        };
        const response = await resetPasswordApi(reqBody);
        Alert.alert('Success', 'Your password has been successfully reset!');
        navigation.goBack(); // Go back to the login screen or previous screen
    } catch (error) {
        Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isReset ? 'Reset Password' : 'Forgot Password'}</Text>
      <Text style={styles.subtitle}>{isReset ? 'Enter your token and new password' : 'Enter your email to reset your password'}</Text>

      {!isReset ? (
        // Forgot Password Form
        <>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Reset Password Form
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Reset Token"
            placeholderTextColor="#999"
            value={token}
            onChangeText={setToken}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={25} color="#999" marginLeft={-40} marginTop={-10} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});