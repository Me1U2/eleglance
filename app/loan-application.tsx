import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { prisma } from '../lib/prisma';

// Define form values type
type FormValues = {
  loanType: 'personal' | 'business';
  transactions: Array<{
    amount: string;
    type: 'credit' | 'debit';
    description?: string;
  }>;
};

const transactionSchema = yup.object().shape({
  amount: yup
    .string()
    .required('Amount is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  type: yup
    .string()
    .oneOf(['credit', 'debit'] as const, 'Invalid transaction type')
    .required('Transaction type is required'),
  description: yup.string(),
});

const schema = yup.object<FormValues>().shape({
  loanType: yup
    .string()
    .oneOf(['personal', 'business'] as const, 'Invalid loan type')
    .required('Loan type is required'),
  transactions: yup
    .array()
    .of(transactionSchema)
    .min(5, 'You must enter at least 5 transactions')
    .max(5, 'Maximum 5 transactions allowed')
    .required('Transactions are required'),
});

export default function LoanApplication() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Array<{
    amount: string;
    type: 'credit' | 'debit';
    description?: string;
  }>>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      loanType: 'personal' as const,
      transactions: Array(5).fill({
        amount: '',
        type: 'credit' as const,
        description: '',
      }),
    },
  });

  const { fields } = useFieldArray<FormValues>({
    control,
    name: 'transactions',
  });

  const watchedTransactions = watch('transactions');
  
  useEffect(() => {
    updateRecentTransactions(watchedTransactions);
  }, [watchedTransactions]);

  const updateRecentTransactions = (transactions: Array<{ amount: string; type: 'credit' | 'debit'; description?: string }>) => {
    setRecentTransactions(transactions.filter(t => t.amount && t.amount.trim() !== ''));
  };

  const handleImageSelect = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photo library to upload a screenshot');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('🚀 Image selected:', imageUri);
        
        // Set image immediately
        setScreenshotUri(imageUri);
        Alert.alert('Image Selected', 'Image selected successfully!');
        
        // Start upload simulation immediately
        console.log('🚀 Starting upload simulation...');
        setIsUploading(true);
        Alert.alert('Upload Started', 'Uploading image to Cloudinary...');
        
        // Upload to real Cloudinary
        try {
          const cloudinaryUrl = await uploadToCloudinary(imageUri);
          setCloudinaryUrl(cloudinaryUrl);
          setIsUploading(false);
          Alert.alert('Upload Success', `Image uploaded successfully!\nURL: ${cloudinaryUrl.substring(0, 50)}...`);
        } catch (error) {
          console.error('Upload failed:', error);
          setIsUploading(false);
          Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
        }
        
      } else {
        console.log('Image selection cancelled');
        Alert.alert('Cancelled', 'Image selection was cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    try {
      // Your Cloudinary credentials
      const cloudName = 'do6y5mhg6';
      const uploadPreset = 'eleglance_upload'; // Your actual upload preset
      
      console.log('🚀 Uploading to Cloudinary...');
      console.log('Cloud name:', cloudName);
      console.log('Upload preset:', uploadPreset);
      console.log('Image URI:', uri);
      
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: `screenshot_${Date.now()}.jpg`,
      } as any);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cloudinary upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ SUCCESS! Image uploaded to Cloudinary:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const calculateNetCashFlow = (transactions: Array<{ amount: string; type: 'credit' | 'debit' }>) => {
    return transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount) || 0;
      return transaction.type === 'credit' ? sum + amount : sum - amount;
    }, 0);
  };

  const onSubmit = async (formData: FormValues) => {
    console.log('Loan application submitted with data:', formData);
    console.log('User ID:', userId);
    console.log('Screenshot URI:', screenshotUri);
    
    if (!screenshotUri) {
      Alert.alert('Error', 'Please upload a screenshot of your mobile money transactions');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

    // Convert form data to the expected type
    const data = {
      ...formData,
      transactions: formData.transactions.map(transaction => ({
        ...transaction,
        amount: transaction.amount.toString(),
        type: transaction.type as 'credit' | 'debit',
        date: new Date().toISOString(),
      })),
    };

    setIsSubmitting(true);

    try {
      // Upload screenshot
      const screenshotUrl = await uploadToCloudinary(screenshotUri);
      
        // Calculate net cash flow
        const netCashFlow = data.transactions.reduce((sum, transaction) => {
          const amount = parseFloat(transaction.amount) || 0;
          return transaction.type === 'credit' ? sum + amount : sum - amount;
        }, 0);
        
        // Determine loan eligibility
        const isEligible = data.loanType === 'personal' 
          ? netCashFlow >= 50000 
          : netCashFlow >= 500000;
        
        const loanAmount = data.loanType === 'personal' ? 50000 : 500000;
        
        // Create loan in mock database
        const loan = await prisma.loan.create({
          data: {
            amount: loanAmount,
            loanType: data.loanType,
            status: isEligible ? 'approved' : 'rejected',
            userId,
            screenshotUrl,
            netCashFlow,
          },
        });
        
        // Create transactions in mock database
        await Promise.all(
          data.transactions.map(transaction =>
            prisma.transaction.create({
              data: {
                amount: parseFloat(transaction.amount) || 0,
                type: transaction.type,
                date: new Date(),
                description: transaction.description || 'Mobile Money Transaction',
                userId,
              },
            })
          )
        );
        
        const result = {
          isEligible,
          netCashFlow,
          message: isEligible ? 'Loan approved!' : 'Loan rejected - insufficient cash flow'
        };

      // Show result
      const status = result.isEligible ? 'APPROVED' : 'REJECTED';
      const reason = result.isEligible 
        ? `Your net cash flow of Ugx ${result.netCashFlow.toLocaleString()} meets our requirements!`
        : `Your net cash flow of Ugx ${result.netCashFlow.toLocaleString()} is below our minimum requirement of Ugx ${data.loanType === 'personal' ? '50,000' : '500,000'}`;

      Alert.alert(
        `Loan Application ${status}`,
        `${reason}\n\nLoan Amount: Ugx ${data.loanType === 'personal' ? '50,000' : '500,000'}\nNet Cash Flow: Ugx ${result.netCashFlow.toLocaleString()}`,
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/dashboard',
              params: { 
                userId,
                loanType: data.loanType,
                loanAmount: data.loanType === 'personal' ? '50000' : '500000',
                netCashFlow: result.netCashFlow.toString(),
                status: status.toLowerCase(),
                transactions: JSON.stringify(data.transactions)
              },
            }),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting loan application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit loan application. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Loan Application</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Type</Text>
          <View style={styles.radioGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.radioButton, value === 'personal' && styles.radioButtonSelected]}
                    onPress={() => onChange('personal')}>
                    <Text style={styles.radioButtonText}>Personal Loan (Ugx 50,000)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioButton, value === 'business' && styles.radioButtonSelected]}
                    onPress={() => onChange('business')}>
                    <Text style={styles.radioButtonText}>Business Loan (Ugx 500,000)</Text>
                  </TouchableOpacity>
                </>
              )}
              name="loanType"
              defaultValue="personal"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mobile Money Transactions</Text>
            <Text style={styles.helperText}>(At least 5 transactions required)</Text>
          </View>
          
          {fields.map((field, index) => (
            <View key={field.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionNumber}>Transaction {index + 1}</Text>
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 2 }]}>
                  <Text style={styles.label}>Amount (Ugx)</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.transactions?.[index]?.amount && styles.inputError]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                      />
                    )}
                    name={`transactions.${index}.amount`}
                    defaultValue=""
                  />
                  {errors.transactions?.[index]?.amount && (
                    <Text style={styles.errorText}>{errors.transactions[index]?.amount?.message}</Text>
                  )}
                </View>

                <View style={[styles.inputContainer, { flex: 1.5, marginLeft: 10 }]}>
                  <Text style={styles.label}>Type</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.typeButtons}>
                        <TouchableOpacity
                          style={[styles.typeButton, value === 'credit' && styles.typeButtonSelected]}
                          onPress={() => onChange('credit')}>
                          <Text style={value === 'credit' ? styles.typeButtonTextSelected : styles.typeButtonText}>
                            Credit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.typeButton, value === 'debit' && styles.typeButtonSelected]}
                          onPress={() => onChange('debit')}>
                          <Text style={value === 'debit' ? styles.typeButtonTextSelected : styles.typeButtonText}>
                            Debit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    name={`transactions.${index}.type`}
                    defaultValue="credit"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description (Optional)</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="e.g. Payment from John"
                    />
                  )}
                  name={`transactions.${index}.description`}
                  defaultValue=""
                />
              </View>
            </View>
          ))}

          <Text style={styles.transactionLimitText}>
            Maximum 5 transactions allowed. Please fill all 5 transactions above.
          </Text>
        </View>

        {/* Recently Added Transactions Display */}
        {recentTransactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Added Transactions</Text>
            <View style={styles.recentTransactionsList}>
              {recentTransactions.map((transaction, index) => (
                <View key={index} style={styles.recentTransactionItem}>
                  <View style={styles.recentTransactionIcon}>
                    <MaterialIcons 
                      name={transaction.type === 'credit' ? 'call-received' : 'call-made'} 
                      size={20} 
                      color={transaction.type === 'credit' ? '#4caf50' : '#f44336'} 
                    />
                  </View>
                  <View style={styles.recentTransactionDetails}>
                    <Text style={styles.recentTransactionDescription}>
                      {transaction.description || 'Mobile Money Transaction'}
                    </Text>
                    <Text style={styles.recentTransactionType}>
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </Text>
                  </View>
                  <Text 
                    style={[
                      styles.recentTransactionAmount,
                      transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
                    ]}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}Ugx {transaction.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 UPLOAD TRANSACTION SCREENSHOT</Text>
          <Text style={styles.helperText}>
            Please upload a clear screenshot of your mobile money transaction history
          </Text>
          
          <TouchableOpacity
            style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled, screenshotUri && styles.uploadButtonSelected]}
            onPress={handleImageSelect}
            disabled={isUploading}>
            {isUploading ? (
              <>
                <ActivityIndicator color="#6200ee" size="large" />
                <Text style={styles.uploadButtonText}>Uploading to Cloudinary...</Text>
              </>
            ) : (
              <>
                <Text style={styles.uploadButtonText}>
                  {screenshotUri ? '✅ IMAGE SELECTED' : '📷 SELECT SCREENSHOT'}
                </Text>
                <Text style={styles.uploadSubtext}>
                  {screenshotUri ? 'Tap to choose a different image' : 'Tap to choose from gallery'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {screenshotUri && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>
                {cloudinaryUrl ? '✅ UPLOADED TO CLOUDINARY' : '⏳ UPLOADING TO CLOUDINARY...'}
              </Text>
              {cloudinaryUrl && (
                <Text style={styles.previewSubtext}>
                  URL: {cloudinaryUrl.substring(0, 50)}...
                </Text>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  uploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f0f4ff',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#6200ee',
    borderStyle: 'dashed',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 120,
  },
  uploadButtonSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 3,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginTop: 15,
    color: '#6200ee',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  uploadSubtext: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    alignItems: 'center',
  },
  previewText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#b39ddb',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  radioButtonSelected: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5ff',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#333',
  },
  transactionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionNumber: {
    fontWeight: '600',
    color: '#444',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 2,
  },
  typeButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#6200ee',
  },
  typeButtonText: {
    color: '#333',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  transactionLimitText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  recentTransactionsList: {
    marginTop: 8,
  },
  recentTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentTransactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentTransactionDetails: {
    flex: 1,
    marginRight: 12,
  },
  recentTransactionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  recentTransactionType: {
    fontSize: 12,
    color: '#999',
  },
  recentTransactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  creditAmount: {
    color: '#4caf50',
  },
  debitAmount: {
    color: '#f44336',
  },
});
