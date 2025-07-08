import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Transaction } from '../../types/transaction';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'Deposit',
    description: ''
  });

  const handleSubmit = () => {
    if (formData.date && formData.amount) {
      const transaction: Omit<Transaction, 'id'> = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description
      };
      onSubmit(transaction);
      setFormData({
        date: '',
        amount: '',
        type: 'Deposit',
        description: ''
      });
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={formData.date}
          onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={formData.amount}
          onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
          keyboardType="numeric"
        />
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === 'Deposit' && styles.selected
            ]}
            onPress={() => handleTypeChange('Deposit')}
          >
            <Text style={styles.typeText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === 'Withdrawal' && styles.selected
            ]}
            onPress={() => handleTypeChange('Withdrawal')}
          >
            <Text style={styles.typeText}>Withdrawal</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  selected: {
    backgroundColor: '#312651',
    borderColor: '#312651',
  },
  typeText: {
    textAlign: 'center',
    color: '#312651',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: '#312651',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsContainer: {
    marginTop: 20
  },
  transactionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  transactionItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  }
});