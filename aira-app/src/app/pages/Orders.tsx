import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';

import {
  Search,
  X,
  PlusCircle,
  Building2,
  Inbox,
  ChevronRight,
  Package,
} from 'lucide-react-native';

interface OrdersScreenProps {
  onSelectOrder?: (orderId: string) => void;
  selectedOrderId?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  pincode: string;
  branch: string;
  items: number;
  itemName: string;
  totalAmount: number;
  status:
    | 'pending'
    | 'payment_verification'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  assigned: boolean;
}

interface FilterTab {
  id: string;
  label: string;
  count: number;
  badge?: boolean;
}


/* =====================================================
   STATIC DESIGN DATA
   ===================================================== */

const ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-1042',
    customerName: 'Rahul Kumar',
    customerPhone: '9876543210',
    city: 'Bangalore',
    pincode: '560001',
    branch: 'Central',
    items: 2,
    itemName: 'Mango Pickle',
    totalAmount: 850,
    status: 'payment_verification',
    assigned: true,
  },

  {
    id: '2',
    orderNumber: 'ORD-1041',
    customerName: 'Priya Sharma',
    customerPhone: '9988776655',
    city: 'Mysore',
    pincode: '570001',
    branch: 'Mysore',
    items: 3,
    itemName: 'Avakaya Pickle',
    totalAmount: 1240,
    status: 'pending',
    assigned: false,
  },

  {
    id: '3',
    orderNumber: 'ORD-1040',
    customerName: 'Arun Kumar',
    customerPhone: '9123456789',
    city: 'Bangalore',
    pincode: '560034',
    branch: 'Central',
    items: 1,
    itemName: 'Gongura Pickle',
    totalAmount: 650,
    status: 'confirmed',
    assigned: true,
  },

  {
    id: '4',
    orderNumber: 'ORD-1039',
    customerName: 'Sneha Reddy',
    customerPhone: '9012345678',
    city: 'Hyderabad',
    pincode: '500001',
    branch: 'Hyderabad',
    items: 4,
    itemName: 'Tomato Pickle',
    totalAmount: 1560,
    status: 'processing',
    assigned: true,
  },

  {
    id: '5',
    orderNumber: 'ORD-1038',
    customerName: 'Vikram Singh',
    customerPhone: '9345678901',
    city: 'Bangalore',
    pincode: '560068',
    branch: 'Central',
    items: 2,
    itemName: 'Garlic Pickle',
    totalAmount: 920,
    status: 'shipped',
    assigned: true,
  },

  {
    id: '6',
    orderNumber: 'ORD-1037',
    customerName: 'Anjali Rao',
    customerPhone: '9456789012',
    city: 'Mangalore',
    pincode: '575001',
    branch: 'Mangalore',
    items: 3,
    itemName: 'Lemon Pickle',
    totalAmount: 1100,
    status: 'delivered',
    assigned: true,
  },

  {
    id: '7',
    orderNumber: 'ORD-1036',
    customerName: 'Kiran Patel',
    customerPhone: '9567890123',
    city: 'Bangalore',
    pincode: '560040',
    branch: 'Central',
    items: 2,
    itemName: 'Mixed Pickle',
    totalAmount: 780,
    status: 'pending',
    assigned: false,
  },
];


/* =====================================================
   BRANCHES
   ===================================================== */

const BRANCHES = [
  'Central',
  'Mysore',
  'Hyderabad',
  'Mangalore',
];


/* =====================================================
   ORDERS SCREEN
   ===================================================== */

const OrdersScreen: React.FC<OrdersScreenProps> = ({
  onSelectOrder,
  selectedOrderId,
}) => {

  const [activeTab, setActiveTab] = useState('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [branchFilter, setBranchFilter] = useState('all');


  /* ===================================================
     FILTER ORDERS
     =================================================== */

  const filteredOrders = useMemo(() => {

    return ORDERS.filter((order) => {

      /* TAB FILTER */

      if (activeTab === 'needs_verification') {

        if (
          order.status !== 'pending' &&
          order.status !== 'payment_verification'
        ) {
          return false;
        }

      } else if (activeTab === 'needs_routing') {

        if (
          order.assigned ||
          order.status !== 'pending'
        ) {
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


      /* BRANCH FILTER */

      if (branchFilter !== 'all') {

        if (branchFilter === 'unassigned') {

          if (order.assigned) {
            return false;
          }

        } else if (order.branch !== branchFilter) {

          return false;

        }

      }


      /* SEARCH */

      if (searchQuery.trim()) {

        const query = searchQuery
          .toLowerCase()
          .trim();

        const matches =
          order.orderNumber
            .toLowerCase()
            .includes(query) ||

          order.customerName
            .toLowerCase()
            .includes(query) ||

          order.customerPhone
            .includes(query) ||

          order.city
            .toLowerCase()
            .includes(query) ||

          order.pincode.includes(query);

        if (!matches) {
          return false;
        }
      }

      return true;

    });

  }, [
    activeTab,
    searchQuery,
    branchFilter,
  ]);


  /* ===================================================
     COUNTS
     =================================================== */

  const countVerification = ORDERS.filter(
    (order) =>
      order.status === 'pending' ||
      order.status === 'payment_verification'
  ).length;

  const countRouting = ORDERS.filter(
    (order) =>
      !order.assigned &&
      order.status === 'pending'
  ).length;

  const countProcessing = ORDERS.filter(
    (order) =>
      order.status === 'processing' ||
      order.status === 'confirmed'
  ).length;

  const countShipped = ORDERS.filter(
    (order) =>
      order.status === 'shipped'
  ).length;

  const countDelivered = ORDERS.filter(
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
      count: ORDERS.length,
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

    setBranchFilter('all');

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

          <View style={styles.headerTop}>

            <View style={styles.headerText}>

              <Text style={styles.title}>
                Live Orders Queue
              </Text>

              <Text style={styles.subtitle}>
                {filteredOrders.length}{' '}
                order
                {filteredOrders.length !== 1
                  ? 's'
                  : ''}{' '}
                matching current filters
              </Text>

            </View>


            {/* SIMULATE BUTTON */}

            <Pressable
              style={({ pressed }) => [
                styles.simulateButton,
                pressed && styles.pressed,
              ]}
            >

              <PlusCircle
                size={14}
                color="#ffffff"
              />

              <Text style={styles.simulateText}>
                Simulate
              </Text>

            </Pressable>

          </View>


          {/* =================================================
              SEARCH
              ================================================= */}

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


          {/* =================================================
              BRANCH FILTER
              ================================================= */}

          <View style={styles.branchSection}>

            <Building2
              size={15}
              color="#a8a29e"
            />

            <Text style={styles.branchLabel}>
              Branch
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.branchList}
            >

              {/* ALL */}

              <Pressable
                onPress={() => setBranchFilter('all')}
                style={[
                  styles.branchChip,
                  branchFilter === 'all' &&
                    styles.branchChipActive,
                ]}
              >

                <Text
                  style={[
                    styles.branchChipText,
                    branchFilter === 'all' &&
                      styles.branchChipTextActive,
                  ]}
                >
                  All Branches
                </Text>

              </Pressable>


              {/* UNASSIGNED */}

              <Pressable
                onPress={() =>
                  setBranchFilter('unassigned')
                }
                style={[
                  styles.branchChip,
                  branchFilter === 'unassigned' &&
                    styles.branchChipActive,
                ]}
              >

                <Text
                  style={[
                    styles.branchChipText,
                    branchFilter === 'unassigned' &&
                      styles.branchChipTextActive,
                  ]}
                >
                  ⚠️ Unassigned
                </Text>

              </Pressable>


              {/* BRANCHES */}

              {BRANCHES.map((branch) => (

                <Pressable
                  key={branch}
                  onPress={() =>
                    setBranchFilter(branch)
                  }
                  style={[
                    styles.branchChip,
                    branchFilter === branch &&
                      styles.branchChipActive,
                  ]}
                >

                  <Text
                    style={[
                      styles.branchChipText,
                      branchFilter === branch &&
                        styles.branchChipTextActive,
                    ]}
                  >
                    {branch}
                  </Text>

                </Pressable>

              ))}

            </ScrollView>

          </View>

        </View>


        {/* =================================================
            FILTER TABS
            ================================================= */}

        <ScrollView
          horizontal
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


        <View style={{ height: 25 }} />

      </ScrollView>

    </View>
  );
};


/* =====================================================
   ORDER CARD
   ===================================================== */

interface OrderCardProps {
  order: Order;
  selected: boolean;
  onPress: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  selected,
  onPress,
}) => {

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
  status: Order['status']
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
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#ffffff',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#e7e5e4',

    padding: 14,

    marginBottom: 10,

    elevation: 1,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.04,

    shadowRadius: 4,
  },

  headerTop: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: 10,
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
     SIMULATE
     =================================================== */

  simulateButton: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 5,

    backgroundColor: '#650700',

    paddingHorizontal: 11,

    paddingVertical: 9,

    borderRadius: 14,

    elevation: 2,
  },

  simulateText: {
    color: '#ffffff',

    fontSize: 10,

    fontWeight: '800',
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
     BRANCH
     =================================================== */

  branchSection: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 11,

    gap: 6,
  },

  branchLabel: {
    color: '#78716c',

    fontSize: 10,

    fontWeight: '700',
  },

  branchList: {
    gap: 6,

    paddingRight: 5,
  },

  branchChip: {
    backgroundColor: '#fafaf9',

    borderWidth: 1,

    borderColor: '#e7e5e4',

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 10,
  },

  branchChipActive: {
    backgroundColor: '#650700',

    borderColor: '#650700',
  },

  branchChipText: {
    color: '#57534e',

    fontSize: 9,

    fontWeight: '600',
  },

  branchChipTextActive: {
    color: '#ffffff',

    fontWeight: '800',
  },


  /* ===================================================
     FILTER TABS
     =================================================== */

  tabsContainer: {
    gap: 7,

    paddingBottom: 10,

    paddingRight: 10,
  },

  filterTab: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    backgroundColor: '#ffffff',

    borderWidth: 1,

    borderColor: '#e7e5e4',

    borderRadius: 15,

    paddingHorizontal: 11,

    paddingVertical: 8,
  },

  filterTabActive: {
    backgroundColor: '#650700',

    borderColor: '#650700',

    elevation: 2,
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

    borderColor: '#e7e5e4',

    paddingVertical: 45,

    paddingHorizontal: 25,

    alignItems: 'center',
  },

  emptyIcon: {
    width: 52,

    height: 52,

    borderRadius: 16,

    backgroundColor: '#fffbeb',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 10,
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

    marginTop: 6,

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

});

export default OrdersScreen;