import React from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const NotificationScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState([
    {
      id: '1',
      orderId: 'ORD001',
      vegetable: 'Tomato',
      quantity: 15,
      price: 3.0,
      timestamp: '2025-06-26 10:00 AM',
      deliveryAddress: '123 Farm Lane, Village A',
      image: 'https://source.unsplash.com/random/100x100?tomato',
    },
    {
      id: '2',
      orderId: 'ORD002',
      vegetable: 'Carrot',
      quantity: 8,
      price: 2.5,
      timestamp: '2025-06-26 09:30 AM',
      deliveryAddress: '456 Green Road, Village B',
      image: 'https://source.unsplash.com/random/100x100?carrot',
    },
    {
      id: '3',
      orderId: 'ORD003',
      vegetable: 'Potato',
      quantity: 2000,
      price: 1.8,
      timestamp: '2025-06-26 09:00 AM',
      deliveryAddress: '789 Crop Street, Village C',
      image: 'https://source.unsplash.com/random/100x100?potato',
    },
  ]);

  const handleBack = () => {
    router.push('/homescreen');
  };

  const handleReload = () => {
    // Simulate reload by resetting notifications (replace with actual API call if needed)
    setNotifications([...notifications]);
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    const unit = item.quantity >= 1000 ? 'kg' : 'g';
    const displayQuantity = item.quantity >= 1000 ? item.quantity / 1000 : item.quantity;
    return (
      <View style={styles.notificationItem}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.notificationDetails}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text style={styles.vegetable}>
            {item.vegetable} x{displayQuantity} {unit}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.deliveryAddress}>{item.deliveryAddress}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#9CD941']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Icon name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notifications</Text>
          <TouchableOpacity style={styles.headerButton} onPress={handleReload}>
            <Icon name="refresh" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationList}
        ListEmptyComponent={<Text style={styles.emptyText}>No new orders</Text>}
      />
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
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  headerButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#2e7d32',
  },
  notificationList: {
    flex: 1,
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  vegetable: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    color: '#D81B60',
    fontWeight: '500',
    marginBottom: 2,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    padding: 20,
  },
});

export default NotificationScreen;
