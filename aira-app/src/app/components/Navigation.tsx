import React from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Home,
  ShoppingBag,
  UtensilsCrossed,
  Star,
} from 'lucide-react-native';
import type { NavigationProps, TabItem } from '../../types';

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  isInline = false,
}) => {
  const insets = useSafeAreaInsets();

  /*
   * DESIGN-ONLY DATA
   *
   * No AuthContext
   * No AppContext
   * No database
   * No API
   * No permission logic
   */

  const tabs: TabItem[] = [
    {
      key: 'home',
      label: 'Home',
      icon: (
        <Home
          size={19}
          color={activeTab === 'home' ? '#650700' : '#8d706b'}
        />
      ),
    },

    {
      key: 'orders',
      label: 'Orders',
      icon: (
        <ShoppingBag
          size={19}
          color={activeTab === 'orders' ? '#650700' : '#8d706b'}
        />
      ),
    },

    {
      key: 'menu',
      label: 'Menu',
      icon: (
        <UtensilsCrossed
          size={19}
          color={activeTab === 'menu' ? '#650700' : '#8d706b'}
        />
      ),
    },

    {
      key: 'reviews',
      label: 'Reviews',
      icon: (
        <Star
          size={19}
          color={activeTab === 'reviews' ? '#650700' : '#8d706b'}
        />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.navigation,
        isInline
          ? styles.inlineNavigation
          : styles.fixedNavigation,
        { paddingBottom: insets.bottom },
      ]}
    >

      <View style={styles.tabsContainer}>

        {tabs.map((tab) => {

          const isActive = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >

              {/* ICON */}

              <View style={styles.iconContainer}>

                {tab.icon}

                {/* BADGE */}

                {tab.badge !== undefined &&
                  tab.badge > 0 && (

                    <View style={styles.badge}>

                      <Text style={styles.badgeText}>
                        {tab.badge}
                      </Text>

                    </View>

                  )}

              </View>


              {/* LABEL */}

              <Text
                style={[
                  styles.label,
                  isActive
                    ? styles.activeLabel
                    : styles.inactiveLabel,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>


              {/* ACTIVE INDICATOR */}

              {isActive && (
                <View style={styles.activeIndicator} />
              )}

            </Pressable>
          );
        })}

      </View>

    </View>
  );
};

export default Navigation;


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

  /* ===================================================
     NAVIGATION
     =================================================== */

  navigation: {
    backgroundColor: 'rgba(255,255,255,0.97)',

    borderTopWidth: 1,

    borderTopColor: '#e8e1db',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: -3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 12,

    zIndex: 50,
  },

  /*
   * Used when Navigation is inside a parent layout.
   */

  inlineNavigation: {
    width: '100%',
  },

  /*
   * Used as a fixed bottom navigation.
   */

  fixedNavigation: {
    position: 'absolute',

    left: 0,

    right: 0,

    bottom: 0,

    width: '100%',
  },


  /* ===================================================
     TABS
     =================================================== */

  tabsContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-around',

    paddingHorizontal: 4,

    paddingTop: 5,

    paddingBottom: 7,
  },

  tab: {
    flex: 1,

    minHeight: 54,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 12,

    position: 'relative',

    paddingHorizontal: 2,
  },

  activeTab: {
    backgroundColor: 'rgba(101,7,0,0.035)',
  },


  /* ===================================================
     ICON
     =================================================== */

  iconContainer: {
    position: 'relative',

    width: 28,

    height: 25,

    alignItems: 'center',

    justifyContent: 'center',
  },


  /* ===================================================
     BADGE
     =================================================== */

  badge: {
    position: 'absolute',

    top: -5,

    right: -5,

    minWidth: 16,

    height: 16,

    borderRadius: 8,

    paddingHorizontal: 4,

    backgroundColor: '#650700',

    borderWidth: 1.5,

    borderColor: '#ffffff',

    alignItems: 'center',

    justifyContent: 'center',
  },

  badgeText: {
    color: '#ffffff',

    fontSize: 8,

    fontWeight: '800',

    textAlign: 'center',
  },


  /* ===================================================
     LABEL
     =================================================== */

  label: {
    fontSize: 9,

    marginTop: 3,

    lineHeight: 11,

    textAlign: 'center',

    maxWidth: 60,
  },

  activeLabel: {
    color: '#650700',

    fontWeight: '800',
  },

  inactiveLabel: {
    color: '#59413c',

    fontWeight: '600',
  },


  /* ===================================================
     ACTIVE LINE
     =================================================== */

  activeIndicator: {
    width: 18,

    height: 2.5,

    borderRadius: 3,

    backgroundColor: '#650700',

    marginTop: 4,
  },


  /* ===================================================
     PRESS
     =================================================== */

  pressed: {
    opacity: 0.65,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

});
