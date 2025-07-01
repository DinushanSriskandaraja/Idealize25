import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const { username: inputUsername, password: inputPassword } = credentials;
    if (!inputUsername || !inputPassword) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for login (replace with actual backend API call)
      await AsyncStorage.setItem('authToken', 'sample-token');
      await AsyncStorage.setItem('userData', JSON.stringify({ 
        name: inputUsername, 
        address: '123 Farm Lane, Village A', 
        phoneNumber: '+91-9876543210' 
      }));
      router.replace('/homescreen');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to log in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = (e: any) => {
    try {
      const qrData = JSON.parse(e.data);
      if (qrData.username && qrData.password) {
        setUsername(qrData.username);
        setPassword(qrData.password);
        setShowScanner(false);
        handleLogin({ username: qrData.username, password: qrData.password });
      } else {
        Alert.alert('Error', 'Invalid QR code format.');
        setShowScanner(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to parse QR code.');
      setShowScanner(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#9CD941']} style={styles.header}>
        <Text style={styles.headerText}>Welcome Back</Text>
      </LinearGradient>
      {showScanner ? (
        <View style={styles.scannerContainer}>
          <QRCodeScanner
            onRead={handleQRScan}
            topContent={
              <Text style={styles.scannerText}>Scan QR Code to Login</Text>
            }
            bottomContent={
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowScanner(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            }
            cameraStyle={styles.camera}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <LinearGradient colors={['#FFFFFF', '#F9F9F9']} style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#757575"
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#4CAF50" style={styles.inputIcon} />
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
              onPress={() => handleLogin({ username, password })}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.loginButtonGradient}
              >
                <Icon name="login" size={18} color="#FFFFFF" />
                <Text style={styles.loginButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qrButton}
              activeOpacity={0.9}
              onPress={() => setShowScanner(true)}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#2196F3', '#42A5F5']}
                style={styles.qrButtonGradient}
              >
                <Icon name="qr-code-scanner" size={18} color="#FFFFFF" />
                <Text style={styles.qrButtonText}>Scan QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    paddingTop: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  formCard: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333333',
  },
  loginButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  qrButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  qrButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
  },
  scannerText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF5252',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
});

export default LoginScreen;