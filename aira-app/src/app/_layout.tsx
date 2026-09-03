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
import TeamScreen from './pages/Team';
import { OrderDetailScreen } from './pages/OrderDetailScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {healthCheck} from '../lib/api';

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
        const response = await healthCheck();
      } catch (error) {
      }

    };
    checkHealth();
  }, []);
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#650700" />
      </View>
    );
  }

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
      case 'team':
        return <TeamScreen />;
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