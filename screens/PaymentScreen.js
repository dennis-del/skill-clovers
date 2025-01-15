import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { checkUserCoursePaymentApi, createOrderApi, getPaymentDetailsApi } from '../services/allApi';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';

export default function PaymentScreen({ route, navigation }) {
  const { courseTitle, description, videoCount, price, courseId, domainId } = route.params;
  const [selectedPayment, setSelectedPayment] = useState('30%');
  const { user } = useAuth();
  const userId = user._id;
  const [hasPaid, setHasPaid] = useState(false);
  const [paidPercentage, setPaidPercentage] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [modules, setModules] = useState([]);

  const calculatePaymentAmount = (percentage) => Math.ceil((price * parseInt(percentage, 10)) / 100);
  const getVideoAccess = (percentage) => {
    if (percentage === 30) return '4';
    if (percentage === 50) return '8';
    if (percentage === 100) return 'all';
    return '0';
  };

  const checkUserCoursePayment = async () => {
    try {
      // Add logging to verify the parameters
      console.log('Checking payment for:', { userId, courseId });
  
      if (!userId || !courseId) {
        console.log('Missing required parameters:', { userId, courseId });
        setHasPaid(false);
        setPaidPercentage(0);
        setPaidAmount(0);
        return;
      }
  
      const response = await checkUserCoursePaymentApi(userId, courseId);
      console.log('Full API Response:', response);
  
      if (response?.data?.success) {
        setHasPaid(true);
        setPaidPercentage(response.data.payment.paidPercentage);
        setPaidAmount(response.data.payment.amountPaid);
      } else {
        setHasPaid(false);
        setPaidPercentage(0);
        setPaidAmount(0);
      }
    } catch (error) {
      console.log('Detailed error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      
      setHasPaid(false);
      setPaidPercentage(0);
      setPaidAmount(0);
    }
  };

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      await checkUserCoursePayment(); // Fetch payment status on login
    };

    fetchPaymentStatus();
  }, [userId]); // Ensure this runs when userId changes

  const fetchModules = async () => {
    try {
      const response = await getPaymentDetailsApi(courseId); // Call your API to get modules
      setModules(response.data.modules || []); // Update the state with the fetched modules
    } catch (error) {
      console.error('Error fetching modules:', error);
      Alert.alert('Error', 'Could not fetch modules. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    try {
      if (user.role === 'admin') {
        navigation.navigate('Module', {
          courseTitle,
          courseId,
          videoAccess: 'all',
        });
        return;
      }

      const paidPercentage = parseInt(selectedPayment.replace('%', ''), 10);
      const amountPaid = calculatePaymentAmount(paidPercentage);

      if (!amountPaid) {
        Alert.alert('Error', 'Invalid payment amount.');
        return;
      }

      const videoAccess = getVideoAccess(paidPercentage);

      const payload = {
        userId,
        courseId,
        domainId,
        amountPaid,
        paidPercentage,
        videoAccess,
      };

      const response = await createOrderApi(payload);
      console.log('Order API Response:', response);

      const { success, orderId, amount } = response.data;

      if (!success || !orderId || !amount) {
        Alert.alert('Error', 'Order creation failed. Please try again.');
        return;
      }

      navigation.navigate('WebViewPaymentScreen', {
        orderId,
        amount,
        userId,
        courseId,
        domainId,
        courseTitle,
      });
    } catch (error) {
      console.error('Buy Now Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleCurrentAccess = async () => {
    try {
      const response = await checkUserCoursePaymentApi(userId, courseId);
  
      if (response.data && response.data.success) {
        const { videoAccess, paidPercentage } = response.data.payment; // Get both videoAccess and paidPercentage
  
        console.log('Video access value:', videoAccess); // Log the video access value
  
        // Check if the user has paid 100%
        if (paidPercentage === 100) {
          navigation.navigate('Module', {
            courseTitle,
            courseId,
            videoAccess: 'all', // Full access if paid 100%
          });
        } else {
          navigation.navigate('Module', {
            courseTitle,
            courseId,
            videoAccess, // Use the retrieved videoAccess value
          });
        }
      } else {
        Alert.alert('Error', 'Unable to retrieve payment details. Please try again.');
      }
    } catch (error) {
      console.error('Error retrieving current access:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleBalancePayment = async () => {
    const remainingAmount = price - paidAmount;
    const payload = {
      userId,
      courseId,
      domainId,
      amountPaid: remainingAmount,
      paidPercentage: 100,
      videoAccess: 'all',
    };

    try {
      const response = await createOrderApi(payload);
      console.log('Balance Payment API Response:', response);

      const { success, orderId, amount } = response.data;

      if (!success || !orderId || !amount) {
        Alert.alert('Error', 'Balance payment failed. Please try again.');
        return;
      }

      navigation.navigate('WebViewPaymentScreen', {
        orderId,
        amount,
        userId,
        courseId,
        domainId,
        courseTitle,
        videoAccess: 'all',
      });
      // After successful payment, re-fetch the payment status
      await checkUserCoursePayment();
    } catch (error) {
      console.error('Balance Payment Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.courseTitle}>{courseTitle}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.separator} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Videos</Text>
          <Text style={styles.detailValue}>{videoCount}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.detailValue}>₹{price}</Text>
        </View>
      </View>
      <View style={styles.separator} />

      {hasPaid && (paidPercentage === 100 || paidPercentage === 30 || paidPercentage === 50) && (
        <TouchableOpacity style={styles.buyButton} onPress={handleCurrentAccess}>
          <Text style={styles.buyButtonText}>Current Access</Text>
        </TouchableOpacity>
      )}

      {hasPaid && (paidPercentage === 30 || paidPercentage === 50) && (
        <TouchableOpacity style={styles.buyButton} onPress={handleBalancePayment}>
          <Text style={styles.buyButtonText}>Pay Balance to {paidPercentage === 30 ? '70%' : '50%'}</Text>
        </TouchableOpacity>
      )}

      {!hasPaid && user.role !== 'admin' && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Payment Option</Text>
          <Picker
            selectedValue={selectedPayment}
            onValueChange={setSelectedPayment}
            style={styles.picker}>
            <Picker.Item label={`30% - ₹${calculatePaymentAmount(30)} Access to 4 Videos`} value="30%" />
            <Picker.Item label={`50% - ₹${calculatePaymentAmount(50)} Access to 8 Videos`} value="50%" />
            <Picker.Item label={`100% - ₹${calculatePaymentAmount(100)} Full Access`} value="100%" />
          </Picker>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasPaid && paidPercentage < 30 && (
        <Text style={styles.errorText}>You have not made any payment yet. Please select a payment option.</Text>
      )}

      {user.role === 'admin' && (
        <TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('Module', { courseTitle, courseId, videoAccess: 'all' })}>
          <Text style={styles.buyButtonText}>Access All Modules</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
    marginTop: 25,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
    marginVertical: 15,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    width: '45 %}',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },  
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e51fa',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  picker: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  buyButton: {
    backgroundColor: '#1e51fa',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 20,
    elevation: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});