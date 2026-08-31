import React, { useState } from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {
  Bell,
  ChevronLeft,
  Crown,
  Database,
  LogOut,
  Sparkles,
  Code2,
  X,
  Smartphone,
  Shield,
} from 'lucide-react-native';
import {useAuth} from '../../Context/AuthContext'

interface NativeMobileHeaderProps {
  activeTab?: string;
  isOrderDetail?: boolean;
  onBackFromOrder?: () => void;
}

const AIRA_LOGO = require('../../../assets/images/aira-pickles-logo.png');

const NativeMobileHeader = ({
  activeTab = 'home',
  isOrderDetail = false,
  onBackFromOrder,
}: NativeMobileHeaderProps) => {

  /* =====================================================
     ONLY UI STATE
     ===================================================== */

  const [profileOpen, setProfileOpen] = useState(false);
      const { login , session,  profile,logout} = useAuth();

  /* =====================================================
     PAGE TITLES
     ===================================================== */

  const TAB_TITLES: Record<string, string> = {
    home: 'Dashboard',
    orders: 'Orders',
    menu: 'Menu Catalog',
    stock: 'Stock Inventory',
    reviews: 'Customer Reviews',
    simple: 'Kitchen Counter',
    team: 'Team & Roles',
  };

  const screenTitle = isOrderDetail
    ? 'Order Details'
    : TAB_TITLES[activeTab] || 'Aira Admin';

  /* =====================================================
     UI
     ===================================================== */

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
          ================================================= */}

      <SafeAreaView style={styles.headerSafeArea}>

        <View style={styles.header}>

          {/* LEFT SIDE */}

          <View style={styles.headerLeft}>

            {isOrderDetail ? (

              <Pressable
                onPress={onBackFromOrder}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.pressed,
                ]}
              >

                <ChevronLeft
                  size={20}
                  color="#ffffff"
                />

                <Text style={styles.backText}>
                  Back
                </Text>

              </Pressable>

            ) : (

              <View style={styles.brandContainer}>

                <Image
                  source={AIRA_LOGO}
                  style={styles.headerLogo}
                  resizeMode="cover"
                />

                <View style={styles.titleContainer}>

                  <Text
                    style={styles.screenTitle}
                    numberOfLines={1}
                  >
                    {screenTitle}
                  </Text>

                  <Text style={styles.subtitle}>
                    Aira Kitchen Console
                  </Text>

                </View>

              </View>

            )}

          </View>


          {/* RIGHT SIDE */}

          <View style={styles.headerActions}>

            {/* Notification */}

            <Pressable
              style={({ pressed }) => [
                styles.notificationButton,
                pressed && styles.pressed,
              ]}
            >

              <Bell
                size={18}
                color="#ffffff"
              />

              <View style={styles.notificationBadge}>

                <Text style={styles.notificationBadgeText}>
                  3
                </Text>

              </View>

            </Pressable>


            {/* Profile */}

            <Pressable
              onPress={() => setProfileOpen(true)}
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.pressed,
              ]}
            >

              <Image
                source={AIRA_LOGO}
                style={styles.profileImage}
                resizeMode="cover"
              />

            </Pressable>

          </View>

        </View>

      </SafeAreaView>


      {/* =================================================
          ADMIN RIBBON
          ================================================= */}

      <View style={styles.adminRibbon}>

        <View style={styles.adminRibbonLeft}>

          <Crown
            size={15}
            color="#451a03"
          />

          <Text style={styles.adminRibbonText}>
            Viewing as Kitchen Admin
          </Text>

        </View>

        <Pressable style={styles.exitButton}>

          <Text style={styles.exitText}>
            Exit
          </Text>

        </Pressable>

      </View>


      {/* =================================================
          PROFILE BOTTOM SHEET
          IMPORTANT:
          This is a MODAL.
          It is NOT permanently rendered.
          ================================================= */}

      <Modal
        visible={profileOpen}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setProfileOpen(false)}
      >

        <View style={styles.modalContainer}>

          {/* BACKDROP */}

          <Pressable
            style={styles.backdrop}
            onPress={() => setProfileOpen(false)}
          />


          {/* BOTTOM SHEET */}

          <SafeAreaView style={styles.bottomSheet}>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >

              {/* HANDLE */}

              <View style={styles.sheetHandle} />


              {/* =========================================
                  PROFILE HEADER
                  ========================================= */}

              <View style={styles.profileHeader}>

                <View style={styles.profileInfo}>

                  <Image
                    source={AIRA_LOGO}
                    style={styles.largeAvatar}
                    resizeMode="cover"
                  />

                  <View style={styles.profileDetails}>

                    <Text style={styles.profileName}>
                      Aira Admin
                    </Text>

                    <View style={styles.profileMeta}>

                      <View style={styles.roleBadge}>

                        <Shield
                          size={11}
                          color="#650700"
                        />

                        <Text style={styles.roleBadgeText}>
                          Owner
                        </Text>

                      </View>

                      <Text style={styles.email}>
                        admin@airapickles.com
                      </Text>

                    </View>

                  </View>

                </View>


                {/* CLOSE */}

                <Pressable
                  onPress={() => setProfileOpen(false)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.pressedLight,
                  ]}
                >

                  <X
                    size={19}
                    color="#57534e"
                  />

                </Pressable>

              </View>


              {/* =========================================
                  MOBILE TOOLS
                  ========================================= */}

              <Text style={styles.sectionTitle}>
                MOBILE TOOLS & TESTING
              </Text>


              {/* TOOL 1 */}

              <Pressable style={styles.toolButton}>

                <View style={styles.toolLeft}>

                  <View style={styles.amberIcon}>

                    <Sparkles
                      size={17}
                      color="#d97706"
                    />

                  </View>

                  <Text style={styles.toolText}>
                    Simulate Incoming Order Push
                  </Text>

                </View>

                <View style={styles.testBadge}>

                  <Text style={styles.testBadgeText}>
                    Test Push
                  </Text>

                </View>

              </Pressable>


              {/* TOOL 2 */}

              <Pressable style={styles.toolButton}>

                <View style={styles.toolLeft}>

                  <View style={styles.grayIcon}>

                    <Database
                      size={17}
                      color="#650700"
                    />

                  </View>

                  <Text style={styles.toolText}>
                    Local SQLite & Backend Sync
                  </Text>

                </View>

                <View style={styles.syncBadge}>

                  <Text style={styles.syncText}>
                    Synced
                  </Text>

                </View>

              </Pressable>


              {/* TOOL 3 */}

              <Pressable style={styles.toolButton}>

                <View style={styles.toolLeft}>

                  <View style={styles.blueIcon}>

                    <Code2
                      size={17}
                      color="#2563eb"
                    />

                  </View>

                  <Text style={styles.toolText}>
                    React Native / Expo Codebase
                  </Text>

                </View>

                <View style={styles.viewFilesBadge}>

                  <Text style={styles.viewFilesText}>
                    View App Files
                  </Text>

                </View>

              </Pressable>


              {/* TOOL 4 */}

              <Pressable style={styles.toolButton}>

                <View style={styles.toolLeft}>

                  <View style={styles.purpleIcon}>

                    <Smartphone
                      size={17}
                      color="#9333ea"
                    />

                  </View>

                  <Text style={styles.toolText}>
                    Device Frame View
                  </Text>

                </View>

                <Text style={styles.deviceText}>
                  Full Mobile View
                </Text>

              </Pressable>


              {/* =========================================
                  ACTIVE ACCOUNT
                  ========================================= */}

              <View style={styles.accountHeader}>

                <Text style={styles.sectionTitle}>
                  SWITCH ACTIVE ACCOUNT
                </Text>

                <Crown
                  size={14}
                  color="#d97706"
                />

              </View>


              {/* ACCOUNT */}

              <View style={styles.accountCard}>

                <View style={styles.accountLeft}>

                  <Image
                    source={AIRA_LOGO}
                    style={styles.accountAvatar}
                    resizeMode="cover"
                  />

                  <View>

                    <Text style={styles.accountName}>
                      Aira Admin
                    </Text>

                    <Text style={styles.accountRole}>
                      OWNER • CENTRAL HQ
                    </Text>

                  </View>

                </View>

                <Text style={styles.currentText}>
                  ✓ Current
                </Text>

              </View>


              {/* =========================================
                  LOGOUT
                  ========================================= */}

              <Pressable style={styles.logoutButton} onPress={() => logout()}>

                <LogOut
                  size={16}
                  color="#b91c1c"
                />

                <Text style={styles.logoutText}>
                  Log Out of Mobile Terminal
                </Text>

              </Pressable>

            </ScrollView>

          </SafeAreaView>

        </View>

      </Modal>

    </View>
  );
};

export default NativeMobileHeader;


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

  /* MAIN */

  container: {
    backgroundColor: '#650700',
  },


  /* HEADER */

  headerSafeArea: {
    backgroundColor: '#650700',
  },

  header: {
    height: 58,
    paddingHorizontal: 14,

    backgroundColor: '#650700',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flex: 1,
    minWidth: 0,
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#fcd34d',
  },

  titleContainer: {
    marginLeft: 10,
    flex: 1,
  },

  screenTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  subtitle: {
    color: '#ffdad4',
    fontSize: 10,
    marginTop: 2,
  },


  /* HEADER ACTIONS */

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: 'rgba(255,255,255,0.10)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadge: {
    position: 'absolute',

    top: -2,
    right: -2,

    width: 17,
    height: 17,
    borderRadius: 9,

    backgroundColor: '#fbbf24',

    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadgeText: {
    color: '#650700',
    fontSize: 9,
    fontWeight: '800',
  },

  profileButton: {
    width: 35,
    height: 35,

    borderRadius: 18,

    borderWidth: 2,
    borderColor: '#fcd34d',

    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },


  /* BACK */

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.10)',

    paddingHorizontal: 9,
    paddingVertical: 7,

    borderRadius: 18,
  },

  backText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },


  /* ADMIN RIBBON */

  adminRibbon: {
    height: 36,

    backgroundColor: '#f59e0b',

    paddingHorizontal: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  adminRibbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  adminRibbonText: {
    color: '#451a03',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },

  exitButton: {
    backgroundColor: '#451a03',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 6,
  },

  exitText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },


  /* ================================================
     MODAL
     ================================================ */

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },


  /* ================================================
     BOTTOM SHEET
     ================================================ */

  bottomSheet: {
    backgroundColor: '#ffffff',

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    maxHeight: '86%',

    elevation: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 15,
  },

  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 35,
  },

  sheetHandle: {
    width: 48,
    height: 5,

    borderRadius: 4,

    backgroundColor: '#d1d5db',

    alignSelf: 'center',

    marginBottom: 18,
  },


  /* ================================================
     PROFILE
     ================================================ */

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingBottom: 15,
    marginBottom: 18,

    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  largeAvatar: {
    width: 50,
    height: 50,

    borderRadius: 25,

    borderWidth: 2,
    borderColor: '#650700',
  },

  profileDetails: {
    marginLeft: 12,
    flex: 1,
  },

  profileName: {
    color: '#111827',

    fontSize: 14,
    fontWeight: '700',
  },

  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 5,
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fef3c7',

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRadius: 8,
  },

  roleBadgeText: {
    color: '#650700',

    fontSize: 9,
    fontWeight: '700',

    marginLeft: 3,
  },

  email: {
    color: '#6b7280',

    fontSize: 9,

    marginLeft: 6,
  },

  closeButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: '#f3f4f6',

    alignItems: 'center',
    justifyContent: 'center',
  },


  /* ================================================
     SECTIONS
     ================================================ */

  sectionTitle: {
    color: '#94a3b8',

    fontSize: 10,

    fontWeight: '800',

    letterSpacing: 1,

    marginBottom: 9,
  },


  /* ================================================
     TOOL BUTTONS
     ================================================ */

  toolButton: {
    minHeight: 58,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: '#e2e8f0',

    backgroundColor: '#f8fafc',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 12,

    marginBottom: 8,
  },

  toolLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  toolText: {
    color: '#334155',

    fontSize: 11,

    fontWeight: '600',

    marginLeft: 9,

    flexShrink: 1,
  },


  /* ICON BOXES */

  amberIcon: {
    width: 32,
    height: 32,

    borderRadius: 9,

    backgroundColor: '#fef3c7',

    alignItems: 'center',
    justifyContent: 'center',
  },

  grayIcon: {
    width: 32,
    height: 32,

    borderRadius: 9,

    backgroundColor: '#f1f5f9',

    alignItems: 'center',
    justifyContent: 'center',
  },

  blueIcon: {
    width: 32,
    height: 32,

    borderRadius: 9,

    backgroundColor: '#dbeafe',

    alignItems: 'center',
    justifyContent: 'center',
  },

  purpleIcon: {
    width: 32,
    height: 32,

    borderRadius: 9,

    backgroundColor: '#f3e8ff',

    alignItems: 'center',
    justifyContent: 'center',
  },


  /* BADGES */

  testBadge: {
    backgroundColor: '#fde68a',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 6,
  },

  testBadgeText: {
    color: '#92400e',

    fontSize: 9,

    fontWeight: '800',
  },

  syncBadge: {
    backgroundColor: '#d1fae5',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 6,
  },

  syncText: {
    color: '#047857',

    fontSize: 9,

    fontWeight: '800',
  },

  viewFilesBadge: {
    backgroundColor: '#dbeafe',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 6,
  },

  viewFilesText: {
    color: '#1e40af',

    fontSize: 9,

    fontWeight: '800',
  },

  deviceText: {
    color: '#64748b',

    fontSize: 9,

    fontWeight: '700',
  },


  /* ================================================
     ACCOUNT
     ================================================ */

  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 12,
  },

  accountCard: {
    minHeight: 55,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: '#f1f5f9',

    backgroundColor: '#ffffff',

    paddingHorizontal: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  accountAvatar: {
    width: 30,
    height: 30,

    borderRadius: 15,
  },

  accountName: {
    color: '#111827',

    fontSize: 11,

    fontWeight: '700',

    marginLeft: 9,
  },

  accountRole: {
    color: '#64748b',

    fontSize: 9,

    marginLeft: 9,

    marginTop: 2,
  },

  currentText: {
    color: '#650700',

    fontSize: 9,

    fontWeight: '800',
  },


  /* ================================================
     LOGOUT
     ================================================ */

  logoutButton: {
    height: 48,

    borderRadius: 12,

    backgroundColor: '#fef2f2',

    borderWidth: 1,
    borderColor: '#fecaca',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 8,
  },

  logoutText: {
    color: '#b91c1c',

    fontSize: 11,

    fontWeight: '800',

    marginLeft: 8,
  },


  /* ================================================
     PRESS
     ================================================ */

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  pressedLight: {
    opacity: 0.7,
  },

});