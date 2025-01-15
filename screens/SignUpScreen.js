import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { registerApi } from '../services/allApi';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

export default function SignUpScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9]{8,}@gmail\.com$/; // Regex for the specified email format
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/; // Minimum 6 alphanumeric characters
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    const { username, email, password } = userDetails;

    if (!username || !email || !password) {
      alert("Please fill all the details");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format. Ensure it is at least 8 characters, all lowercase, ending with '@gmail.com'.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 alphanumeric characters.");
      return;
    }

    try {
      const result = await registerApi(userDetails);
      console.log(result);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUserDetails({ ...userDetails, username: text })}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            onChangeText={(text) => setUserDetails({ ...userDetails, password: text })}
            secureTextEntry={!showPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e51fa',
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingLeft: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingLeft: 10,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  button: {
    width: 120,
    height: 50,
    backgroundColor: '#1e51fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});