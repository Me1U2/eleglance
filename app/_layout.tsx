import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from '../components/ThemeProvider';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'DMMedium',
    fontSize: 20,
    color: '#000'
  },
  headerBackTitle: {
    fontFamily: 'DMRegular',
    color: '#000'
  }
});

export default function Layout() {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Eleglance',
              headerShown: false 
            }} 
          />
          <Stack.Screen
            name="register"
            options={{
              title: 'Create Account',
              headerBackTitle: 'Back',
              headerTitleStyle: styles.headerTitle,
              headerBackTitleStyle: styles.headerBackTitle,
              headerTintColor: '#000',
              headerStyle: { backgroundColor: '#fff' },
            }}
          />
          <Stack.Screen
            name="loan-application"
            options={{
              title: 'Loan Application',
              headerBackTitle: 'Back',
              headerTitleStyle: styles.headerTitle,
              headerBackTitleStyle: styles.headerBackTitle,
              headerTintColor: '#000',
              headerStyle: { backgroundColor: '#fff' },
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </View>
  );
}