import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const OrderDetailsScreen: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([
    {
      id: '1',
      productName: 'Tomatoes',
      image: 'https://via.placeholder.com/100',
      quantity: 10,
      price: 5.5,
      status: 'Pending',
      customer: { name: 'Jane Smith', phone: '+91-9123456789', address: '456 Market St, Village B' },
    },
    {
      id: '2',
      productName: 'Carrots',
      image: 'https://via.placeholder.com/100',
      quantity: 15,
      price: 3.0,
      status: 'Placed',
      customer: { name: 'Robert Brown', phone: '+91-9876543210', address: '789 Town Rd, Village C' },
    },
    {
      id: '3',
      productName: 'Spinach',
      image: 'https://via.placeholder.com/100',
      quantity: 8,
      price: 2.5,
      status: 'Pending',
      customer: { name: 'Emily Davis', phone: '+91-9234567890', address: '123 Farm Rd, Village A' },
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Placed'>('All');
  const animatedValues = orders.reduce((acc, order) => ({
    ...acc,
    [order.id]: new Animated.Value(1),
  }), {} as { [key: string]: Animated.Value });

  // Function to sort orders with Pending first
  const sortOrders = (ordersToSort: typeof orders) => {
    return [...ordersToSort].sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return 0;
    });
  };

  // Filter orders based on status
  const filteredOrders = filter === 'All' ? orders : orders.filter(order => order.status === filter);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // Simulate API call (replace with actual backend call)
      setTimeout(() => {
        const mockOrders = [
          {
            id: '1',
            productName: 'Tomatoes',
            image: 'https://via.placeholder.com/100',
            quantity: 10,
            price: 5.5,
            status: 'Pending',
            customer: { name: 'Jane Smith', phone: '+91-9123456789', address: '456 Market St, Village B' },
          },
          {
            id: '2',
            productName: 'Carrots',
            image: 'https://via.placeholder.com/100',
            quantity: 15,
            price: 3.0,
            status: 'Placed',
            customer: { name: 'Robert Brown', phone: '+91-9876543210', address: '789 Town Rd, Village C' },
          },
          {
            id: '3',
            productName: 'Spinach',
            image: 'https://via.placeholder.com/100',
            quantity: 8,
            price: 2.5,
            status: 'Pending',
            customer: { name: 'Emily Davis', phone: '+91-9234567890', address: '123 Farm Rd, Village A' },
          },
        ];
        setOrders(sortOrders(mockOrders));
        setLoading(false);
      }, 1000);
    };
    fetchOrders();
  }, []);

  const animateButton = (orderId: string, toValue: number) => {
    Animated.spring(animatedValues[orderId], {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const toggleOrderStatus = (orderId: string) => {
    const newStatus = orders.find(o => o.id === orderId)?.status === 'Pending' ? 'Placed' : 'Pending';
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(sortOrders(updatedOrders));
    Alert.alert('Status Updated', `Order ${orderId} status changed to ${newStatus}`);
    // Add backend update logic here, e.g.:
    // try {
    //   await fetch(`YOUR_API_ENDPOINT/orders/${orderId}`, {
    //     method: 'PATCH',
    //     body: JSON.stringify({ status: newStatus }),
    //   });
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to update order status');
    //   setOrders(sortOrders(orders)); // Revert on failure
    // }
  };

  const handleContactCustomer = (customer: { name: string; phone: string }) => {
    Alert.alert(
      'Contact Customer',
      `Name: ${customer.name}\nPhone: ${customer.phone}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Initiate call to ${customer.phone}`) },
        { text: 'Copy Phone', onPress: () => console.log(`Copied ${customer.phone} to clipboard`) },
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
      const mockOrders = [
        {
          id: '1',
          productName: 'Tomatoes',
          image: 'https://via.placeholder.com/100',
          quantity: 10,
          price: 5.5,
          status: 'Pending',
          customer: { name: 'Jane Smith', phone: '+91-9123456789', address: '456 Market St, Village B' },
        },
        {
          id: '2',
          productName: 'Carrots',
          image: 'https://via.placeholder.com/100',
          quantity: 15,
          price: 3.0,
          status: 'Placed',
          customer: { name: 'Robert Brown', phone: '+91-9876543210', address: '789 Town Rd, Village C' },
        },
        {
          id: '3',
          productName: 'Spinach',
          image: 'https://via.placeholder.com/100',
          quantity: 8,
          price: 2.5,
          status: 'Pending',
          customer: { name: 'Emily Davis', phone: '+91-9234567890', address: '123 Farm Rd, Village A' },
        },
      ];
      setOrders(sortOrders(mockOrders));
      setLoading(false);
      Alert.alert('Refreshed', 'Order list has been updated.');
    }, 1000);
  };

  const handleFilterChange = (newFilter: 'All' | 'Pending' | 'Placed') => {
    setFilter(newFilter);
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <Animated.View style={[styles.orderItem, { transform: [{ scale: animatedValues[item.id] }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleOrderStatus(item.id)}
        onPressIn={() => animateButton(item.id, 0.95)}
        onPressOut={() => animateButton(item.id, 1)}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F9F9F9']}
          style={styles.orderCardGradient}
        >
          <View style={styles.orderContent}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.orderImage}
                onError={() => console.log(`Failed to load image for order ${item.id}`)}
              />
            ) : (
              <View style={styles.orderImage}>
                <Icon name="image" size={40} color="#757575" />
                <Text style={styles.imageFallbackText}>No Image</Text>
              </View>
            )}
            <View style={styles.orderDetails}>
              <Text style={styles.productName}>{item.productName}</Text>
              <View style={styles.detailRow}>
                <Icon name="tag" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.orderText}>Order ID: {item.id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="shopping-cart" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="attach-money" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.orderText}>${item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleContactCustomer(item.customer)}>
                <View style={styles.customerDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="person" size={14} color="#4CAF50" style={styles.detailIcon} />
                    <Text style={styles.customerText}>Customer: {item.customer.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="phone" size= {14} color="#4CAF50" style={styles.detailIcon} />
                    <Text style={styles.customerText}>Phone: {item.customer.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={14} color="#4CAF50" style={styles.detailIcon} />
                    <Text style={styles.customerText}>Address: {item.customer.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.statusButton, item.status === 'Pending' ? styles.pendingButton : styles.placedButton]}
              onPress={() => toggleOrderStatus(item.id)}
              activeOpacity={0.9}
              onPressIn={() => animateButton(item.id, 0.95)}
              onPressOut={() => animateButton(item.id, 1)}
            >
              <LinearGradient
                colors={item.status === 'Pending' ? ['#FFC107', '#FFB300'] : ['#4CAF50', '#66BB6A']}
                style={styles.statusButtonGradient}
              >
                <Text style={styles.statusButtonText}>{item.status}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.orderItem}>
      <LinearGradient colors={['#F0F0F0', '#E8E8E8']} style={styles.orderCardGradient}>
        <View style={styles.orderContent}>
          <View style={styles.orderImage} />
          <View style={styles.orderDetails}>
            <View style={[styles.skeletonText, { width: '60%', height: 20, marginBottom: 8 }]} />
            <View style={[styles.skeletonText, { width: '40%', height: 16 }]} />
            <View style={[styles.skeletonText, { width: '40%', height: 16, marginVertical: 6 }]} />
            <View style={[styles.skeletonText, { width: '40%', height: 16 }]} />
            <View style={styles.customerDetails}>
              <View style={[styles.skeletonText, { width: '50%', height: 14, marginVertical: 4 }]} />
              <View style={[styles.skeletonText, { width: '50%', height: 14, marginVertical: 4 }]} />
              <View style={[styles.skeletonText, { width: '50%', height: 14, marginVertical: 4 }]} />
            </View>
          </View>
          <View style={[styles.statusButton, { backgroundColor: '#E0E0E0' }]} />
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#9CD941']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.headerIcon}>
            <Icon name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Order Details</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.headerIcon}>
            <Icon name="refresh" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          {['All', 'Pending', 'Placed'].map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filter === status && styles.filterButtonActive]}
              onPress={() => handleFilterChange(status as 'All' | 'Pending' | 'Placed')}
            >
              <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {loading ? (
        <FlatList
          data={[1, 2, 3]}
          renderItem={renderSkeletonItem}
          keyExtractor={item => item.toString()}
          contentContainerStyle={styles.orderList}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.orderList}
          ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
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
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#2e7d32',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#2e7d32',
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterTextActive: {
    color: '#4CAF50',
  },
  orderList: {
    padding: 20,
  },
  orderItem: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  orderCardGradient: {
    borderRadius: 16,
    padding: 2,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  imageFallbackText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 5,
    textAlign: 'center',
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  orderText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  customerDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  customerText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '400',
  },
  statusButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  pendingButton: {
    backgroundColor: '#FFC107',
  },
  placedButton: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonText: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: '500',
  },
  alertStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
  },
});

export default OrderDetailsScreen;