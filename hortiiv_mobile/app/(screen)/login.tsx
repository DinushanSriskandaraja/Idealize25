import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../api/authapi"; // adjust path as needed

const LoginScreen = () => {
  const router = useRouter();
  const [contactNumber, setContactNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);

  const handleLogin = async (p0: {
    contactNumber: string;
    password: string;
  }) => {
    if (!contactNumber || !password) {
      Alert.alert("Error", "Please enter both contact number and password.");
      return;
    }

    setIsLoading(true);

    try {
      // Make API call
      await login({ contact_number: contactNumber, password });

      // Save additional user info if needed (or fetch from API if available)
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          contactNumber,
          address: "123 Farm Lane, Village A",
          phoneNumber: contactNumber,
        })
      );

      // Navigate to homescreen
      router.replace("/homescreen");
    } catch (error: any) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };
  const handleQRScan = (e: any) => {
    // handleLogin(e.data); // Pass scanned QR code data to handleLogin
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#2e7d32", "#9CD941"]} style={styles.header}>
        <Text style={styles.headerText}>Welcome Back</Text>
      </LinearGradient>
      <View style={styles.content}>
        {showQRScanner ? (
          <View style={styles.qrContainer}>
            {/* QR Scanner UI - Under Construction */}
            <Text>Feature Under construction</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowQRScanner(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <LinearGradient
            colors={["#FFFFFF", "#F9F9F9"]}
            style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Icon
                name="phone"
                size={20}
                color="#4CAF50"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#757575"
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={20}
                color="#4CAF50"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#757575"
              />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.9}
              onPress={() => handleLogin({ contactNumber, password })}
              disabled={isLoading}>
              <LinearGradient
                colors={["#4CAF50", "#66BB6A"]}
                style={styles.loginButtonGradient}>
                <Icon name="login" size={18} color="#FFFFFF" />
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Logging in..." : "Login"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => setShowQRScanner(true)}>
              <LinearGradient
                colors={["#4CAF50", "#66BB6A"]}
                style={styles.qrButtonGradient}>
                <Icon name="qr-code" size={18} color="#FFFFFF" />
                <Text style={styles.qrButtonText}>Scan QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... keep your existing styles unchanged
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    paddingTop: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textAlign: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  formCard: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333333",
  },
  loginButton: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  qrButton: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 20,
  },
  qrButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  qrContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  qrInstruction: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  camera: {
    height: 300,
    width: "100%",
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF5252",
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;
