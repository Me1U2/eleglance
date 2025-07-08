
import { View, ScrollView, SafeAreaView } from "react-native";
import {Stack, useRouter} from 'expo-router';
import {COLORS, icons, images, SIZES} from '../constants';
import { AddTransactions, LatestTransactions, ScreenHeaderBtn} from '../components';
    const Home = () => {
        const router = useRouter();
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}> 
                
                <Stack.Screen
                    options={{
                        headerStyle: { backgroundColor: COLORS.lightWhite },
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <ScreenHeaderBtn iconurl={icons.menu} dimensions="60%"/>
                        ),
                        headerRight: () => (
                            <ScreenHeaderBtn iconurl={images.profile} dimensions="100%"/>),
                            headerTitle: ""
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style = {{
                            flex:1,
                            padding: SIZES.medium
                        }}>
                        {/* <Welcome />
                        <LatestTransactions />
                        <AddTransactions /> */}
                    </View>
                </ScrollView>
              
            </SafeAreaView>
     )
    
}

export default Home;