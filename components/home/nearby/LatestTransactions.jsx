import {useState} from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import styles from './latesttransactions.style'
import {COLORS, SIZES} from '../../../constants';
import LatestTransactionsCard from '../../common/cards/nearby/LatestTransactions';

const LatestTransactions = () => {
  const router=useRouter();
  const isLoading = false;
  const error = false;
  
  return (
    <View styles={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Latest Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>

      </View> 
      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" colors={COLORS.primary}/>

        ) : error(
          <Text>Something went wrong

          </Text>
        ) (<FlatList
          data={[1,2,3,4,5]}
          renderItem={({item})=>(
            <LatestTransactionsCard
              item={item}
            />

          )}
          keyExtractor={item=>item?.loan_id}
          contentContainerStyle={{columnGap: SIZES.medium}}
          horizontal
          />
      
        )
        

        }

      </View>
      
    
    </View>
  )
}

export default LatestTransactions