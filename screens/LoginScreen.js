import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { loginApi } from '../services/allApi';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

export default function LoginScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const { login } = useAuth(); // Get login function from AuthContext

  const handleLogin = async () => {
    const { email, password } = userDetails;
    if (!email || !password) {
      alert('Please fill all the details');
      return;
    }

    try {
      const result = await loginApi({ email, password });
      if (result.status === 200) {
        const userData = result.data.user; // Ensure role is part of the response
        login(userData); // Store user including role in AuthContext
        navigation.navigate('Home');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Sign In</Text>

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

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.newUserText}>New user? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#ffffff',
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#1e51fa',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 10,
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
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  newUserText: {
    color: '#000',
    fontSize: 16,
  },
  registerText: {
    color: '#1e51fa',
    fontSize: 16,
  },
});