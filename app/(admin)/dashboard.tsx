import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../../components/common/Card';
import { LoanApplication } from '../../types/loan';
import { useLoanContext } from '../../contexts/LoanContext';
import { Stack } from 'expo-router';

export default function AdminDashboard() {
  const { loanApplications } = useLoanContext();

  const navigateToVerification = (application: LoanApplication) => {
    // TODO: Implement navigation to verification screen
  };

  const getApplicationStatus = (status: LoanApplication['status']) => {
    switch (status) {
      case 'pending':
        return {
          color: '#FFA500',
          text: 'Pending Review'
        };
      case 'approved':
        return {
          color: '#00C851',
          text: 'Approved'
        };
      case 'rejected':
        return {
          color: '#FF1744',
          text: 'Rejected'
        };
      default:
        return {
          color: '#9E9E9E',
          text: 'Unknown'
        };
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Admin Dashboard',
        }}
      />
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Loan Applications</Text>
        
        {loanApplications.map((application) => (
          <TouchableOpacity
            key={application.id}
            style={styles.applicationCard}
            onPress={() => navigateToVerification(application)}
          >
            <Card>
              <View style={styles.applicationInfo}>
                <View style={styles.applicationHeader}>
                  <Text style={styles.userId}>User ID: {application.userId}</Text>
                  <Text style={styles.statusText}>
                    {getApplicationStatus(application.status).text}
                  </Text>
                </View>
                <View style={styles.applicationDetails}>
                  <Text style={styles.label}>Loan Amount:</Text>
                  <Text style={styles.value}>${application.loanAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.applicationDetails}>
                  <Text style={styles.label}>Total Transactions:</Text>
                  <Text style={styles.value}>
                    {application.transactions.length}
                  </Text>
                </View>
                <View style={styles.applicationDetails}>
                  <Text style={styles.label}>Submitted:</Text>
                  <Text style={styles.value}>
                    {new Date(application.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  applicationCard: {
    marginBottom: 16,
  },
  applicationInfo: {
    padding: 16,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  applicationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
