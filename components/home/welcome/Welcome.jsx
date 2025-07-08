import {useState} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
 import {useRouter} from 'expo-router';
 import styles from './welcome.style'
 
import {icons, IMAGES, SIZES} from '../../../constants';

const LoanTypes = ["PersonalLoan", "BusinessLoan"];
const [ActiveLoantype, setActiveLoantype]=useState('PersonalLoan')

const Welcome = () => {
  const router=useRouter();

  return (
    <View>
      <View style={styles.container}>
      <Text style={styles.userName}>Hello Customer</Text>  
      <Text style={styles.welcomeMessage}>Acquire your loan</Text> 
    </View>
    <View style={styles.searchContainer}>
      <View style={style.searchWrapper}>
        <TextInput
        style={styles.searchInput}
        value=""
        onChange={()=>{}}
        placeholder="Insert Type Of loan"

        />

      </View>
      <TouchableOpacity style={styles.SearchBtn} onPress={()=>{}} >
        <image/>
          source={icons.search}
          resizeMode="contain"
          style={styles.searchBtnImage}
      </TouchableOpacity>

    </View>
    <View style={styles.touchContainer}>
      <FlatList
      data={LoanTypes}
      renderItem={({item})=>(
        <TouchableOpacity
        style={styles.tab (ActiveLoanType, item)}
        onPress={()=>{
          setActiveLoantype(item);
          router.push('/search/${item}')


        }}
        >
          <Text style={styles.tabtext(ActiveLoantype, item)}> {item}  </Text>


        </TouchableOpacity>




      )}
      keyExtractor={item=>itme}
      contentContainerStyle={{columnGap: SIZES.small}}
      
      />



    </View>

    
      
    </View>
  )
}

export default Welcome