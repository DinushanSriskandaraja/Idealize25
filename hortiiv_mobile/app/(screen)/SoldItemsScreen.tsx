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

interface SoldItem {
  id: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  status: string;
  customer: { name: string; phone: string; address: string };
  saleDate: string; // Format: YYYY-MM-DD
}

interface DailyIncome {
  date: string;
  total: number;
}

const SoldItemsScreen: React.FC = () => {
  const router = useRouter();
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);
  const [dailyIncomes, setDailyIncomes] = useState<DailyIncome[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Daily' | 'Monthly'>('All');
  const animatedValues = soldItems.reduce((acc, item) => ({
    ...acc,
    [item.id]: new Animated.Value(1),
  }), {} as { [key: string]: Animated.Value });

  // Function to calculate daily and monthly income
  const calculateIncomes = (items: SoldItem[]) => {
    const dailyMap: { [date: string]: number } = {};
    let monthlyTotal = 0;

    items.forEach(item => {
      if (item.status === 'Placed') {
        const total = item.quantity * item.price;
        dailyMap[item.saleDate] = (dailyMap[item.saleDate] || 0) + total;
        monthlyTotal += total;
      }
    });

    const dailyIncomes = Object.entries(dailyMap).map(([date, total]) => ({
      date,
      total,
    })).sort((a, b) => b.date.localeCompare(a.date)); // Newest first

    setDailyIncomes(dailyIncomes);
    setMonthlyIncome(monthlyTotal);
  };

  useEffect(() => {
    const fetchSoldItems = async () => {
      setLoading(true);
      // Simulate API call (replace with actual backend call)
      setTimeout(() => {
        const mockItems: SoldItem[] = [
          {
            id: '1',
            productName: 'Tomatoes',
            image: 'https://via.placeholder.com/100',
            quantity: 10,
            price: 5.5,
            status: 'Placed',
            customer: { name: 'Jane Smith', phone: '+91-9123456789', address: '456 Market St, Village B' },
            saleDate: '2025-06-25',
          },
          {
            id: '2',
            productName: 'Carrots',
            image: 'https://via.placeholder.com/100',
            quantity: 15,
            price: 3.0,
            status: 'Placed',
            customer: { name: 'Robert Brown', phone: '+91-9876543210', address: '789 Town Rd, Village C' },
            saleDate: '2025-06-24',
          },
          {
            id: '3',
            productName: 'Spinach',
            image: 'https://via.placeholder.com/100',
            quantity: 8,
            price: 2.5,
            status: 'Placed',
            customer: { name: 'Emily Davis', phone: '+91-9234567890', address: '123 Farm Rd, Village A' },
            saleDate: '2025-06-25',
          },
        ];
        setSoldItems(mockItems);
        calculateIncomes(mockItems);
        setLoading(false);
      }, 1000);
    };
    fetchSoldItems();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh (replace with actual API call)
    setTimeout(() => {
      const mockItems: SoldItem[] = [
        {
          id: '1',
          productName: 'Tomatoes',
          image: 'https://via.placeholder.com/100',
          quantity: 10,
          price: 5.5,
          status: 'Placed',
          customer: { name: 'Jane Smith', phone: '+91-9123456789', address: '456 Market St, Village B' },
          saleDate: '2025-06-25',
        },
        {
          id: '2',
          productName: 'Carrots',
          image: 'https://via.placeholder.com/100',
          quantity: 15,
          price: 3.0,
          status: 'Placed',
          customer: { name: 'Robert Brown', phone: '+91-9876543210', address: '789 Town Rd, Village C' },
          saleDate: '2025-06-24',
        },
        {
          id: '3',
          productName: 'Spinach',
          image: 'https://via.placeholder.com/100',
          quantity: 8,
          price: 2.5,
          status: 'Placed',
          customer: { name: 'Emily Davis', phone: '+91-9234567890', address: '123 Farm Rd, Village A' },
          saleDate: '2025-06-25',
        },
      ];
      setSoldItems(mockItems);
      calculateIncomes(mockItems);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilter: 'All' | 'Daily' | 'Monthly') => {
    setFilter(newFilter);
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

  const renderSummaryCard = () => (
    <LinearGradient colors={['#f2cf8d', '#f7e9c2']} style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Income Summary</Text>
      {filter !== 'Monthly' && (
        <>
          <Text style={styles.summarySubtitle}>Daily Income</Text>
          {dailyIncomes.map(({ date, total }) => (
            <View key={date} style={styles.dailyIncomeRow}>
              <Text style={styles.dailyIncomeText}>{date}</Text>
              <Text style={styles.dailyIncomeText}>${total.toFixed(2)}</Text>
            </View>
          ))}
        </>
      )}
      <Text style={styles.summarySubtitle}>Monthly Income (June 2025)</Text>
      <Text style={styles.monthlyIncomeText}>${monthlyIncome.toFixed(2)}</Text>
    </LinearGradient>
  );

  const renderSoldItem = ({ item }: { item: SoldItem }) => (
    <Animated.View style={[styles.itemCard, { transform: [{ scale: animatedValues[item.id] }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => Animated.spring(animatedValues[item.id], {
          toValue: 0.95,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start()}
        onPressOut={() => Animated.spring(animatedValues[item.id], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start()}
      >
        <LinearGradient colors={['#FFFFFF', '#F9F9F9']} style={styles.itemCardGradient}>
          <View style={styles.itemContent}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                onError={() => console.log(`Failed to load image for item ${item.id}`)}
              />
            ) : (
              <View style={styles.itemImage}>
                <Icon name="image" size={40} color="#757575" />
                <Text style={styles.imageFallbackText}>No Image</Text>
              </View>
            )}
            <View style={styles.itemDetails}>
              <Text style={styles.productName}>{item.productName}</Text>
              <View style={styles.detailRow}>
                <Icon name="tag" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.itemText}>Order ID: {item.id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="shopping-cart" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="attach-money" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="calendar-today" size={16} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.itemText}>Sold: {item.saleDate}</Text>
              </View>
              <TouchableOpacity onPress={() => handleContactCustomer(item.customer)}>
                <View style={styles.customerDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="person" size={14} color="#4CAF50" style={styles.detailIcon} />
                    <Text style={styles.customerText}>Customer: {item.customer.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="phone" size={14} color="#4CAF50" style={styles.detailIcon} />
                    <Text style={styles.customerText}>Phone: {item.customer.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={14} color="#4CAF50" style={styles.detailIcon} />
                    <Text style={styles.customerText}>Address: {item.customer.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.statusBadge, styles.placedBadge]}>
              <Text style={styles.statusBadgeText}>Sold</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.itemCard}>
      <LinearGradient colors={['#F0F0F0', '#E8E8E8']} style={styles.itemCardGradient}>
        <View style={styles.itemContent}>
          <View style={styles.itemImage} />
          <View style={styles.itemDetails}>
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
          <View style={[styles.statusBadge, { backgroundColor: '#E0E0E0' }]} />
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
          <Text style={styles.headerText}>Sold Items</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.headerIcon}>
            <Icon name="refresh" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          {['All', 'Daily', 'Monthly'].map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filter === status && styles.filterButtonActive]}
              onPress={() => handleFilterChange(status as 'All' | 'Daily' | 'Monthly')}
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
          contentContainerStyle={styles.itemList}
          ListHeaderComponent={<View style={styles.summaryCard} />}
        />
      ) : (
        <FlatList
          data={soldItems}
          renderItem={renderSoldItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.itemList}
          ListHeaderComponent={renderSummaryCard}
          ListEmptyComponent={<Text style={styles.emptyText}>No sold items found.</Text>}
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
  itemList: {
    padding: 20,
  },
  itemCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  itemCardGradient: {
    borderRadius: 16,
    padding: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
  },
  itemImage: {
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
  itemDetails: {
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
  itemText: {
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
  statusBadge: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  placedBadge: {
    backgroundColor: '#4CAF50',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 15,
  },
  summarySubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 5,
  },
  dailyIncomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  dailyIncomeText: {
    fontSize: 15,
    color: '#050505',
    fontWeight: '500',
  },
  monthlyIncomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#050505',
    marginTop: 10,
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

export default SoldItemsScreen;