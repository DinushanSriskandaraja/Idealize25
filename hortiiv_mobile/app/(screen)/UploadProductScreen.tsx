import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

const UploadProductScreen: React.FC = () => {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const animatedValues = {
    upload: new Animated.Value(1),
    back: new Animated.Value(1),
    mic: new Animated.Value(1),
    imagePicker: new Animated.Value(1),
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const startSpeechRecognition = async () => {
    setIsRecording(true);
    Speech.speak('Please say product name, quantity, price, and description', { language: 'en-US' });
    Alert.alert(
      'Speech Recognition',
      'Speech recognition is not supported in this build. Please implement using a supported package like react-native-voice.',
      [
        { text: 'OK', onPress: () => setIsRecording(false) },
      ],
    );
  };

  const handleBack = () => {
    Alert.alert(
      'Back',
      'Clear all fields and return to home?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            setProductName('');
            setQuantity('');
            setPrice('');
            setDescription('');
            setImage(null);
            router.push('/homescreen');
          },
        },
      ],
    );
  };

  const handleUpload = () => {
    if (!productName || !quantity || !price || !description || !image) {
      Alert.alert(
        'Missing Fields',
        'Please fill in all fields and select an image.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsUploading(true);
    // Simulate upload process (replace with actual backend API call)
    setTimeout(() => {
      Alert.alert(
        'Product Uploaded',
        'Your product has been uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setProductName('');
              setQuantity('');
              setPrice('');
              setDescription('');
              setImage(null);
              setIsUploading(false);
              router.push('/homescreen');
            },
          },
        ]
      );
      setIsUploading(false);
    }, 1000);
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
            style={styles.headerIcon}
            onPress={handleBack}
            onPressIn={() => animateButton(animatedValues.back, 0.95)}
            onPressOut={() => animateButton(animatedValues.back, 1)}
          >
            <Animated.View style={{ transform: [{ scale: animatedValues.back }] }}>
              <Icon name="arrow-back" size={28} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.headerText}>Upload Product</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <LinearGradient colors={['#FFFFFF', '#F9F9F9']} style={styles.formCard}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            onPressIn={() => animateButton(animatedValues.imagePicker, 0.95)}
            onPressOut={() => animateButton(animatedValues.imagePicker, 1)}
          >
            <Animated.View style={{ transform: [{ scale: animatedValues.imagePicker }] }}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="image" size={40} color="#757575" />
                  <Text style={styles.imageText}>Select Product Image</Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholderTextColor="#999999"
              />
            </View>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.inputLabel}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter product description"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.micButton, isRecording && styles.disabledButton]}
              onPress={startSpeechRecognition}
              disabled={isRecording}
              onPressIn={() => animateButton(animatedValues.mic, 0.95)}
              onPressOut={() => animateButton(animatedValues.mic, 1)}
            >
              <Animated.View style={{ transform: [{ scale: animatedValues.mic }] }}>
                <LinearGradient
                  colors={isRecording ? ['#E0E0E0', '#D0D0D0'] : ['#FFC107', '#FFB300']}
                  style={styles.micButtonGradient}
                >
                  <Icon name="mic" size={30} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.disabledButton]}
              onPress={handleUpload}
              disabled={isUploading}
              onPressIn={() => animateButton(animatedValues.upload, 0.95)}
              onPressOut={() => animateButton(animatedValues.upload, 1)}
            >
              <Animated.View style={{ transform: [{ scale: animatedValues.upload }] }}>
                <LinearGradient colors={['#2e7d32', '#2e7d32']} style={styles.uploadButtonGradient}>
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.uploadButtonText}>Upload Product</Text>
                  )}
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#2e7d32',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  halfInput: {
    width: '48%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  micButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 20,
  },
  micButtonGradient: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  alertStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
  },
});

export default UploadProductScreen;