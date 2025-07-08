import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { LoanVerification } from '../../components/admin/LoanVerification';
import { LoanContextProvider } from '../../contexts/LoanContext';
import { Transaction } from '../../types/loan';

interface LoanReviewParams {
  transactions: Transaction[];
  screenshotUri: string;
  loanAmount: number;
}

export default function LoanReviewScreen() {
  const params = useLocalSearchParams<LoanReviewParams>();
  
  if (!params) {
    return null;
  }

  const transactionData = {
    transactions: params.transactions,
    screenshotUrl: params.screenshotUri,
    loanAmount: params.loanAmount,
    userId: 'user123' // TODO: Get actual user ID
  };

  return (
    <LoanContextProvider>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Loan Review',
          }}
        />
        <LoanVerification transactionData={transactionData} />
      </View>
    </LoanContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
