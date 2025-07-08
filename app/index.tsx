import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../constants/theme";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Eleglance</Text>
        <Text style={styles.subtitle}>Home Of Finance!</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/transaction')}
        >
          <Text style={styles.buttonText}>View Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/loan-transaction')}
        >
          <Text style={styles.buttonText}>Loan Eligibility</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  main: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "DMBold",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    fontFamily: "DMRegular",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
