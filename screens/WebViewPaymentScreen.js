import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { verifyPaymentApi } from '../services/allApi';

export default function WebViewPaymentScreen({ route, navigation }) {
  const { orderId, amount, userId, courseId, domainId, courseTitle, videoAccess } = route.params;
  const [loading, setLoading] = useState(true);

  // Razorpay WebView URL
  const razorpayURL = `http://192.168.1.3:4007/payment-webview?orderId=${orderId}&amount=${amount}&userId=${userId}&courseId=${courseId}&domainId=${domainId}`;

  console.log('Razorpay WebView URL:', razorpayURL);
  console.log('Video Access:', videoAccess);

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;
    console.log('Navigation URL:', url);

    if (!url) {
      setLoading(false);
      return;
    }

    try {
      if (url.includes('payment-success')) {
        await handlePaymentSuccessFromUrl(url);
      } else if (url.includes('payment-failure')) {
        setLoading(false);
        Alert.alert('Payment Failed', 'The payment was not successful.');
        navigation.goBack();
      } else if (url === razorpayURL) {
        setLoading(false);
        console.warn('Processing is in progress...');
      } else {
        setLoading(false);
        console.warn('Unhandled URL:', url);
        Alert.alert('Error', 'Unexpected behavior encountered. Please contact support if this persists.');
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.error('Error handling navigation state:', error);
      Alert.alert('Error', 'An unexpected error occurred during payment processing.');
      navigation.goBack();
    }
  };

  const handlePaymentSuccessFromUrl = async (url) => {
    try {
      const params = new URLSearchParams(url.split('?')[1]);
      const paymentId = params.get('razorpay_payment_id');
      const orderId = params.get('razorpay_order_id');
      const signature = params.get('razorpay_signature');

      if (paymentId && signature && orderId) {
        console.log('Payment Success:', { paymentId, orderId, signature });
        await handlePaymentSuccess(paymentId, orderId, signature);
      } else {
        setLoading(false);
        Alert.alert('Error', 'Invalid payment success callback.');
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentId, orderId, signature) => {
    try {
      setLoading(true);

      const verificationPayload = {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        amountPaid: amount,
        paidPercentage: videoAccess === 'all' ? 100 : (videoAccess === '8' ? 50 : 30),
        userId: userId,
        courseId: courseId,
        domainId: domainId,
        videoAccess: videoAccess
      };

      console.log('Sending verification payload:', verificationPayload);

      const response = await verifyPaymentApi(verificationPayload);

      console.log('Payment Verification Response:', response);

      if (response.data.success) {
        Alert.alert('Success', 'Payment verified successfully', [{
          text: 'OK',
          onPress: () => {
            navigation.navigate('Module', {
              courseTitle,
              courseId,
              videoAccess: response.data.payment.videoAccess,
              paymentDetails: response.data.payment
            });
          }
        }]);
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Payment Verification Error:', error);
      Alert.alert('Error', error.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <WebView
        source={{ uri: razorpayURL }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message received:', data);
            if (data.status === "success") {
              handlePaymentSuccess(
                data.razorpay_payment_id,
                data.razorpay_order_id,
                data.razorpay_signature
              );
            } else {
              console.warn('Unexpected WebView message:', data);
            }
          } catch (error) {
            setLoading(false);
            console.error('Error processing WebView message:', error);
          }
        }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setLoading(false);
          console.error('WebView error:', nativeEvent);
          Alert.alert(
            'Error',
            'Failed to load payment page. Please try again.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  webview: {
    flex: 1,
  }
});