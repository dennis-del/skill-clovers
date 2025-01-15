import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomTabs from './BottomTab';
import { fetchDomainsApi , addDomainApi , deleteDomainApi , updateDomainApi } from '../services/allApi';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import Icons from 'react-native-vector-icons/FontAwesome';



export default function HomeScreen({ navigation }) {
  const [category, setCategory] = useState('');
  const [domains, setDomains] = useState([]);
  const { user } = useAuth(); // Retrieve user from context
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [newDomain, setNewDomain] = useState({ name: '', icon: '' }); // New domain state
  const [editMode, setEditMode] = useState(false); // Track if it's edit mode
  const [selectedDomain, setSelectedDomain] = useState(null); // Track the domain being edited
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleSave = async () => {
    try {
      if (!newDomain.name || !newDomain.icon) {
        alert('Please fill in both name and icon fields.');
        return;
      }
  
      if (editMode) {
        // Update existing domain
        const response = await updateDomainApi(selectedDomain._id, newDomain);
        if (response) {
          // Update domains list in state
          setDomains((prevDomains) =>
            prevDomains.map((domain) =>
              domain._id === selectedDomain._id ? { ...domain, ...newDomain } : domain
            )
          );
          console.log('Domain updated successfully:', response);
        } else {
          console.error('Failed to update domain.');
        }
      } else {
        // Add new domain
        const response = await addDomainApi(newDomain);
        if (response) {
          // Add new domain to domains list
          setDomains((prevDomains) => [...prevDomains, response]);
          console.log('New domain added successfully:', response);
        } else {
          console.error('Failed to add domain.');
        }
      }
  
      // Reset modal and state
      setNewDomain({ name: '', icon: '' });
      setIsModalVisible(false);
      setEditMode(false);
      setSelectedDomain(null);
    } catch (error) {
      console.error('Error in saving domain:', error);
      alert('Error saving domain. Please try again.');
    }
  };
  



  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetchDomainsApi();
        if (response && Array.isArray(response.data)) {
          setDomains(response.data);
        } else {
          console.error('Failed to fetch domains or invalid data format');
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };

    fetchDomains();
  }, []);

  const handleAddDomain = async () => {
    try {
        if (!newDomain.name || !newDomain.icon) {
            alert('Please fill in both name and icon fields.');
            return;
        }

        // Call the API to save the new domain
        const response = await addDomainApi(newDomain);

        if (response) {
            // Update the domains list with the newly added domain
            setDomains([...domains, response]);

            // Reset the modal and new domain state
            setNewDomain({ name: '', icon: '' });
            setIsModalVisible(false);
            console.log('New domain added successfully:', response);
        } else {
            console.error('Failed to add domain.');
        }
    } catch (error) {
        console.error('Error adding new domain:', error);
        alert('Failed to add domain. Please try again.');
    }
  }

  const handleDeleteDomain = async (id) => {
    try {
        const response = await deleteDomainApi(id);
        if (response) {
            setDomains(domains.filter((domain) => domain._id !== id));
            console.log('Domain deleted successfully:', response);
        } else {
            console.error('Failed to delete domain.');
        }
    } catch (error) {
        console.error('Error deleting domain:', error);
        alert('Error deleting domain. Please try again.');
    }
};


  // Handle Edit Button Click
const handleEditDomain = (domain) => {
  setEditMode(true);
  setSelectedDomain(domain);
  setNewDomain({ name: domain.name, icon: domain.icon });
  setIsModalVisible(true);
};

const handleUpdateDomain = async () => {
  try {
    if (!newDomain.name || !newDomain.icon) {
      alert('Please fill in both name and icon fields.');
      return;
    }

    // Call the API to update the domain
    const response = await updateDomainApi(selectedDomain._id, newDomain);

    if (response) {
      // Update the state with the edited domain
      setDomains((prevDomains) =>
        prevDomains.map((domain) =>
          domain._id === selectedDomain._id ? { ...domain, ...newDomain } : domain
        )
      );

      // Reset modal and state
      setNewDomain({ name: '', icon: '' });
      setEditMode(false);
      setIsModalVisible(false);
      setSelectedDomain(null);
      console.log('Domain updated successfully:', response);
    } else {
      console.error('Failed to update domain.');
      alert('Failed to update domain. Please try again.');
    }
  } catch (error) {
    console.error('Error updating domain:', error);
    alert('Error updating domain. Please try again.');
  }
};

const [searchQuery, setSearchQuery] = useState('');


const filteredDomains = domains.filter((domain) =>
      domain.name &&  domain.name.toLowerCase().includes(searchQuery.toLowerCase())
);


const handleCategoryPress = (category) => {
  const selectedDomain = domains.find((dom) => dom.name === category); // Find the domain object
  if (selectedDomain) {
    console.log(`Category selected: ${category}`);
    navigation.navigate('Index', { domainId: selectedDomain._id }); // Send the domainId
  } else {
    console.error('Domain not found!');
  }
};

const toggleDropdown = () => {
  setDropdownVisible(!isDropdownVisible);
};



  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}>
        <Text style={styles.title}>Select Category</Text>

        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => setIsModalVisible(true)}>
            <Icon name="plus" size={30} color="black" />
          </TouchableOpacity>
        )}

        <Text style={styles.subTitle}>
          Select what you want to learn. You can always change your choice
          later.
        </Text>

      {/* Search Bar and Hamburger Icon */}
<View style={styles.searchContainer}>
  <TextInput 
    style={styles.searchBar} 
    placeholder="Search categories" 
    placeholderTextColor="#aaa"
    onChangeText={(text) => setSearchQuery(text)} // Update search query state 
  />
  <TouchableOpacity style={styles.hamburgerButton} onPress={toggleDropdown}>
    <Icons name="bars" size={24} color="#000" />
  </TouchableOpacity>
</View>

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownItem}  onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.dropdownText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.dropdownText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('About')}>
            <Text style={styles.dropdownText}>About Us</Text>
          </TouchableOpacity>
        </View>
      )}

        {/* Categories Section */}
        <View style={styles.buttonContainer}>
  {filteredDomains.length > 0 ? (
    filteredDomains.map((cat, index) => (
      <View key={index} style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleCategoryPress(cat.name)}>
          {cat.icon ? (
            <Image source={{ uri: cat.icon }} style={styles.iconImage} />
          ) : (
            <Icon name="circle" size={30} color="#fff" style={styles.icon} />
          )}
          <Text style={styles.buttonText}>{cat.name}</Text>
        </TouchableOpacity>

        {user?.role === 'admin' && (
          <View style={styles.adminActionsContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditDomain(cat)}>
              <Icon name="pencil" size={20} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteDomain(cat._id)}>
              <Icon name="trash" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    ))
  ) : (
    <Text style={styles.noCategoriesText}>
      No categories found. Please try again later.
    </Text>
  )}
</View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomTabsContainer}>
        <BottomTabs />
      </View>

      {/* Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => {
    setIsModalVisible(false);
    setEditMode(false);
    setSelectedDomain(null);
    setNewDomain({ name: '', icon: '' });
  }}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
        {editMode ? 'Edit Domain' : 'Add New Domain'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter domain name"
        value={newDomain.name}
        onChangeText={(text) => setNewDomain({ ...newDomain, name: text })}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter icon URL"
        value={newDomain.icon}
        onChangeText={(text) => setNewDomain({ ...newDomain, icon: text })}
        placeholderTextColor="#888"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[
            styles.button,
            editMode ? styles.updateButton : styles.saveButton,
          ]}
          onPress={handleSave}>
          <Text style={styles.buttonText}>{editMode ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setIsModalVisible(false);
            setEditMode(false);
            setSelectedDomain(null);
            setNewDomain({ name: '', icon: '' });
          }}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
  },
  subTitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingLeft: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    position: 'relative', // This allows absolute positioning inside it
    width: '44%',
    height: 80,
    marginBottom: 20,
  },

  button: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 10,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },

  adminActionsContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1, // Ensures buttons are above the domain button
  },
  icon: {
    marginBottom: 5,
  },
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noCategoriesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomTabsContainer: {
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  plusButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1, // Ensure the button is on top of other UI elements
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    marginLeft: 40,
  },
  editButton: {
    padding: 5,
    borderRadius: 5,
    marginLeft: -5,
  },

  deleteButton: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 85,
  },
  updateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  searchBar: {
    flex: 1, // Makes the search bar take the available width
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hamburgerButton: {
    marginLeft: 10,
    padding: 10,
    marginRight: -10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 120,
    right: 60,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: 150,
    height: 127,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
  },
  
});
