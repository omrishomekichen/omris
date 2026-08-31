import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

import {
  UserPlus,
  Search,
  Users,
  Shield,
  Building2,
  KeyRound,
  Lock,
} from 'lucide-react-native';

export default function TeamScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Header */}
        <View style={styles.headerCard}>

          <View style={styles.titleRow}>
            <Text style={styles.title}>
              Team & Branch Role Management
            </Text>

            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>
                4 Active
              </Text>
            </View>
          </View>

          <Text style={styles.description}>
            Invite branch managers and kitchen helpers,
            assign branch locations, and manage RBAC security.
          </Text>

          <Pressable style={styles.inviteButton}>
            <UserPlus size={16} color="#fff" />

            <Text style={styles.inviteText}>
              Invite New Admin
            </Text>
          </Pressable>

          {/* Search */}
          <View style={styles.searchBox}>
            <Search size={16} color="#8d706b" />

            <TextInput
              placeholder="Search operators by name, email, branch or role..."
              placeholderTextColor="#a8a29e"
              style={styles.searchInput}
            />
          </View>

        </View>


        {/* Summary */}
        <View style={styles.summaryRow}>

          <View style={styles.summaryCard}>
            <View style={styles.iconBox}>
              <Users size={18} color="#650700" />
            </View>

            <View>
              <Text style={styles.summaryValue}>4</Text>
              <Text style={styles.summaryLabel}>
                Total Operators
              </Text>
            </View>
          </View>


          <View style={styles.summaryCard}>
            <View style={styles.iconBox}>
              <Shield size={18} color="#166534" />
            </View>

            <View>
              <Text style={styles.summaryValue}>4</Text>
              <Text style={styles.summaryLabel}>
                Active
              </Text>
            </View>
          </View>

        </View>


        {/* Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Operator Roster
            </Text>

            <Text style={styles.sectionSubtitle}>
              4 operators found
            </Text>
          </View>

          <KeyRound
            size={17}
            color="#650700"
          />
        </View>


        {/* Team Cards */}

        <TeamCard
          initials="AS"
          name="Ananya Sharma"
          email="ananya@airapickles.com"
          role="Super Admin"
          branch="All Central Operations"
          roleType="owner"
        />

        <TeamCard
          initials="RK"
          name="Rahul Kumar"
          email="rahul@airapickles.com"
          role="Manager"
          branch="Bangalore Branch"
          roleType="manager"
        />

        <TeamCard
          initials="PR"
          name="Priya Reddy"
          email="priya@airapickles.com"
          role="Staff"
          branch="Bangalore Branch"
          roleType="staff"
        />

        <TeamCard
          initials="VK"
          name="Vijay Kumar"
          email="vijay@airapickles.com"
          role="Staff"
          branch="Mysore Branch"
          roleType="staff"
        />

      </ScrollView>
    </View>
  );
}


/* =====================================================
   DESIGN-ONLY TEAM CARD
   ===================================================== */

function TeamCard({
  initials,
  name,
  email,
  role,
  branch,
  roleType,
}: {
  initials: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  roleType: 'owner' | 'manager' | 'staff';
}) {
  return (
    <View style={styles.memberCard}>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {initials}
        </Text>
      </View>

      <View style={styles.memberInfo}>

        <View style={styles.nameRow}>
          <Text style={styles.memberName}>
            {name}
          </Text>

          <View
            style={
              roleType === 'owner'
                ? styles.ownerBadge
                : roleType === 'manager'
                ? styles.managerBadge
                : styles.staffBadge
            }
          >
            <Text
              style={
                roleType === 'owner'
                  ? styles.ownerBadgeText
                  : roleType === 'manager'
                  ? styles.managerBadgeText
                  : styles.staffBadgeText
              }
            >
              {role}
            </Text>
          </View>
        </View>

        <Text style={styles.email}>
          {email}
        </Text>

        <View style={styles.branchRow}>
          <Building2
            size={11}
            color="#8d706b"
          />

          <Text style={styles.branchText}>
            {branch}
          </Text>
        </View>

      </View>

      <View style={styles.status}>
        <View style={styles.statusDot} />

        <Text style={styles.statusText}>
          Active
        </Text>
      </View>

    </View>
  );
}


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f2',
  },

  content: {
    padding: 12,
    paddingBottom: 30,
  },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e1db',
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },

  title: {
    flex: 1,
    color: '#1e1b17',
    fontSize: 18,
    fontWeight: '800',
  },

  activeBadge: {
    backgroundColor: '#faf2ec',
    borderWidth: 1,
    borderColor: '#eee7e1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  activeBadgeText: {
    color: '#650700',
    fontSize: 8,
    fontWeight: '800',
  },

  description: {
    color: '#59413c',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },

  inviteButton: {
    height: 42,
    marginTop: 14,
    borderRadius: 13,
    backgroundColor: '#650700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  inviteText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  searchBox: {
    height: 42,
    marginTop: 12,
    borderRadius: 13,
    backgroundColor: '#faf2ec',
    borderWidth: 1,
    borderColor: '#e8e1db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11,
    color: '#1e1b17',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 14,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e1db',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#faf2ec',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryValue: {
    color: '#1e1b17',
    fontSize: 17,
    fontWeight: '900',
  },

  summaryLabel: {
    color: '#78716c',
    fontSize: 8,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    color: '#1e1b17',
    fontSize: 14,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#8d706b',
    fontSize: 9,
    marginTop: 2,
  },

  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e8e1db',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 9,
    elevation: 1,
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#650700',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },

  memberInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },

  memberName: {
    color: '#1e1b17',
    fontSize: 11,
    fontWeight: '800',
  },

  email: {
    color: '#78716c',
    fontSize: 9,
    marginTop: 3,
  },

  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  branchText: {
    color: '#8d706b',
    fontSize: 8,
    fontWeight: '600',
  },

  ownerBadge: {
    backgroundColor: '#650700',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  ownerBadgeText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '900',
  },

  managerBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  managerBadgeText: {
    color: '#78350f',
    fontSize: 7,
    fontWeight: '800',
  },

  staffBadge: {
    backgroundColor: '#e7e5e4',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  staffBadgeText: {
    color: '#57534e',
    fontSize: 7,
    fontWeight: '700',
  },

  status: {
    alignItems: 'center',
    gap: 3,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },

  statusText: {
    color: '#78716c',
    fontSize: 7,
    fontWeight: '700',
  },
});