import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
   ActivityIndicator,
} from 'react-native';

import {
  Search,
  X,
  ChevronRight,
  Package,
} from 'lucide-react-native';
import { apiGetAdminOrders } from '@/lib/api';
import { useAuth } from '../../Context/AuthContext';
import type { AdminOrder, FilterTab, OrderCardProps, OrdersScreenProps } from '../../types';

/* =====================================================
   orders SCREEN
   ===================================================== */

const OrdersScreen: React.FC<OrdersScreenProps> = ({
  onSelectOrder,
  selectedOrderId,
}) => {
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRes = await apiGetAdminOrders(session?.token);
        setOrders(ordersRes?.orders ?? []);
      } catch (error) {
        console.error('Error fetching admin orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.token]);



  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === 'needs_verification') {
        if (
          order.status !== 'pending' &&
          order.status !== 'payment_verification'
        ) {
          return false;
        }
      } else if (activeTab === 'needs_routing') {
        if (order.assigned || order.status !== 'pending') {
          return false;
        }
      } else if (activeTab === 'processing') {
        if (
          order.status !== 'processing' &&
          order.status !== 'confirmed'
        ) {
          return false;
        }
      } else if (activeTab === 'shipped') {
        if (order.status !== 'shipped') {
          return false;
        }
      } else if (activeTab === 'delivered') {
        if (order.status !== 'delivered') {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();

        const matches =
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerPhone.includes(query) ||
          order.city.toLowerCase().includes(query) ||
          order.pincode.includes(query);

        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  /* ===================================================
     COUNTS
     =================================================== */

  const countVerification = orders.filter(
    (order) =>
      order.status === 'pending' ||
      order.status === 'payment_verification'
  ).length;

  const countRouting = orders.filter(
    (order) =>
      !order.assigned &&
      order.status === 'pending'
  ).length;

  const countProcessing = orders.filter(
    (order) =>
      order.status === 'processing' ||
      order.status === 'confirmed'
  ).length;

  const countShipped = orders.filter(
    (order) =>
      order.status === 'shipped'
  ).length;

  const countDelivered = orders.filter(
    (order) =>
      order.status === 'delivered'
  ).length;


  /* ===================================================
     FILTER TABS
     =================================================== */

  const tabs: FilterTab[] = [

    {
      id: 'all',
      label: 'All Orders',
      count: orders.length,
    },

    {
      id: 'needs_verification',
      label: 'Verify UPI',
      count: countVerification,
      badge: true,
    },

    {
      id: 'needs_routing',
      label: 'Route Branch',
      count: countRouting,
      badge: true,
    },

    {
      id: 'processing',
      label: 'Kitchen & Pack',
      count: countProcessing,
    },

    {
      id: 'shipped',
      label: 'In Transit',
      count: countShipped,
    },

    {
      id: 'delivered',
      label: 'Completed',
      count: countDelivered,
    },

  ];


  /* ===================================================
     CLEAR FILTERS
     =================================================== */

  const clearFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
  };


  /* ===================================================
     RENDER
     =================================================== */

  return (

    <View style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >


        {/* =================================================
            HEADER CARD
            ================================================= */}

        <View style={styles.headerCard}>

          <View style={styles.headerText}>

            <Text style={styles.title}>
              Live Orders Queue
            </Text>

            <Text style={styles.subtitle}>
              {filteredOrders.length}{' '}
              order
              {filteredOrders.length !== 1 ? 's' : ''}{' '}
              matching current filters
            </Text>

          </View>

          <View style={styles.searchContainer}>

            <Search
              size={16}
              color="#a8a29e"
            />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search customer, phone, order #, city..."
              placeholderTextColor="#a8a29e"
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {searchQuery.length > 0 && (

              <Pressable
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >

                <X
                  size={15}
                  color="#78716c"
                />

              </Pressable>

            )}

          </View>

        </View>


        {/* =================================================
            FILTER TABS
            ================================================= */}

        <ScrollView
          horizontal
          style={styles.tabsScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >

          {tabs.map((tab) => {

            const isActive =
              activeTab === tab.id;

            return (

              <Pressable
                key={tab.id}
                onPress={() =>
                  setActiveTab(tab.id)
                }
                style={({ pressed }) => [
                  styles.filterTab,
                  isActive &&
                  styles.filterTabActive,
                  pressed &&
                  styles.pressed,
                ]}
              >

                <Text
                  style={[
                    styles.filterTabText,
                    isActive &&
                    styles.filterTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>

                <View
                  style={[
                    styles.tabCount,
                    isActive &&
                    styles.tabCountActive,

                    tab.badge &&
                    !isActive &&
                    styles.tabCountWarning,
                  ]}
                >

                  <Text
                    style={[
                      styles.tabCountText,
                      isActive &&
                      styles.tabCountTextActive,

                      tab.badge &&
                      !isActive &&
                      styles.tabCountWarningText,
                    ]}
                  >
                    {tab.count}
                  </Text>

                </View>

              </Pressable>

            );

          })}

        </ScrollView>


        {/* =================================================
            ORDER LIST
            ================================================= */}

{loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#650700" />
          </View>
        ) : (

        <View style={styles.orderList}>

          {filteredOrders.length === 0 ? (

            /* EMPTY STATE */

            <View style={styles.emptyCard}>

              <View style={styles.emptyIcon}>

                <Package
                  size={24}
                  color="#b45309"
                />

              </View>

              <Text style={styles.emptyTitle}>
                No orders match your filter
              </Text>

              <Text style={styles.emptyDescription}>
                Try switching filter tabs or clearing
                the current filters.
              </Text>

              <Pressable
                onPress={clearFilters}
                style={styles.clearFiltersButton}
              >

                <Text style={styles.clearFiltersText}>
                  Clear all filters
                </Text>

              </Pressable>

            </View>

          ) : (

            filteredOrders.map((order) => (

              <OrderCard
                key={order.id}
                order={order}
                selected={
                  selectedOrderId === order.id
                }
                onPress={() =>
                  onSelectOrder?.(order.id)
                }
              />

            ))

          )}

        </View>
        )}


      </ScrollView>

    </View>
  );
};


/* =====================================================
   ORDER CARD
   ===================================================== */

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  selected,
  onPress,
}) => {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : 'Date unavailable';

  const initials = order.customerName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();


  const statusInfo = getStatusInfo(
    order.status
  );


  return (

    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.orderCard,

        selected &&
        styles.orderCardSelected,

        pressed &&
        styles.pressed,
      ]}
    >

      {/* TOP */}

      <View style={styles.orderTop}>

        <View style={styles.customerSection}>

          {/* INITIALS */}

          <View style={styles.initials}>

            <Text style={styles.initialsText}>
              {initials}
            </Text>

          </View>


          <View style={styles.customerInfo}>

            <View style={styles.customerNameRow}>

              <Text
                style={styles.customerName}
                numberOfLines={1}
              >
                {order.customerName}
              </Text>

              <Text style={styles.orderNumber}>
                #{order.orderNumber.split('-')[1]}
              </Text>

            </View>

            <Text style={styles.customerLocation}>
              {order.city} • {order.pincode}
            </Text>

            <Text style={styles.orderDate}>
              Placed {formattedDate}
            </Text>

          </View>

        </View>


        {/* AMOUNT */}

        <View style={styles.amountSection}>

          <Text style={styles.amount}>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusInfo.background,
              },
            ]}
          >

            <Text
              style={[
                styles.statusText,
                {
                  color: statusInfo.color,
                },
              ]}
            >
              {statusInfo.label}
            </Text>

          </View>

        </View>

      </View>


      {/* DIVIDER */}

      <View style={styles.orderDivider} />


      {/* BOTTOM */}

      <View style={styles.orderBottom}>

        <View>

          <Text style={styles.itemsText}>
            {order.items}{' '}
            {order.items === 1
              ? 'jar'
              : 'jars'}{' '}
            • {order.itemName}
          </Text>

          <Text style={styles.branchText}>
            {order.assigned
              ? `${order.branch} Branch`
              : '⚠️ Branch Unassigned'}
          </Text>

        </View>


        <View style={styles.orderArrow}>

          <ChevronRight
            size={17}
            color="#a8a29e"
          />

        </View>

      </View>

    </Pressable>
  );
};


/* =====================================================
   STATUS
   ===================================================== */

const getStatusInfo = (
  status: AdminOrder['status']
) => {

  switch (status) {

    case 'pending':
      return {
        label: 'Pending',
        background: '#fef3c7',
        color: '#92400e',
      };

    case 'payment_verification':
      return {
        label: 'Verify UPI',
        background: '#fef3c7',
        color: '#b45309',
      };

    case 'confirmed':
      return {
        label: 'Confirmed',
        background: '#dcfce7',
        color: '#166534',
      };

    case 'processing':
      return {
        label: 'Processing',
        background: '#dbeafe',
        color: '#1d4ed8',
      };

    case 'shipped':
      return {
        label: 'Shipped',
        background: '#ede9fe',
        color: '#6d28d9',
      };

    case 'delivered':
      return {
        label: 'Delivered',
        background: '#dcfce7',
        color: '#166534',
      };

    case 'cancelled':
      return {
        label: 'Cancelled',
        background: '#fee2e2',
        color: '#b91c1c',
      };

    default:
      return {
        label: 'Order',
        background: '#f5f5f4',
        color: '#57534e',
      };

  }
};


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f3f0ee',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 14,
    paddingBottom: 85,
    flexGrow: 1,
  },


  /* ===================================================
     HEADER
     =================================================== */

  headerCard: {
    backgroundColor: '#fffdfb',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#e7e2df',

    padding: 14,

    marginBottom: 12,

    elevation: 2,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: '#1c1917',

    fontSize: 18,

    fontWeight: '800',
  },

  subtitle: {
    color: '#78716c',

    fontSize: 10,

    marginTop: 3,
  },


  /* ===================================================
     SEARCH
     =================================================== */

  searchContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#fafaf9',

    borderWidth: 1,

    borderColor: '#e7e5e4',

    borderRadius: 15,

    minHeight: 43,

    paddingHorizontal: 11,

    marginTop: 13,
  },

  searchInput: {
    flex: 1,

    color: '#1c1917',

    fontSize: 11,

    paddingHorizontal: 8,

    paddingVertical: 8,
  },

  clearButton: {
    padding: 4,
  },


  /* ===================================================
     FILTER TABS
     =================================================== */

  tabsContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    paddingBottom: 12,

    paddingRight: 12,
  },

  tabsScroll: {
    flexGrow: 0,

    flexShrink: 0,

    maxHeight: 60,
  },

  filterTab: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 8,

    backgroundColor: '#ffffff',

    borderWidth: 1,

    borderColor: '#e7e2df',

    borderRadius: 16,

    paddingHorizontal: 12,

    paddingVertical: 9,

    minWidth: 112,

    height: 44,

    alignSelf: 'flex-start',
  },

  filterTabActive: {
    backgroundColor: '#650700',

    borderColor: '#650700',

    elevation: 2,

    shadowColor: '#650700',

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.15,

    shadowRadius: 8,
  },

  filterTabText: {
    color: '#57534e',

    fontSize: 10,

    fontWeight: '800',
  },

  filterTabTextActive: {
    color: '#ffffff',
  },

  tabCount: {
    minWidth: 18,

    height: 18,

    paddingHorizontal: 4,

    borderRadius: 9,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',
  },

  tabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.20)',
  },

  tabCountWarning: {
    backgroundColor: '#f59e0b',
  },

  tabCountText: {
    color: '#57534e',

    fontSize: 8,

    fontWeight: '800',
  },

  tabCountTextActive: {
    color: '#ffffff',
  },

  tabCountWarningText: {
    color: '#ffffff',
  },


  /* ===================================================
     ORDER LIST
     =================================================== */

  orderList: {
    gap: 9,
  },


  /* ===================================================
     ORDER CARD
     =================================================== */

  orderCard: {
    backgroundColor: '#ffffff',

    borderWidth: 1,

    borderColor: '#e7e5e4',

    borderRadius: 18,

    padding: 12,

    elevation: 1,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.04,

    shadowRadius: 4,
  },

  orderCardSelected: {
    borderColor: '#650700',

    borderWidth: 1.5,

    backgroundColor: '#fffaf8',
  },

  orderTop: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: 8,
  },

  customerSection: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,

    minWidth: 0,
  },

  initials: {
    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor: '#650700',

    alignItems: 'center',

    justifyContent: 'center',
  },

  initialsText: {
    color: '#ffffff',

    fontSize: 11,

    fontWeight: '800',
  },

  customerInfo: {
    flex: 1,

    marginLeft: 9,

    minWidth: 0,
  },

  customerNameRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,
  },

  customerName: {
    color: '#1c1917',

    fontSize: 11,

    fontWeight: '800',

    flexShrink: 1,
  },

  orderNumber: {
    color: '#a8a29e',

    fontSize: 8,

    fontFamily: 'monospace',
  },

  customerLocation: {
    color: '#a8a29e',

    fontSize: 8,

    marginTop: 3,
  },

  orderDate: {
    color: '#a8a29e',

    fontSize: 8,

    marginTop: 3,
  },

  amountSection: {
    alignItems: 'flex-end',
  },

  amount: {
    color: '#1c1917',

    fontSize: 12,

    fontWeight: '800',
  },

  statusBadge: {
    paddingHorizontal: 7,

    paddingVertical: 4,

    borderRadius: 7,

    marginTop: 4,
  },

  statusText: {
    fontSize: 7,

    fontWeight: '800',
  },


  /* ===================================================
     ORDER BOTTOM
     =================================================== */

  orderDivider: {
    height: 1,

    backgroundColor: '#f0eeec',

    marginVertical: 10,
  },

  orderBottom: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  itemsText: {
    color: '#57534e',

    fontSize: 9,

    fontWeight: '700',
  },

  branchText: {
    color: '#a8a29e',

    fontSize: 8,

    marginTop: 4,
  },

  orderArrow: {
    width: 27,

    height: 27,

    borderRadius: 9,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',
  },


  /* ===================================================
     EMPTY
     =================================================== */

  emptyCard: {
    backgroundColor: '#ffffff',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#e7e2df',

    paddingVertical: 42,

    paddingHorizontal: 24,

    alignItems: 'center',

    marginTop: 8,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 1 },

    shadowOpacity: 0.03,

    shadowRadius: 6,
  },

  emptyIcon: {
    width: 52,

    height: 52,

    borderRadius: 16,

    backgroundColor: '#fff7ed',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 12,
  },

  emptyTitle: {
    color: '#1c1917',

    fontSize: 13,

    fontWeight: '800',

    textAlign: 'center',
  },

  emptyDescription: {
    color: '#78716c',

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 8,

    maxWidth: 260,
  },

  clearFiltersButton: {
    marginTop: 14,

    paddingHorizontal: 12,

    paddingVertical: 8,
  },

  clearFiltersText: {
    color: '#650700',

    fontSize: 10,

    fontWeight: '800',
  },


  /* ===================================================
     PRESS
     =================================================== */

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


});

export default OrdersScreen;
