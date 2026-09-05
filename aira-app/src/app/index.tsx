
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { useAuth } from '../Context/AuthContext';

import LoginScreen from './pages/Login';
import DashboardScreen from './pages/Dashboard';
export default function Index() {
  const { session, loading } = useAuth();

  // Authentication is still loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#650700"
        />
      </View>
    );
  }

  // User is not logged in
  if (!session) {
    return <LoginScreen />;
  }

  // User is logged in
  return (
    <DashboardScreen
      onNavigateTab={() => {}}
      onSelectOrder={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf7f3',
  },
});
