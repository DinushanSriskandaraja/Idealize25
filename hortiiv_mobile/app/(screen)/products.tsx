import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Mock data (replace with actual API call)
const mockProducts = [
  {
    id: '1',
    productName: 'Tomatoes',
    quantity: '10',
    price: '2.50',
    description: 'Fresh organic tomatoes',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    productName: 'Apples',
    quantity: '15',
    price: '3.00',
    description: 'Crisp red apples',
    image: 'https://via.placeholder.com/150',
  },
];

const ProductsScreen: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);

  // Simulate fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Replace with actual API call: fetchProducts().then(data => setProducts(data));
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    fetchProducts();
  }, []);

  const handleEdit = (productId: string) => {
    router.push({ pathname: '/(screen)/UploadProductScreen', params: { productId } });
  };

  const handleDelete = (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${productName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter((product) => product.id !== productId));
            Alert.alert('Success', `${productName} has been deleted.`);
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.push('/homescreen');
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh (replace with actual API call)
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
      Alert.alert('Refreshed', 'Product list has been updated.');
    }, 1000);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => handleEdit(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productText}>Quantity: {item.quantity}</Text>
        <Text style={styles.productText}>Price: ${parseFloat(item.price).toFixed(2)}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item.id)}
          >
            <Icon name="edit" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.productName)}
          >
            <Icon name="delete" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#9CD941']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.headerIcon}>
            <Icon name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Products</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.headerIcon}>
            <Icon name="refresh" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        />
      )}
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
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  headerIcon: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#2e7d32',
  },
  list: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  productText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#555555',
    marginTop: 10,
  },
});

export default ProductsScreen;