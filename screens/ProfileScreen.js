import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { getProfileApi, updateProfileApi } from '../services/allApi';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          console.log('Fetching profile data for user:', user._id);
          const response = await getProfileApi(user._id);
          const profileData = response.data;
          console.log('Profile data fetched:', profileData);

          setUsername(profileData.username || '');
          setEmail(profileData.email || '');
          setPhone(profileData.phone_number || '');
        } catch (error) {
          console.error('Error fetching profile data:', error);
          alert('Failed to fetch profile data. Please try again.');
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    console.log('User logged out.');
    logout();
    navigation.replace('Login');
  };

  const handleSave = async () => {
    const updatedDetails = {
      userId: user._id,
      username,
      email,
      phone_number: phone,
    };

    console.log('Attempting to save updated profile:', updatedDetails);

    try {
      const response = await updateProfileApi(user._id, updatedDetails);
      console.log('Update profile response:', response.data);

      if (response.data) {
        alert('Profile updated successfully!');
      } else {
        alert('No response received from the server.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      alert(`Failed to update profile. ${error.response?.data?.message || 'Please try again later.'}`);
    }
  };

  const getInitials = () => {
    if (!username) return 'U'; // Default initial if no username
    const names = username.split(' ');
    const firstInitial = names[0]?.charAt(0).toUpperCase() || '';
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Profile Initials */}
      <View style={styles.profileInitialsContainer}>
        <Text style={styles.profileInitialsText}>{getInitials()}</Text>
      </View>

      {/* Editable User Info */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(text) => {
            console.log('Username changed:', text);
            setUsername(text);
          }}
          placeholder="Enter your username"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            console.log('Email changed:', text);
            setEmail(text);
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={(text) => {
            console.log('Phone number changed:', text);
            setPhone(text);
          }}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff4d4f',
    padding: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    top: 20,
  },
  profileInitialsContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1e51fa',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 20,
  },
  profileInitialsText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#1e51fa',
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
