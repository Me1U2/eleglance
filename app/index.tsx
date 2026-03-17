import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    console.log('Get Started button pressed!');
    router.push('/register');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Eleglance</Text>
        <Text style={styles.subtitle}>Microfinance at your fingertips</Text>
      </View>

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Text style={styles.heroText}>🚀 Fast & Secure Loans</Text>
      </View>

      {/* CTA Button - Moved Higher */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.getStartedButton} 
          onPress={handleGetStarted}
          activeOpacity={0.7}
        >
          <Text style={styles.getStartedButtonText}>🚀 Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Assurance */}
      <View style={styles.privacyContainer}>
        <Text style={styles.privacyTitle}>🔒 Your Privacy is Protected</Text>
        <Text style={styles.privacyText}>
          We guarantee that your financial information will never be shared with third parties. 
          Your data is encrypted and stored securely, and we only use it to process your loan application.
        </Text>
      </View>

      {/* Contact Support - Below Privacy - Made Super Visible */}
      <View style={styles.contactSupportSection}>
        <Text style={styles.contactTitle}>📞 NEED HELP? CONTACT SUPPORT</Text>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => {
            console.log('Contact support pressed!');
            alert('Contact us at: acidribobmugisha66@gmail.com\n\nWe will respond within 24 hours!');
          }}
        >
          <Text style={styles.contactButtonText}>📧 CONTACT SUPPORT NOW</Text>
        </TouchableOpacity>
        <Text style={styles.supportEmail}>acidribobmugisha66@gmail.com</Text>
        <Text style={styles.contactSubtext}>Tap the button above to get help!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  topContactButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  topContactText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroImage: {
    width: width * 0.8,
    height: width * 0.6,
  },
  heroText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  privacyText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3e5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: '#6200ee',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    minHeight: 80,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4a00c7',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contactSupportSection: {
    alignItems: 'center',
    marginTop: 15,
    padding: 25,
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#ff0000',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 35,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  contactButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 20,
  },
  supportEmail: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  contactSubtext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
