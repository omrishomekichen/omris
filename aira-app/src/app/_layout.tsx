import { AuthProvider } from '../Context/AuthContext';
import NativeMobileHeader from './components/AppHeader';
import Navigation from './components/Navigation';
import DashboardScreen from './pages/Dashboard';
import OrdersScreen from './pages/Orders';
import Menu from './pages/Menu';
import StockScreen from './pages/Stock';
import ReviewsScreen from './pages/Reviews';
import TeamScreen from './pages/Team';

import { StatusBar } from 'react-native';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';


export default function RootLayout() {
  const [activeTab, setActiveTab] = useState<string>('home');


  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <OrdersScreen

          />
        );
      case 'home':
      default:
        return (
          <DashboardScreen
            onNavigateTab={(tab) => setActiveTab(tab)}

          />
        );
      case 'menu':
        return (
          <Menu />
        );
      case 'stock':
        return (
          <StockScreen />
        );
      case 'reviews':
        return (
          <ReviewsScreen />
        );
      case 'team':
        return (
          < TeamScreen />
        );
    }
  };


  return (
    <View style={styles.container}>
      <AuthProvider>
        <NativeMobileHeader
          activeTab={activeTab}
        />
        <StatusBar barStyle="light-content" backgroundColor="#650700" />
        {renderContent()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </AuthProvider>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});