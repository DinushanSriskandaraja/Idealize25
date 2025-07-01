import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccountScreen = () => {
  const router = useRouter();
  const [farmerImage, setFarmerImage] = useState<string | null>('https://via.placeholder.com/200');
  const farmer = {
    name: 'John Doe',
    address: '123 Farm Lane, Village A',
    phoneNumber: '+91-9876543210',
  };
  const animatedValues = {
    image: new Animated.Value(1),
    edit: new Animated.Value(1),
    back: new Animated.Value(1),
    logout: new Animated.Value(1),
  };

  const handleBack = () => {
    router.replace('/homescreen');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('userData');
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleImagePress = () => {
    Alert.alert(
      'Profile Image',
      'What would you like to do with the image?',
      [
        {
          text: 'View',
          onPress: () => {
            Alert.alert('View Image', 'Image viewing is not implemented in this build.');
          },
        },
        {
          text: 'Change',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to change the image.', []);
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setFarmerImage(result.assets[0].uri);
      Alert.alert('Success', 'Profile image updated successfully!', []);
    }
  };

  const handleEditProfile = () => {
    // Assuming no edit profile screen is defined yet; update this when implemented
    Alert.alert('Info', 'Edit Profile feature is not implemented yet.');
    // router.push('/(auth)/EditProfile'); // Update with correct route when available
  };

  const animateButton = (animatedValue: Animated.Value, toValue: number) => {
    Animated.spring(animatedValue, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#9CD941']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.headerIcon}
            onPressIn={() => animateButton(animatedValues.back, 0.95)}
            onPressOut={() => animateButton(animatedValues.back, 1)}
          >
            <Animated.View style={{ transform: [{ scale: animatedValues.back }] }}>
              <Icon name="arrow-back" size={28} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.headerText}>My Account</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.headerIcon}
            onPressIn={() => animateButton(animatedValues.logout, 0.95)}
            onPressOut={() => animateButton(animatedValues.logout, 1)}
          >
            <Animated.View style={{ transform: [{ scale: animatedValues.logout }] }}>
              <Icon name="logout" size={28} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <LinearGradient colors={['#FFFFFF', '#F9F9F9']} style={styles.profileCard}>
          <TouchableOpacity
            onPress={handleImagePress}
            onPressIn={() => animateButton(animatedValues.image, 0.95)}
            onPressOut={() => animateButton(animatedValues.image, 1)}
          >
            <Animated.View style={{ transform: [{ scale: animatedValues.image }] }}>
              {farmerImage ? (
                <Image
                  source={{ uri: farmerImage }}
                  style={styles.farmerImage}
                  onError={() => {
                    console.log('Image failed to load');
                    setFarmerImage(null);
                  }}
                />
              ) : (
                <View style={styles.imageFallback}>
                  <Icon name="person" size={80} color="#757575" />
                  <Text style={styles.imageFallbackText}>No Image</Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Icon name="person" size={20} color="#4CAF50" style={styles.detailIcon} />
              <Text style={styles.detailText}>Name: {farmer.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="location-on" size={20} color="#4CAF50" style={styles.detailIcon} />
              <Text style={styles.detailText}>Address: {farmer.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="phone" size={20} color="#4CAF50" style={styles.detailIcon} />
              <Text style={styles.detailText}>Phone: {farmer.phoneNumber}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.9}
            onPressIn={() => animateButton(animatedValues.edit, 0.95)}
            onPressOut={() => animateButton(animatedValues.edit, 1)}
            onPress={handleEditProfile}
          >
            <Animated.View style={[styles.editButtonInner, { transform: [{ scale: animatedValues.edit }] }]}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.editButtonGradient}
              >
                <Icon name="edit" size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.9}
            onPressIn={() => animateButton(animatedValues.logout, 0.95)}
            onPressOut={() => animateButton(animatedValues.logout, 1)}
            onPress={handleLogout}
          >
            <Animated.View style={[styles.logoutButtonInner, { transform: [{ scale: animatedValues.logout }] }]}>
              <LinearGradient
                colors={['#D32F2F', '#F44336']}
                style={styles.logoutButtonGradient}
              >
                <Icon name="logout" size={18} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  headerIcon: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#2e7d32',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileCard: {
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
  farmerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  imageFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  imageFallbackText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  details: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  editButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  editButtonInner: {
    borderRadius: 8,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonInner: {
    borderRadius: 8,
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MyAccountScreen;