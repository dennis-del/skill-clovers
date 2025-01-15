import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker

export default function ContactPage() {
  const openDialer = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openLocation = () => {
    Linking.openURL('https://maps.google.com/?q=Your+Location'); // Replace 'Your+Location' with actual address coordinates or name.
  };

  const companyLocation = {
    latitude: 10.017182594257015,
    longitude: 76.36878866565523,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Contact Us</Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={companyLocation}
          showsUserLocation={false}
        >
          <Marker
            coordinate={companyLocation}
            title="Clovers Safety Pvt Ltd"
          />
        </MapView>
      </View>

      {/* Contact Information */}
      <View style={styles.contactDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={24} color="#1e51fa" />
          <Text style={styles.detailText}>Clovers, Blue Tower, Junction, Kakkavila, Edachira, Kakkanad, Kerala 682030</Text>
        </View>
        <TouchableOpacity style={styles.detailRow} onPress={() => openEmail('info@cloverssafety.com')}>
          <Ionicons name="mail-outline" size={24} color="#1e51fa" />
          <Text style={styles.detailText}>info@cloverssafety.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailRow} onPress={() => openDialer('+919037411373')}>
          <Entypo name="phone" size={24} color="#1e51fa" />
          <Text style={styles.detailText}>+91 9037411373</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>We’re here to help! Feel free to reach out anytime.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    backgroundColor: '#1e51fa',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  mapContainer: {
    width: '90%',
    height: 200,
    marginVertical: 20,
    marginHorizontal: '5%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  contactDetails: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    marginTop: 'auto',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f4f6f9',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
