import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import {
  Inbox,
  Clock,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  Flame,
  Star,
} from 'lucide-react-native';
import { apiGetRecentPendingOrders, dashboardkpis ,apiGetAdminLatestReviews} from '@/lib/api';
import { useAuth } from '../../Context/AuthContext';
import type { DashboardReview, DashboardScreenProps, MetricCardProps } from '../types';

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
  onSelectOrder,
}) => {
  const { session } = useAuth();
  /* =====================================================
     STATIC DESIGN DATA
     No API / Context / Database logic
     ===================================================== */

  const [unassignedOrders, setUnassignedOrders] = React.useState(0);
  const [inProgressOrders, setInProgressOrders] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [urgentOrders ,seturgentOrders]= React.useState<any[]>([]);
  const [latestReview, setLatestReview] = React.useState<DashboardReview | null>(null);
  const pendingVerification = urgentOrders.length;
  const reviewRating = Math.max(0, Math.min(5, Number(latestReview?.rating) || 0));

  const safeUnassignedOrders = Number(unassignedOrders) || 0;
  const safeInProgressOrders = Number(inProgressOrders) || 0;
  const safeTotalRevenue = Number(totalRevenue) || 0;

  useEffect(() => {
    const fetchUnassignedOrders = async () => {
      try {
        const response = await dashboardkpis(session?.token);
        if (response && response.success) {
          setUnassignedOrders(Number(response.totalUnassignedOrders ?? 0) || 0);
          setInProgressOrders(
            Number(
              response.totalpendingOrders ??
                response.totalPendingOrders ??
                response.inProgressOrders ??
                0,
            ) || 0,
          );
          setTotalRevenue(Number(response.totalRevenue ?? 0) || 0);
        }
      } catch (error) {
        console.error('Failed to load dashboard KPIs:', error);
      }
    };

    const pandingorders = async () => {
      try {
        const response = await apiGetRecentPendingOrders(session?.token);
        if (response && response.success) {
          seturgentOrders(response.orders || []);
        }
      } catch (error) {
        console.error('Failed to load recent pending orders:', error);
      }
    };

    const fetchLatestReviews = async () => {
      try{
        const response = await apiGetAdminLatestReviews(session?.token);
        if (response && response.success) {
          setLatestReview(response.reviews?.[0] || null);
        }
      } catch (error) {
        console.error('Failed to load latest reviews:', error);
      }
    };

    fetchUnassignedOrders();
    pandingorders();
    fetchLatestReviews();
  }, [session?.token]);




  const inventory = [
    {
      name: 'Mango Pickle',
      quantity: 12,
      unit: 'jars',
      percentage: 30,
      low: true,
    },
    {
      name: 'Avakaya Pickle',
      quantity: 32,
      unit: 'jars',
      percentage: 70,
      low: false,
    },
    {
      name: 'Gongura Pickle',
      quantity: 18,
      unit: 'jars',
      percentage: 48,
      low: false,
    },
  ];



  /* =====================================================
     DESIGN
     ===================================================== */

  return (
    <View style={styles.container}>

        <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >


        <View style={styles.hero}>

          {/* Decorative circle */}

          <View style={styles.heroCircle} />

          <View style={styles.heroTop}>

            <View style={styles.heroTextContainer}>

              <View style={styles.badgeRow}>

                <View style={styles.adminBadge}>

                  <Text style={styles.adminBadgeText}>
                    👑 Super Admin
                  </Text>

                </View>

                <View style={styles.locationRow}>

                  <MapPin
                    size={11}
                    color="#fcd34d"
                  />

                  <Text style={styles.locationText}>
                    Bangalore (All Branches)
                  </Text>

                </View>

              </View>

              <Text style={styles.greeting}>
                Namaskara, Hemanth!
              </Text>

              <Text style={styles.heroDescription}>
                {pendingVerification} orders need your action today.
              </Text>

            </View>


            {/* TEST PUSH */}

            <Pressable style={styles.testPushButton}>

              <Sparkles
                size={17}
                color="#fcd34d"
              />

              <Text style={styles.testPushText}>
                Test Push
              </Text>

            </Pressable>

          </View>


          {/* =================================================
              QUICK ACTIONS
              ================================================= */}

          <View style={styles.quickActions}>

            <Pressable
              onPress={() => onNavigateTab?.('orders')}
              style={styles.quickAction}
            >

              <Inbox
                size={16}
                color="#fcd34d"
              />

              <Text style={styles.quickActionText}>
                Verify ({pendingVerification})
              </Text>

            </Pressable>


            <Pressable
              onPress={() => onNavigateTab?.('simple')}
              style={styles.quickAction}
            >

              <Flame
                size={16}
                color="#fcd34d"
              />

              <Text style={styles.quickActionText}>
                Kitchen POS
              </Text>

            </Pressable>


          </View>

        </View>


        <View style={styles.metricsGrid}>

          {/* UNASSIGNED */}

          <MetricCard
            title="Unassigned"
            value={safeUnassignedOrders.toString()}
            subtitle="Needs branch routing"
            icon={<Inbox size={17} color="#650700" />}
            highlight
            onPress={() => onNavigateTab?.('orders')}
          />


          {/* KITCHEN */}

          <MetricCard
            title="In Kitchen"
            value={safeInProgressOrders.toString()}
            subtitle="Processing & Packing"
            icon={<ShoppingBag size={17} color="#650700" />}
            onPress={() => onNavigateTab?.('orders')}
          />


          {/* REVENUE */}

          <MetricCard
            title="Revenue"
            value={`₹${safeTotalRevenue.toLocaleString('en-IN')}`}
            subtitle="All branches"
            icon={<TrendingUp size={17} color="#650700" />}
          />


        </View>

        <View style={styles.sectionCard}>

          <View style={styles.sectionHeader}>

            <View style={styles.sectionTitleRow}>

              <View style={styles.liveDot} />

              <Text style={styles.sectionTitle}>
                Action Queue
              </Text>

              <View style={styles.countBadge}>

                <Text style={styles.countBadgeText}>
                  {urgentOrders.length}
                </Text>

              </View>

            </View>


            <Pressable
              onPress={() => onNavigateTab?.('orders')}
              style={styles.viewAllButton}
            >

              <Text style={styles.viewAllText}>
                View All
              </Text>

              <ArrowRight
                size={13}
                color="#650700"
              />

            </Pressable>

          </View>


          {/* ORDERS */}

          {urgentOrders.map((order, index) => {
            const displayOrderId = order.orderNumber || order.orderId || 'N/A';
            const orderKey = order.orderId || order.orderNumber || `order-${index}`;
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
              : 'Date unavailable';

            return (

            <Pressable
              key={orderKey}
              onPress={() => onSelectOrder?.(order.id || order.orderId || order.orderNumber)}
              style={styles.orderCard}
            >

              <View style={styles.orderLeft}>

                <View style={styles.initialsCircle}>

                  <Text style={styles.initialsText}>
                    {order.initials}
                  </Text>

                </View>

                <View style={styles.orderInfo}>

                  <View style={styles.orderNameRow}>

                    <Text
                      style={styles.customerName}
                      numberOfLines={1}
                    >
                      {order.customerName}
                    </Text>

                    <Text style={styles.orderId}>
                      #{displayOrderId.split('-')[1] || displayOrderId}
                    </Text>

                  </View>

                  <Text
                    style={styles.orderItems}
                    numberOfLines={1}
                  >
                    {order.items} jars •
                  </Text>

                  <Text style={styles.orderDate}>
                    Placed {orderDate}
                  </Text>

                </View>

              </View>


              <View style={styles.orderRight}>

                <Text style={styles.orderAmount}>
                  ₹{order.totalAmount}
                </Text>

                <View style={styles.statusBadge}>

                  <Text style={styles.statusText}>
                    {order.status}
                  </Text>

                </View>

              </View>

              <ChevronRight
                size={16}
                color="#a8a29e"
              />

            </Pressable>

            );
          })}

        </View>


        <View style={styles.reviewCard}>

          <View style={styles.sectionHeader}>

            <View style={styles.sectionTitleRow}>

              <Star
                size={15}
                color="#f59e0b"
                fill="#f59e0b"
              />

              <Text style={styles.reviewTitle}>
                Customer Sentiment
              </Text>

              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  {reviewRating.toFixed(1)} / 5
                </Text>

              </View>

            </View>

            <Pressable
              onPress={() => onNavigateTab?.('reviews')}
            >

              <Text style={styles.reviewLink}>
                All Reviews
              </Text>

            </Pressable>

          </View>


          {/* REVIEW */}

          <View style={styles.reviewInnerCard}>

            <View style={styles.reviewTop}>

              <Text style={styles.reviewCustomer}>
                {latestReview?.userName || 'No reviews yet'}
              </Text>

              <Text style={styles.stars}>
                {'★'.repeat(reviewRating)}
              </Text>

            </View>

            <Text style={styles.reviewComment}>
              {latestReview?.comment
                ? `"${latestReview.comment}"`
                : 'Customer reviews will appear here.'}
            </Text>

            <Text style={styles.reviewMeta}>
              {latestReview?.productName
                ? `Ordered: ${latestReview.productName} • Verified Customer`
                : 'No verified customer review available'}
            </Text>

          </View>

        </View>


        {/* Bottom spacing */}

        <View style={{ height: 25 }} />

      </ScrollView>

    </View>
  );
};


/* =====================================================
   METRIC CARD
   ===================================================== */

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  highlight,
  alert,
  onPress,
}: MetricCardProps) => {

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.metricCard,
        highlight && styles.metricHighlight,
        alert && styles.metricAlert,
        pressed && styles.pressed,
      ]}
    >

      <View style={styles.metricTop}>

        <View
          style={[
            styles.metricIcon,
            alert && styles.metricAlertIcon,
          ]}
        >
          {icon}
        </View>

        {highlight && (
          <View style={styles.attentionDot} />
        )}

      </View>


      <Text style={styles.metricTitle}>
        {title}
      </Text>

      <Text
        style={[
          styles.metricValue,
          alert && styles.alertValue,
        ]}
      >
        {value}
      </Text>

      <Text style={styles.metricSubtitle}>
        {subtitle}
      </Text>

    </Pressable>
  );
};


export default DashboardScreen;


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

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 85,
    flexGrow: 1,
  },


  /* =================================================
     HERO
     ================================================= */

  hero: {
    backgroundColor: '#650700',

    borderRadius: 22,

    padding: 16,

    overflow: 'hidden',

    marginBottom: 12,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  heroCircle: {
    position: 'absolute',

    width: 150,
    height: 150,

    borderRadius: 75,

    backgroundColor: '#f59e0b',

    opacity: 0.08,

    right: -45,
    top: -55,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 7,
  },

  adminBadge: {
    backgroundColor: '#fbbf24',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 12,
  },

  adminBadgeText: {
    color: '#650700',

    fontSize: 9,

    fontWeight: '800',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 3,
  },

  locationText: {
    color: '#fde68a',

    fontSize: 9,

    fontWeight: '600',
  },

  greeting: {
    color: '#ffffff',

    fontSize: 20,

    fontWeight: '800',

    marginTop: 3,
  },

  heroDescription: {
    color: '#ffd6cf',

    fontSize: 11,

    marginTop: 3,
  },


  /* TEST PUSH */

  testPushButton: {
    width: 58,
    height: 58,

    borderRadius: 17,

    backgroundColor: 'rgba(255,255,255,0.10)',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 4,
  },

  testPushText: {
    color: '#ffffff',

    fontSize: 8,

    fontWeight: '800',
  },


  /* QUICK ACTIONS */

  quickActions: {
    flexDirection: 'row',

    gap: 7,

    marginTop: 15,

    paddingTop: 12,

    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },

  quickAction: {
    flex: 1,

    minHeight: 48,

    borderRadius: 12,

    backgroundColor: 'rgba(255,255,255,0.10)',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 4,
  },

  quickActionText: {
    color: '#ffffff',

    fontSize: 9,

    fontWeight: '700',
  },


  /* =================================================
     METRICS
     ================================================= */

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 9,

    marginBottom: 12,
  },

  metricCard: {
    width: '48.5%',

    minHeight: 135,

    backgroundColor: '#ffffff',

    borderRadius: 18,

    padding: 13,

    borderWidth: 1,
    borderColor: '#e7e5e4',

    elevation: 1,
  },

  metricHighlight: {
    borderColor: '#fcd34d',
  },

  metricAlert: {
    borderColor: '#fecaca',
  },

  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  metricIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor: '#fef3c7',

    alignItems: 'center',
    justifyContent: 'center',
  },

  metricAlertIcon: {
    backgroundColor: '#fee2e2',
  },

  attentionDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#f59e0b',
  },

  metricTitle: {
    color: '#78716c',

    fontSize: 10,

    fontWeight: '700',
  },

  metricValue: {
    color: '#1c1917',

    fontSize: 23,

    fontWeight: '800',

    marginTop: 2,
  },

  alertValue: {
    color: '#dc2626',
  },

  metricSubtitle: {
    color: '#a8a29e',

    fontSize: 9,

    marginTop: 2,
  },


  /* =================================================
     WARNING
     ================================================= */

  warningCard: {
    minHeight: 68,

    backgroundColor: '#fff7ed',

    borderWidth: 1,
    borderColor: '#fcd34d',

    borderRadius: 17,

    paddingHorizontal: 11,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 12,
  },

  warningLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  warningIcon: {
    width: 34,
    height: 34,

    borderRadius: 11,

    backgroundColor: '#f59e0b',

    alignItems: 'center',
    justifyContent: 'center',
  },

  warningTextContainer: {
    marginLeft: 9,

    flex: 1,
  },

  warningTitle: {
    color: '#451a03',

    fontSize: 11,

    fontWeight: '800',
  },

  warningDescription: {
    color: '#92400e',

    fontSize: 9,

    marginTop: 2,
  },

  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewText: {
    color: '#78350f',

    fontSize: 10,

    fontWeight: '800',
  },


  /* =================================================
     SECTION CARD
     ================================================= */

  sectionCard: {
    backgroundColor: '#ffffff',

    borderRadius: 20,

    padding: 14,

    borderWidth: 1,
    borderColor: '#e7e5e4',

    marginBottom: 12,

    elevation: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 11,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    flexShrink: 1,
  },

  sectionTitle: {
    color: '#1c1917',

    fontSize: 14,

    fontWeight: '800',
  },

  liveDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#10b981',
  },

  countBadge: {
    backgroundColor: '#f5f5f4',

    borderRadius: 10,

    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  countBadgeText: {
    color: '#57534e',

    fontSize: 9,

    fontWeight: '800',
  },

  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 3,
  },

  viewAllText: {
    color: '#650700',

    fontSize: 10,

    fontWeight: '800',
  },


  /* =================================================
     ORDERS
     ================================================= */

  orderCard: {
    minHeight: 70,

    backgroundColor: '#fdfaf7',

    borderWidth: 1,
    borderColor: '#e7e5e4',

    borderRadius: 15,

    paddingHorizontal: 9,

    marginBottom: 8,

    flexDirection: 'row',
    alignItems: 'center',
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,

    minWidth: 0,
  },

  initialsCircle: {
    width: 39,
    height: 39,

    borderRadius: 14,

    backgroundColor: '#650700',

    alignItems: 'center',
    justifyContent: 'center',
  },

  initialsText: {
    color: '#ffffff',

    fontSize: 10,

    fontWeight: '800',
  },

  orderInfo: {
    flex: 1,

    marginLeft: 9,

    minWidth: 0,
  },

  orderNameRow: {
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

  orderId: {
    color: '#a8a29e',

    fontSize: 8,

    fontFamily: 'monospace',
  },

  orderItems: {
    color: '#78716c',

    fontSize: 9,

    marginTop: 3,
  },

  orderDate: {
    color: '#a8a29e',

    fontSize: 8,

    marginTop: 3,
  },

  orderRight: {
    alignItems: 'flex-end',

    marginLeft: 5,
  },

  orderAmount: {
    color: '#1c1917',

    fontSize: 11,

    fontWeight: '800',
  },

  statusBadge: {
    backgroundColor: '#fef3c7',

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRadius: 6,

    marginTop: 3,
  },

  statusText: {
    color: '#92400e',

    fontSize: 7,

    fontWeight: '800',
  },


  /* =================================================
     INVENTORY
     ================================================= */

  inventoryItem: {
    marginBottom: 12,
  },

  inventoryHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 5,
  },

  inventoryName: {
    color: '#292524',

    fontSize: 10,

    fontWeight: '700',

    flex: 1,
  },

  inventoryQuantity: {
    color: '#57534e',

    fontSize: 9,

    fontWeight: '700',
  },

  lowQuantity: {
    color: '#dc2626',
  },

  progressBackground: {
    width: '100%',

    height: 7,

    backgroundColor: '#f5f5f4',

    borderRadius: 8,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 8,
  },


  /* =================================================
     REVIEWS
     ================================================= */

  reviewCard: {
    backgroundColor: '#fffbeb',

    borderWidth: 1,
    borderColor: '#fde68a',

    borderRadius: 20,

    padding: 14,

    marginBottom: 12,
  },

  reviewTitle: {
    color: '#451a03',

    fontSize: 13,

    fontWeight: '800',
  },

  ratingBadge: {
    backgroundColor: '#fde68a',

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRadius: 8,
  },

  ratingText: {
    color: '#78350f',

    fontSize: 8,

    fontWeight: '800',
  },

  reviewLink: {
    color: '#78350f',

    fontSize: 10,

    fontWeight: '800',
  },

  reviewInnerCard: {
    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#fef3c7',

    borderRadius: 15,

    padding: 11,
  },

  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },

  reviewCustomer: {
    color: '#292524',

    fontSize: 11,

    fontWeight: '800',
  },

  stars: {
    color: '#b45309',

    fontSize: 10,

    fontWeight: '800',
  },

  reviewComment: {
    color: '#57534e',

    fontSize: 10,

    lineHeight: 16,

    fontStyle: 'italic',

    marginTop: 6,
  },

  reviewMeta: {
    color: '#a8a29e',

    fontSize: 8,

    marginTop: 7,
  },


  /* =================================================
     PRESS
     ================================================= */

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

});