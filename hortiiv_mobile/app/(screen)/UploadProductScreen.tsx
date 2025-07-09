// screens/UploadProductScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import { uploadProduct } from "../../api/productapi";

const UploadProductScreen: React.FC = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0].uri);
    }
  };

  const startSpeechRecognition = async () => {
    Speech.speak("Please say product name, quantity, price, and description", {
      language: "en-US",
    });
    Alert.alert(
      "Speech Recognition",
      "Not supported in this build. Please use a package like react-native-voice."
    );
  };

  const handleUpload = async () => {
    if (!productName || !quantity || !price || !description || !image) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all fields and select an image."
      );
      return;
    }

    setIsUploading(true);

    try {
      await uploadProduct({
        name: productName,
        stock: quantity,
        price,
        description,
        imageUri: image,
      });

      Alert.alert("Success", "Product uploaded successfully!", [
        {
          text: "OK",
          onPress: () => {
            setProductName("");
            setQuantity("");
            setPrice("");
            setDescription("");
            setImage(null);
            router.push("/homescreen");
          },
        },
      ]);
    } catch (err: any) {
      console.error("Upload failed:", err);
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#2e7d32", "#9CD941"]} style={styles.header}>
        <Text style={styles.headerText}>Upload Product</Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="image" size={40} color="#757575" />
              <Text style={styles.imageText}>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity
          style={styles.micButton}
          onPress={startSpeechRecognition}>
          <Icon name="mic" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUpload}
          disabled={isUploading}>
          <LinearGradient
            colors={["#2e7d32", "#2e7d32"]}
            style={styles.uploadButtonInner}>
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, alignItems: "center" },
  headerText: { fontSize: 22, color: "#fff", fontWeight: "bold" },
  content: { padding: 20 },
  imagePicker: {
    height: 200,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  imagePlaceholder: { alignItems: "center" },
  imageText: { marginTop: 8, color: "#757575" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  micButton: {
    backgroundColor: "#ff9800",
    padding: 12,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 10,
  },
  uploadButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  uploadButtonInner: {
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UploadProductScreen;
