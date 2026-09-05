import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';

import { AuthProvider, useAuth } from '../Context/AuthContext';
import NativeMobileHeader from './components/AppHeader';
import Navigation from './components/Navigation';
import LoginScreen from './pages/Login';
import DashboardScreen from './pages/Dashboard';
import OrdersScreen from './pages/Orders';
import Menu from './pages/Menu';
import ReviewsScreen from './pages/Reviews';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiLogFirebaseToken, healthCheck } from '../lib/api';
import { initializeFirebaseMessaging } from '../lib/firebaseMessaging';

// Height of the tab bar's own content (paddingTop 5 + paddingBottom 7 + tab minHeight 54)
const TAB_BAR_HEIGHT = 66;


/* =====================================================
   INNER SHELL — reads session from AuthContext
   ===================================================== */

function AppShell() {
  const { session, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Loading state — wait for Supabase session check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthCheck();
      } catch (error) {
      }

    };
    checkHealth();
  }, []);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      const token = await initializeFirebaseMessaging();
      if (token) {
        await apiLogFirebaseToken(token);
      }
    };

    void registerForPushNotifications();
  }, []);


  // Not logged in — show login screen
  if (!session) {
    return <LoginScreen />;
  }

  // Logged in — full app shell
  const renderContent = () => {
    if (selectedOrderId) {
      return (
        <OrderDetailScreen
          orderId={selectedOrderId}
          onBack={() => setSelectedOrderId(null)}
        />
      );
    }

    switch (activeTab) { 
      case 'orders':
        return (
          <OrdersScreen
            onSelectOrder={setSelectedOrderId}
          />
        );
      case 'menu':
        return <Menu />;
      case 'reviews':
        return <ReviewsScreen />;
      case 'home':
      default:
        return (
          <DashboardScreen
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectOrder={setSelectedOrderId}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <NativeMobileHeader
        activeTab={activeTab}
        isOrderDetail={Boolean(selectedOrderId)}
        onBackFromOrder={() => setSelectedOrderId(null)}
        onNavigateTab={(tab) => {
          setSelectedOrderId(null);
          setActiveTab(tab);
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="#650700" />
      <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT + insets.bottom }}>
        {renderContent()}
      </View>
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedOrderId(null);
          setActiveTab(tab);
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
    <AuthProvider>
      <AppShell />
    </AuthProvider>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf7f3',
  },
});
