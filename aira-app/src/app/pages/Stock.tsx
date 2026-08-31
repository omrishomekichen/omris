import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';

import {
  Layers,
  Search,
  AlertTriangle,
  Building2,
  CheckCircle2,
  TrendingDown,
  X,
  Plus,
  Minus,
} from 'lucide-react-native';


/* =====================================================
   TYPES
   ===================================================== */

interface StockItem {
  id: string;
  menuItemName: string;
  category: string;
  branch: string;
  quantityOnHand: number;
  lowStockThreshold: number;
  unit: string;
}


/* =====================================================
   STATIC STOCK DATA
   ===================================================== */

const STOCK_ITEMS: StockItem[] = [
  {
    id: '1',
    menuItemName: 'Mango Pickle',
    category: 'Pickles',
    branch: 'Bangalore',
    quantityOnHand: 24,
    lowStockThreshold: 10,
    unit: 'jars',
  },
  {
    id: '2',
    menuItemName: 'Avakaya Pickle',
    category: 'Pickles',
    branch: 'Bangalore',
    quantityOnHand: 7,
    lowStockThreshold: 10,
    unit: 'jars',
  },
  {
    id: '3',
    menuItemName: 'Gongura Pickle',
    category: 'Pickles',
    branch: 'Bangalore',
    quantityOnHand: 31,
    lowStockThreshold: 12,
    unit: 'jars',
  },
  {
    id: '4',
    menuItemName: 'Garlic Pickle',
    category: 'Pickles',
    branch: 'Mysore',
    quantityOnHand: 5,
    lowStockThreshold: 10,
    unit: 'jars',
  },
  {
    id: '5',
    menuItemName: 'Peanut Chutney',
    category: 'Chutneys',
    branch: 'Mysore',
    quantityOnHand: 42,
    lowStockThreshold: 15,
    unit: 'packs',
  },
  {
    id: '6',
    menuItemName: 'Curry Leaf Podi',
    category: 'Podis',
    branch: 'Bangalore',
    quantityOnHand: 35,
    lowStockThreshold: 15,
    unit: 'packs',
  },
  {
    id: '7',
    menuItemName: 'Idli Podi',
    category: 'Podis',
    branch: 'Mysore',
    quantityOnHand: 50,
    lowStockThreshold: 20,
    unit: 'packs',
  },
  {
    id: '8',
    menuItemName: 'South Indian Combo',
    category: 'Combos',
    branch: 'Bangalore',
    quantityOnHand: 12,
    lowStockThreshold: 15,
    unit: 'boxes',
  },
  {
    id: '9',
    menuItemName: 'Lemon Pickle',
    category: 'Seasonal',
    branch: 'Mysore',
    quantityOnHand: 20,
    lowStockThreshold: 10,
    unit: 'jars',
  },
];


const BRANCHES = [
  'Bangalore',
  'Mysore',
  'Hubli',
];


/* =====================================================
   STOCK SCREEN
   ===================================================== */

export default function StockScreen() {

  const [viewMode, setViewMode] =
    useState<'branch' | 'consolidated'>(
      'consolidated'
    );

  const [selectedBranch, setSelectedBranch] =
    useState('Bangalore');

  const [statusFilter, setStatusFilter] =
    useState<'all' | 'low' | 'healthy'>('all');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedStock, setSelectedStock] =
    useState<StockItem | null>(null);


  /* ===================================================
     BASE STOCK
     =================================================== */

  const baseItems = useMemo(() => {

    if (viewMode === 'consolidated') {
      return STOCK_ITEMS;
    }

    return STOCK_ITEMS.filter(
      item => item.branch === selectedBranch
    );

  }, [
    viewMode,
    selectedBranch,
  ]);


  /* ===================================================
     FILTER
     =================================================== */

  const filteredStock = useMemo(() => {

    return baseItems.filter((item) => {

      const isLow =
        item.quantityOnHand <=
        item.lowStockThreshold;


      if (
        statusFilter === 'low' &&
        !isLow
      ) {
        return false;
      }


      if (
        statusFilter === 'healthy' &&
        isLow
      ) {
        return false;
      }


      if (searchQuery.trim()) {

        const query =
          searchQuery.toLowerCase().trim();

        const matchName =
          item.menuItemName
            .toLowerCase()
            .includes(query);

        const matchCategory =
          item.category
            .toLowerCase()
            .includes(query);

        const matchBranch =
          item.branch
            .toLowerCase()
            .includes(query);

        if (
          !matchName &&
          !matchCategory &&
          !matchBranch
        ) {
          return false;
        }
      }

      return true;
    });

  }, [
    baseItems,
    statusFilter,
    searchQuery,
  ]);


  const lowCount =
    baseItems.filter(
      item =>
        item.quantityOnHand <=
        item.lowStockThreshold
    ).length;


  const healthyCount =
    baseItems.length - lowCount;


  return (

    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >


        {/* =================================================
            HEADER
            ================================================= */}

        <View style={styles.headerCard}>

          <View style={styles.headerTop}>

            <View style={styles.headerText}>

              <Text style={styles.title}>
                {viewMode === 'consolidated'
                  ? 'Consolidated Stock Radar'
                  : `${selectedBranch} Stock`}
              </Text>

              <Text style={styles.subtitle}>
                {baseItems.length} items tracked •{' '}
                {lowCount} require restocking
              </Text>

            </View>


            {/* VIEW MODE */}

            <View style={styles.viewToggle}>

              <Pressable
                onPress={() =>
                  setViewMode('consolidated')
                }
                style={[
                  styles.toggleButton,

                  viewMode ===
                    'consolidated' &&
                    styles.toggleActive,
                ]}
              >

                <Text
                  style={[
                    styles.toggleText,

                    viewMode ===
                      'consolidated' &&
                      styles.toggleTextActive,
                  ]}
                >
                  All
                </Text>

              </Pressable>


              <Pressable
                onPress={() =>
                  setViewMode('branch')
                }
                style={[
                  styles.toggleButton,

                  viewMode === 'branch' &&
                    styles.toggleActive,
                ]}
              >

                <Text
                  style={[
                    styles.toggleText,

                    viewMode === 'branch' &&
                      styles.toggleTextActive,
                  ]}
                >
                  Branch
                </Text>

              </Pressable>

            </View>

          </View>


          {/* =================================================
              BRANCH SELECTOR
              ================================================= */}

          {viewMode === 'branch' && (

            <View style={styles.branchSelector}>

              <Building2
                size={15}
                color="#78716c"
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.branchList}
              >

                {BRANCHES.map(branch => {

                  const active =
                    branch === selectedBranch;

                  return (

                    <Pressable
                      key={branch}
                      onPress={() =>
                        setSelectedBranch(branch)
                      }
                      style={[
                        styles.branchButton,

                        active &&
                          styles.branchButtonActive,
                      ]}
                    >

                      <Text
                        style={[
                          styles.branchText,

                          active &&
                            styles.branchTextActive,
                        ]}
                      >
                        {branch}
                      </Text>

                    </Pressable>

                  );

                })}

              </ScrollView>

            </View>

          )}


          {/* =================================================
              SEARCH
              ================================================= */}

          <View style={styles.searchBox}>

            <Search
              size={16}
              color="#a8a29e"
            />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search product, category, or branch..."
              placeholderTextColor="#a8a29e"
              style={styles.searchInput}
            />

            {searchQuery.length > 0 && (

              <Pressable
                onPress={() =>
                  setSearchQuery('')
                }
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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >

          {/* ALL */}

          <Pressable
            onPress={() =>
              setStatusFilter('all')
            }
            style={[
              styles.filterButton,

              statusFilter === 'all' &&
                styles.filterActive,
            ]}
          >

            <Text
              style={[
                styles.filterText,

                statusFilter === 'all' &&
                  styles.filterTextActive,
              ]}
            >
              All Items
            </Text>

            <View
              style={[
                styles.filterCount,

                statusFilter === 'all' &&
                  styles.filterCountActive,
              ]}
            >

              <Text
                style={[
                  styles.filterCountText,

                  statusFilter === 'all' &&
                    styles.filterCountTextActive,
                ]}
              >
                {baseItems.length}
              </Text>

            </View>

          </Pressable>


          {/* LOW */}

          <Pressable
            onPress={() =>
              setStatusFilter('low')
            }
            style={[
              styles.filterButton,

              statusFilter === 'low' &&
                styles.lowFilterActive,

              statusFilter !== 'low' &&
                styles.lowFilter,
            ]}
          >

            <AlertTriangle
              size={13}
              color={
                statusFilter === 'low'
                  ? '#ffffff'
                  : '#b45309'
              }
            />

            <Text
              style={[
                styles.filterText,

                statusFilter === 'low' &&
                  styles.filterTextActive,

                statusFilter !== 'low' &&
                  styles.lowFilterText,
              ]}
            >
              Low Stock
            </Text>

            <View
              style={[
                styles.filterCount,

                styles.lowCountBackground,
              ]}
            >

              <Text
                style={[
                  styles.filterCountText,
                  styles.lowCountText,
                ]}
              >
                {lowCount}
              </Text>

            </View>

          </Pressable>


          {/* HEALTHY */}

          <Pressable
            onPress={() =>
              setStatusFilter('healthy')
            }
            style={[
              styles.filterButton,

              statusFilter === 'healthy' &&
                styles.healthyFilterActive,

              statusFilter !== 'healthy' &&
                styles.healthyFilter,
            ]}
          >

            <CheckCircle2
              size={13}
              color={
                statusFilter === 'healthy'
                  ? '#ffffff'
                  : '#166534'
              }
            />

            <Text
              style={[
                styles.filterText,

                statusFilter === 'healthy' &&
                  styles.filterTextActive,

                statusFilter !== 'healthy' &&
                  styles.healthyFilterText,
              ]}
            >
              Healthy
            </Text>

            <View
              style={[
                styles.filterCount,
                styles.healthyCountBackground,
              ]}
            >

              <Text
                style={[
                  styles.filterCountText,
                  styles.healthyCountText,
                ]}
              >
                {healthyCount}
              </Text>

            </View>

          </Pressable>

        </ScrollView>


        {/* =================================================
            STOCK LIST
            ================================================= */}

        <View style={styles.stockList}>

          {filteredStock.length === 0 ? (

            <View style={styles.emptyCard}>

              <View style={styles.emptyIcon}>

                <Layers
                  size={25}
                  color="#b45309"
                />

              </View>

              <Text style={styles.emptyTitle}>
                No inventory items found
              </Text>

              <Text style={styles.emptyText}>
                Try adjusting your search query
                or filter selection.
              </Text>

            </View>

          ) : (

            filteredStock.map(stock => (

              <StockCard
                key={stock.id}
                stock={stock}
                showBranch={
                  viewMode ===
                  'consolidated'
                }
                onAdjust={() =>
                  setSelectedStock(stock)
                }
              />

            ))

          )}

        </View>


        <View style={{ height: 30 }} />

      </ScrollView>


      {/* =================================================
          ADJUST MODAL
          ================================================= */}

      {selectedStock && (

        <StockAdjustModal
          stock={selectedStock}
          onClose={() =>
            setSelectedStock(null)
          }
        />

      )}

    </View>
  );
}


/* =====================================================
   STOCK CARD
   ===================================================== */

interface StockCardProps {
  stock: StockItem;
  showBranch: boolean;
  onAdjust: () => void;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  showBranch,
  onAdjust,
}) => {

  const isLow =
    stock.quantityOnHand <=
    stock.lowStockThreshold;


  const percentage = Math.min(
    100,
    Math.round(
      (stock.quantityOnHand /
        (stock.lowStockThreshold * 2.5)) *
        100
    )
  );


  return (

    <View style={styles.stockCard}>

      {/* TOP */}

      <View style={styles.stockTop}>

        <View style={styles.stockIcon}>

          <Layers
            size={19}
            color="#650700"
          />

        </View>


        <View style={styles.stockInfo}>

          <Text
            style={styles.stockName}
            numberOfLines={1}
          >
            {stock.menuItemName}
          </Text>

          <Text style={styles.stockCategory}>
            {stock.category}
          </Text>

          {showBranch && (

            <View style={styles.branchTag}>

              <Building2
                size={9}
                color="#78716c"
              />

              <Text style={styles.branchTagText}>
                {stock.branch}
              </Text>

            </View>

          )}

        </View>


        {/* QUANTITY */}

        <View style={styles.quantityBox}>

          <Text
            style={[
              styles.quantity,

              isLow &&
                styles.quantityLow,
            ]}
          >
            {stock.quantityOnHand}
          </Text>

          <Text style={styles.unit}>
            {stock.unit}
          </Text>

        </View>

      </View>


      {/* PROGRESS */}

      <View style={styles.progressSection}>

        <View style={styles.progressLabels}>

          <Text style={styles.thresholdText}>
            Stock level
          </Text>

          <Text
            style={[
              styles.thresholdValue,

              isLow &&
                styles.thresholdLow,
            ]}
          >
            Threshold: {stock.lowStockThreshold}
          </Text>

        </View>


        <View style={styles.progressBackground}>

          <View
            style={[
              styles.progressFill,

              {
                width: `${percentage}%`,
              },

              isLow
                ? styles.progressLow
                : styles.progressHealthy,
            ]}
          />

        </View>

      </View>


      {/* FOOTER */}

      <View style={styles.stockFooter}>

        <View
          style={[
            styles.statusBadge,

            isLow
              ? styles.statusLow
              : styles.statusHealthy,
          ]}
        >

          {isLow ? (

            <TrendingDown
              size={12}
              color="#b91c1c"
            />

          ) : (

            <CheckCircle2
              size={12}
              color="#166534"
            />

          )}

          <Text
            style={[
              styles.statusText,

              isLow
                ? styles.statusTextLow
                : styles.statusTextHealthy,
            ]}
          >
            {isLow
              ? 'Restock Required'
              : 'Healthy Level'}
          </Text>

        </View>


        <Pressable
          onPress={onAdjust}
          style={({ pressed }) => [
            styles.adjustButton,
            pressed && styles.pressed,
          ]}
        >

          <Text style={styles.adjustText}>
            Adjust Stock
          </Text>

        </Pressable>

      </View>

    </View>
  );
};


/* =====================================================
   ADJUST MODAL
   ===================================================== */

interface StockAdjustModalProps {
  stock: StockItem;
  onClose: () => void;
}

const StockAdjustModal: React.FC<
  StockAdjustModalProps
> = ({
  stock,
  onClose,
}) => {

  const [quantity, setQuantity] =
    useState(stock.quantityOnHand);


  return (

    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >

      <View style={styles.modalOverlay}>

        <View style={styles.modalCard}>

          {/* HEADER */}

          <View style={styles.modalHeader}>

            <View>

              <Text style={styles.modalTitle}>
                Adjust Stock
              </Text>

              <Text style={styles.modalSubtitle}>
                {stock.menuItemName}
              </Text>

            </View>


            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >

              <X
                size={19}
                color="#57534e"
              />

            </Pressable>

          </View>


          {/* CURRENT STOCK */}

          <View style={styles.currentStockBox}>

            <Text style={styles.currentLabel}>
              Current Quantity
            </Text>

            <Text style={styles.currentQuantity}>
              {quantity}
            </Text>

            <Text style={styles.currentUnit}>
              {stock.unit}
            </Text>

          </View>


          {/* CONTROLS */}

          <View style={styles.quantityControls}>

            <Pressable
              onPress={() =>
                setQuantity(
                  Math.max(
                    0,
                    quantity - 1
                  )
                )
              }
              style={styles.quantityButton}
            >

              <Minus
                size={20}
                color="#650700"
              />

            </Pressable>


            <Text style={styles.quantityValue}>
              {quantity}
            </Text>


            <Pressable
              onPress={() =>
                setQuantity(
                  quantity + 1
                )
              }
              style={styles.quantityButton}
            >

              <Plus
                size={20}
                color="#650700"
              />

            </Pressable>

          </View>


          {/* ACTIONS */}

          <View style={styles.modalActions}>

            <Pressable
              onPress={onClose}
              style={styles.cancelButton}
            >

              <Text style={styles.cancelText}>
                Cancel
              </Text>

            </Pressable>


            <Pressable
              onPress={onClose}
              style={styles.saveButton}
            >

              <CheckCircle2
                size={15}
                color="#ffffff"
              />

              <Text style={styles.saveText}>
                Save Adjustment
              </Text>

            </Pressable>

          </View>

        </View>

      </View>

    </Modal>
  );
};


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  content: {
    padding: 12,
    paddingBottom: 30,
  },


  /* HEADER */

  headerCard: {
    backgroundColor: '#ffffff',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#e7e5e4',

    padding: 14,

    elevation: 1,

    marginBottom: 9,
  },

  headerTop: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

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

    marginTop: 4,

    lineHeight: 15,
  },


  /* VIEW TOGGLE */

  viewToggle: {
    flexDirection: 'row',

    backgroundColor: '#f5f5f4',

    borderRadius: 12,

    padding: 3,
  },

  toggleButton: {
    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 9,
  },

  toggleActive: {
    backgroundColor: '#ffffff',

    elevation: 1,
  },

  toggleText: {
    color: '#78716c',

    fontSize: 8,

    fontWeight: '800',
  },

  toggleTextActive: {
    color: '#650700',
  },


  /* BRANCH */

  branchSelector: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 13,

    gap: 7,
  },

  branchList: {
    gap: 6,
  },

  branchButton: {
    backgroundColor: '#f5f5f4',

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 9,
  },

  branchButtonActive: {
    backgroundColor: '#650700',
  },

  branchText: {
    color: '#57534e',

    fontSize: 8,

    fontWeight: '700',
  },

  branchTextActive: {
    color: '#ffffff',
  },


  /* SEARCH */

  searchBox: {
    flexDirection: 'row',

    alignItems: 'center',

    minHeight: 43,

    backgroundColor: '#fafaf9',

    borderWidth: 1,

    borderColor: '#e7e5e4',

    borderRadius: 14,

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


  /* FILTER */

  filterContainer: {
    gap: 7,

    paddingBottom: 10,
  },

  filterButton: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    paddingHorizontal: 11,

    paddingVertical: 8,

    borderRadius: 15,

    borderWidth: 1,
  },

  filterActive: {
    backgroundColor: '#650700',

    borderColor: '#650700',
  },

  lowFilter: {
    backgroundColor: '#ffffff',

    borderColor: '#fed7aa',
  },

  lowFilterActive: {
    backgroundColor: '#b45309',

    borderColor: '#b45309',
  },

  healthyFilter: {
    backgroundColor: '#ffffff',

    borderColor: '#bbf7d0',
  },

  healthyFilterActive: {
    backgroundColor: '#15803d',

    borderColor: '#15803d',
  },

  filterText: {
    color: '#57534e',

    fontSize: 9,

    fontWeight: '800',
  },

  filterTextActive: {
    color: '#ffffff',
  },

  lowFilterText: {
    color: '#92400e',
  },

  healthyFilterText: {
    color: '#166534',
  },

  filterCount: {
    minWidth: 18,

    height: 18,

    borderRadius: 9,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 4,
  },

  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  lowCountBackground: {
    backgroundColor: '#ffedd5',
  },

  healthyCountBackground: {
    backgroundColor: '#dcfce7',
  },

  filterCountText: {
    color: '#57534e',

    fontSize: 8,

    fontWeight: '800',
  },

  filterCountTextActive: {
    color: '#ffffff',
  },

  lowCountText: {
    color: '#92400e',
  },

  healthyCountText: {
    color: '#166534',
  },


  /* STOCK */

  stockList: {
    gap: 9,
  },

  stockCard: {
    backgroundColor: '#ffffff',

    borderRadius: 19,

    borderWidth: 1,

    borderColor: '#e7e5e4',

    padding: 13,

    elevation: 1,
  },

  stockTop: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,
  },

  stockIcon: {
    width: 39,

    height: 39,

    borderRadius: 12,

    backgroundColor: '#fdf4ef',

    alignItems: 'center',

    justifyContent: 'center',
  },

  stockInfo: {
    flex: 1,

    minWidth: 0,
  },

  stockName: {
    color: '#1c1917',

    fontSize: 12,

    fontWeight: '800',
  },

  stockCategory: {
    color: '#a8a29e',

    fontSize: 8,

    marginTop: 2,

    fontWeight: '600',
  },

  branchTag: {
    flexDirection: 'row',

    alignItems: 'center',

    alignSelf: 'flex-start',

    gap: 3,

    backgroundColor: '#f5f5f4',

    borderRadius: 6,

    paddingHorizontal: 5,

    paddingVertical: 3,

    marginTop: 4,
  },

  branchTagText: {
    color: '#78716c',

    fontSize: 7,

    fontWeight: '700',
  },


  /* QUANTITY */

  quantityBox: {
    alignItems: 'flex-end',
  },

  quantity: {
    color: '#166534',

    fontSize: 18,

    fontWeight: '900',
  },

  quantityLow: {
    color: '#dc2626',
  },

  unit: {
    color: '#a8a29e',

    fontSize: 7,

    fontWeight: '600',
  },


  /* PROGRESS */

  progressSection: {
    marginTop: 12,
  },

  progressLabels: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 5,
  },

  thresholdText: {
    color: '#78716c',

    fontSize: 8,

    fontWeight: '600',
  },

  thresholdValue: {
    color: '#78716c',

    fontSize: 8,

    fontWeight: '700',
  },

  thresholdLow: {
    color: '#dc2626',
  },

  progressBackground: {
    height: 7,

    backgroundColor: '#f5f5f4',

    borderRadius: 8,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 8,
  },

  progressHealthy: {
    backgroundColor: '#16a34a',
  },

  progressLow: {
    backgroundColor: '#ef4444',
  },


  /* FOOTER */

  stockFooter: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderTopWidth: 1,

    borderTopColor: '#f0eeec',

    marginTop: 11,

    paddingTop: 10,
  },

  statusBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    paddingHorizontal: 7,

    paddingVertical: 5,

    borderRadius: 8,
  },

  statusLow: {
    backgroundColor: '#fef2f2',
  },

  statusHealthy: {
    backgroundColor: '#f0fdf4',
  },

  statusText: {
    fontSize: 8,

    fontWeight: '800',
  },

  statusTextLow: {
    color: '#b91c1c',
  },

  statusTextHealthy: {
    color: '#166534',
  },

  adjustButton: {
    backgroundColor: '#650700',

    paddingHorizontal: 10,

    paddingVertical: 7,

    borderRadius: 9,
  },

  adjustText: {
    color: '#ffffff',

    fontSize: 8,

    fontWeight: '800',
  },


  /* EMPTY */

  emptyCard: {
    backgroundColor: '#ffffff',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#e7e5e4',

    padding: 40,

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
  },

  emptyText: {
    color: '#78716c',

    fontSize: 10,

    textAlign: 'center',

    lineHeight: 16,

    marginTop: 5,
  },


  /* MODAL */

  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: '#ffffff',

    borderTopLeftRadius: 25,

    borderTopRightRadius: 25,

    padding: 20,

    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 18,
  },

  modalTitle: {
    color: '#1c1917',

    fontSize: 18,

    fontWeight: '800',
  },

  modalSubtitle: {
    color: '#78716c',

    fontSize: 10,

    marginTop: 3,
  },

  closeButton: {
    width: 35,

    height: 35,

    borderRadius: 11,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',
  },


  /* CURRENT */

  currentStockBox: {
    backgroundColor: '#fdf4ef',

    borderRadius: 16,

    padding: 16,

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#ead8d3',
  },

  currentLabel: {
    color: '#78716c',

    fontSize: 9,

    fontWeight: '700',
  },

  currentQuantity: {
    color: '#650700',

    fontSize: 36,

    fontWeight: '900',

    marginTop: 3,
  },

  currentUnit: {
    color: '#78716c',

    fontSize: 9,

    fontWeight: '600',
  },


  /* CONTROLS */

  quantityControls: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 25,

    marginVertical: 22,
  },

  quantityButton: {
    width: 45,

    height: 45,

    borderRadius: 14,

    backgroundColor: '#fdf4ef',

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: '#ead8d3',
  },

  quantityValue: {
    color: '#1c1917',

    fontSize: 28,

    fontWeight: '900',

    minWidth: 55,

    textAlign: 'center',
  },


  /* MODAL ACTIONS */

  modalActions: {
    flexDirection: 'row',

    gap: 10,
  },

  cancelButton: {
    flex: 1,

    height: 46,

    borderRadius: 13,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',
  },

  cancelText: {
    color: '#57534e',

    fontSize: 10,

    fontWeight: '800',
  },

  saveButton: {
    flex: 1,

    height: 46,

    borderRadius: 13,

    backgroundColor: '#650700',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 6,
  },

  saveText: {
    color: '#ffffff',

    fontSize: 10,

    fontWeight: '800',
  },


  /* PRESS */

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

});