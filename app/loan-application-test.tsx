import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoanApplicationTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loan Application Test</Text>
      <Text style={styles.subtitle}>This is a test version</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});







