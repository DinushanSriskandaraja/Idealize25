import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = screenWidth * 0.42;

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handlePress = (screen: string) => {
    switch (screen) {
      case "AddProduct":
        router.push("/UploadProductScreen");
        break;
      case "OrderDetails":
        router.push("/OrderDetails");
        break;
      case "UserAccount":
        router.push("/MyAccount");
        break;
      case "ViewProducts":
        router.push("/products");
        break;
      case "SoldItems":
        router.push("/SoldItemsScreen");
        break;
      default:
        Alert.alert("Navigation, Navigate to ${screen} not implemented yet");
    }
  };

  const handleNotification = () => {
    router.push("/notification");
  };

  const renderButton = (
    screen: string,
    icon: string,
    label: string,
    backgroundColor: string
  ) => (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(screen)}
        style={[styles.button, { backgroundColor }]}>
        <Icon name={icon} size={40} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.buttonText}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#2e7d32", "#9CD941"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.headerLogo}
              onError={() => console.log("Header logo failed to load")}
            />
            <Text style={styles.headerText}>Hortiiv</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={handleNotification}
              style={styles.iconButton}>
              <Icon name="notifications" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePress("UserAccount")}
              style={styles.iconButton}>
              <Icon name="person" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          {renderButton("AddProduct", "add", "Add Product", "#4CAF50")}
          {renderButton(
            "OrderDetails",
            "shopping-cart",
            "Order Details",
            "#f2cf8d"
          )}
          {renderButton("ViewProducts", "list", "View Products", "#e69805")}
          {renderButton(
            "SoldItems",
            "monetization-on",
            "Sold Items",
            "#9cd941"
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 29,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 25,
    backgroundColor: "#2E7D32",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // marginTop: -20,
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 70,
    letterSpacing: 0.8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  buttonWrapper: {
    alignItems: "center",
    marginVertical: 20,
    width: buttonWidth,
  },
  button: {
    width: buttonWidth,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#388E3C",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#2e7d32",
    textAlign: "center",
    letterSpacing: 0.6,
  },
});

export default HomeScreen;
