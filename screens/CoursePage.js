import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import { addCourseApi, getAllCoursesApi, deleteCourseApi, updateCourseApi , getSingleGoalApi } from '../services/allApi';

export default function CoursePage({ navigation, route }) {
  const { goal, domain } = route.params; // Get goal and domain from navigation params
  const { user } = useAuth(); // Retrieve user from context

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    videoCount: '',
    price: '',
  });
  const [courses, setCourses] = useState([]); // State for storing fetched courses
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [goalDetails, setGoalDetails] = useState(null); // State to store single goal details
  const [editingCourse, setEditingCourse] = useState(null); // State for the course being edited


  // Fetch single goal details
  const fetchGoalDetails = async () => {
    setLoading(true);
    try {
      const response = await getSingleGoalApi(goal._id); // Replace with the correct API call
      setGoalDetails(response.data); // Set goal details
    } catch (error) {
      console.error('Error fetching goal details:', error);
      Alert.alert('Error', 'Failed to fetch goal details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for the selected goal
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCoursesApi(goal._id, domain._id); // Replace with the correct API call
      if (response && response.status === 200) {
        setCourses(response.data); // Assuming response.data contains courses
      } else {
        Alert.alert('Error', 'Failed to fetch courses.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'An error occurred while fetching courses.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (goal && goal._id && domain && domain._id) {
      fetchGoalDetails();
      fetchCourses();
    }
  }, [goal, domain]);
  
  

  const handleCoursePress = (course) => {
    navigation.navigate('Payment', {
      courseTitle: course.title,
      description: course.description,
      videoCount: course.videoCount,
      price: course.price,
      courseId: course._id, // Include courseId for backend operations
      domainId: course.domainId, // Include domainId if needed
    });
  };

  const handleAddCourse = async () => {
    if (!courseDetails.title || !courseDetails.description || !courseDetails.videoCount || !courseDetails.price) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const reqBody = {
        ...courseDetails,
        videoCount: parseInt(courseDetails.videoCount, 10),
        price: parseInt(courseDetails.price, 10),
        domainId: domain._id,
        goalId: goal._id,
      };

      const response = await addCourseApi(reqBody);
      if (response && response.status === 200) {
        Alert.alert('Success', 'Course added successfully!');
        setIsModalVisible(false);
        setCourses([...courses, response.data]); // Add the new course to the list
      } else {
        Alert.alert('Error', response.message || 'Failed to add course.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    console.log("Deleting course with ID:", id); // Debugging log
    try {
      const response = await deleteCourseApi(id);
      console.log("Delete response:", response); // Debugging log
      if (response.status === 200) {
        Alert.alert("Success", "Course deleted successfully!");
        setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
      } else {
        Alert.alert("Error", response.message || "Failed to delete the course.");
      }
    } catch (error) {
      console.error("Delete course error:", error);
      Alert.alert("Error", "An error occurred while deleting the course.");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course); // Set the course to edit
    setCourseDetails({
      title: course.title,
      description: course.description,
      videoCount: String(course.videoCount), // Convert to string for TextInput
      price: String(course.price),
    });
    setIsModalVisible(true); // Open the modal
  };

  const handleUpdateCourse = async () => {
    if (!courseDetails.title || !courseDetails.description || !courseDetails.videoCount || !courseDetails.price) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    try {
      const reqBody = {
        title: courseDetails.title,
        description: courseDetails.description,
        videoCount: parseInt(courseDetails.videoCount, 10),
        price: parseInt(courseDetails.price, 10),
      };
  
      const response = await updateCourseApi(editingCourse._id, reqBody); // Use editingCourse ID
      if (response && response.status === 200) {
        Alert.alert('Success', 'Course updated successfully!');
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editingCourse._id ? { ...course, ...reqBody } : course
          )
        );
        setIsModalVisible(false);
        setEditingCourse(null); // Reset editing course
      } else {
        Alert.alert('Error', response.message || 'Failed to update course.');
      }
    } catch (error) {
      console.error('Update course error:', error);
      Alert.alert('Error', 'An error occurred while updating the course.');
    }
  };
  
  
  

  if (!domain || !domain.name) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Domain data is missing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courses for {domain.name}</Text>

      {user?.role === 'admin' && (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Icon name="plus" size={30} color="black" />
        </TouchableOpacity>
      )}

<ScrollView contentContainerStyle={styles.courseContainer}>
  {loading ? (
    <Text style={styles.loadingText}>Loading courses...</Text>
  ) : courses.length > 0 ? (
    courses.map((course) => (
      <View key={course._id} style={styles.courseItem}>
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleEditCourse(course)} // Handle edit
          >
            <Icon name="edit" size={25} color="#333" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.courseButton}
          onPress={() => handleCoursePress(course)}
        >
          <Text style={styles.courseButtonText}>{course.title}</Text>
        </TouchableOpacity>
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteCourse(course._id)} // Handle delete
          >
            <Icon name="trash" size={25} color="red" />
          </TouchableOpacity>
        )}
      </View>
    ))
  ) : (
    <Text style={styles.noCoursesText}>No courses available for this domain.</Text>
  )}
</ScrollView>



      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
  {editingCourse ? 'Edit Course' : 'Add New Course'}
</Text>

            <TextInput
              style={styles.input}
              placeholder="Course Title"
              value={courseDetails.title}
              onChangeText={(text) => setCourseDetails({ ...courseDetails, title: text })}
            />

<TextInput
  style={[styles.input, styles.textArea]}
  placeholder="Description"
  multiline={true} // Enable multiline input
  numberOfLines={4} // Set initial visible lines
  textAlignVertical="top" // Align text at the top
  value={courseDetails.description}
  onChangeText={(text) => setCourseDetails({ ...courseDetails, description: text })}
/>

            <TextInput
              style={styles.input}
              placeholder="Number of Videos"
              keyboardType="numeric"
              value={courseDetails.videoCount}
              onChangeText={(text) => setCourseDetails({ ...courseDetails, videoCount: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={courseDetails.price}
              onChangeText={(text) => setCourseDetails({ ...courseDetails, price: text })}
            />

            <View style={styles.modalButtonContainer}>
            <TouchableOpacity
  style={styles.saveButton}
  onPress={editingCourse ? handleUpdateCourse : handleAddCourse}
>
  <Text style={styles.saveButtonText}>
    {editingCourse ? 'Update' : 'Save'}
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.cancelButton}
  onPress={() => {
    setIsModalVisible(false);
    setEditingCourse(null);
    setCourseDetails({ title: '', description: '', videoCount: '' }); // Reset fields
  }}
>
  <Text style={styles.cancelButtonText}>Cancel</Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  plusButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  courseContainer: {
    paddingBottom: 20,
    marginTop: 50,
  },
  courseItem: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Vertically align items
    marginBottom: 15,
  },
  iconButton: {
    width: 40, // Fixed width for icons
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseButton: {
    flex: 1, // Take up the remaining space
    backgroundColor: '#1e51fa',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  courseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#1e51fa',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noCoursesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  textArea: {
    height: 100, // Set an initial height
    paddingVertical: 10, // Add padding for comfort
  },  
});
