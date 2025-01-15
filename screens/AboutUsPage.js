import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function AboutUsPage() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clovers Safety Services Pvt. Ltd</Text>
      </View>

      {/* Company Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionText}>
        Clovers Safety Services Private Limited is an ACS- GP
certified ISO 9001:2008 Health and Safety training providing company. Clovers Safety services Pvt.
Ltd is the international representative of International Board of environmental safety and Health
(IBOEHS) – USA, and course provider of , IOSH (UK), DC Psychology certified by American
Institute of Business Psychology courses , IBOEHS, , IOSH, Site-specific Health, Safety,
Environmental, Behavioural safety, leadership and management courses in India, Middle East and
Southeast Asian region.The services also includes Health and Safety Training, Consultancy, Safety
Audit, Safety Risk Assessment, Safety Implementation, Safety Outsourcing Services and Competence
assessment. The company is having its registered office at Cochin, Kerala, India and registered with
the ROC, Govt. of India vide Incorporation Identity Number: U74999KL2010PTC026368. The
company is very proud to have a highly talented workforce with different educational and industrial
backgrounds such as Health and Safety, engineering, medicine, marine studies and international
business studies. The organization is fully committed to comply with its Health and safety policy,
equal opportunity policy, data protection policy & disability and discrimination policy.
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Join us on our journey to revolutionize learning.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    backgroundColor: '#1e51fa',
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  descriptionSection: {
    padding: 20,
    alignItems: 'center',
  },
  companyImage: {
    width: 200,
    height: 100,
    borderRadius: 10,
    marginBottom: -70,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
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
