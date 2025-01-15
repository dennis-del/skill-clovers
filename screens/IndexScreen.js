import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getAllGoalsApi, getSingleDomainApi } from '../services/allApi'; // Ensure both APIs are imported

export default function IndexScreen({ navigation, route }) {
  const { domainId } = route.params; // Get the domain ID passed from the previous screen
  const [domain, setDomain] = useState(null); // State to store domain details
  const [goals, setGoals] = useState([]); // State to store fetched goals
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Function to fetch domain details
  const fetchDomain = async () => {
    try {
      const response = await getSingleDomainApi(domainId); // Fetch single domain by ID
      setDomain(response.data); // Set domain details
    } catch (error) {
      console.error('Error fetching domain:', error);
    }
  };

  // Function to fetch goals from the backend
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await getAllGoalsApi(); // Call API to fetch goals
      setGoals(response.data); // Update state with goals data
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch both domain and goals when the component mounts
  useEffect(() => {
    if (domainId) {
      fetchDomain();
    }
    fetchGoals();
  }, [domainId]);

  return (
    <View style={styles.container}>
      {domain && (
        <>
          <Image source={{ uri: domain.icon }} style={styles.domainIcon} />
          <Text style={styles.title}>{domain.name}</Text>
        </>
      )}
      <Text style={styles.subTitle}>
        Choose a goal to get started on your journey to success.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <View style={styles.buttonContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal._id}
              style={styles.button}
              onPress={() => 
                navigation.navigate('Course', { goal, domain }) // Navigate to CoursePage with goal and domain
              }
            >
              <Image source={{ uri: goal.icon }} style={styles.iconImage} />
              <Text style={styles.buttonText}>{goal.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 20,
  },
  button: {
    width: '90%',
    height: 70,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 25,
    marginBottom: 30,
    flexDirection: 'row',
    paddingHorizontal: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    marginLeft: 20,
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 60,
  },
  domainIcon: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
