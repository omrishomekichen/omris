import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  Image,
} from 'react-native';

import {
  Plus,
  Search,
  X,
  Tag,
  Clock,
  Layers,
  Edit3,
  Trash2,
  CheckCircle2,
  EyeOff,
} from 'lucide-react-native';


/* =====================================================
   TYPES
   ===================================================== */

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  weight: string;
  tags: string[];
  available: boolean;
  prepTime: string;
  stock: number;
  image?: string;
}


/* =====================================================
   STATIC PRODUCTS
   ===================================================== */

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Mango Pickle',
    category: 'Pickles',
    description:
      'Traditional Andhra-style mango pickle with authentic spices.',
    price: 320,
    weight: '500g',
    tags: ['Spicy', 'Traditional'],
    available: true,
    prepTime: '2 Days',
    stock: 24,
  },

  {
    id: '2',
    name: 'Avakaya Pickle',
    category: 'Pickles',
    description:
      'Classic raw mango avakaya made with mustard and red chilli.',
    price: 380,
    weight: '500g',
    tags: ['Hot', 'Andhra'],
    available: true,
    prepTime: '3 Days',
    stock: 18,
  },

  {
    id: '3',
    name: 'Gongura Pickle',
    category: 'Pickles',
    description:
      'Tangy gongura leaves blended with traditional spices.',
    price: 290,
    weight: '500g',
    tags: ['Tangy', 'Traditional'],
    available: true,
    prepTime: '1 Day',
    stock: 31,
  },

  {
    id: '4',
    name: 'Garlic Pickle',
    category: 'Pickles',
    description:
      'Bold garlic pickle with a rich spicy and tangy flavour.',
    price: 340,
    weight: '500g',
    tags: ['Spicy', 'Garlic'],
    available: false,
    prepTime: '2 Days',
    stock: 5,
  },

  {
    id: '5',
    name: 'Peanut Chutney',
    category: 'Chutneys',
    description:
      'Roasted peanut chutney powder with mild South Indian spices.',
    price: 220,
    weight: '250g',
    tags: ['Mild', 'Nutty'],
    available: true,
    prepTime: '1 Day',
    stock: 42,
  },

  {
    id: '6',
    name: 'Curry Leaf Podi',
    category: 'Podis',
    description:
      'Fresh curry leaves roasted and ground with lentils and spices.',
    price: 210,
    weight: '250g',
    tags: ['Healthy', 'Aromatic'],
    available: true,
    prepTime: '1 Day',
    stock: 35,
  },

  {
    id: '7',
    name: 'Idli Podi',
    category: 'Podis',
    description:
      'Classic spicy podi perfect with idli, dosa and rice.',
    price: 180,
    weight: '250g',
    tags: ['Spicy', 'Classic'],
    available: true,
    prepTime: '1 Day',
    stock: 50,
  },

  {
    id: '8',
    name: 'South Indian Combo',
    category: 'Combos',
    description:
      'A curated selection of pickles and podis for everyday meals.',
    price: 850,
    weight: '1.5kg',
    tags: ['Combo', 'Best Seller'],
    available: true,
    prepTime: '2 Days',
    stock: 12,
  },

  {
    id: '9',
    name: 'Lemon Pickle',
    category: 'Seasonal',
    description:
      'Fresh lemon pickle with traditional spices and natural oils.',
    price: 280,
    weight: '500g',
    tags: ['Tangy', 'Seasonal'],
    available: true,
    prepTime: '2 Days',
    stock: 20,
  },
];


/* =====================================================
   CATEGORIES
   ===================================================== */

const CATEGORIES = [
  'All',
  'Pickles',
  'Chutneys',
  'Podis',
  'Combos',
  'Seasonal',
];


/* =====================================================
   MENU SCREEN
   ===================================================== */

export default function MenuScreen() {

  const [activeCategory, setActiveCategory] =
    useState('All');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);


  /* ===================================================
     FILTER
     =================================================== */

  const filteredItems = useMemo(() => {

    return MENU_ITEMS.filter((item) => {

      if (
        activeCategory !== 'All' &&
        item.category !== activeCategory
      ) {
        return false;
      }


      if (searchQuery.trim()) {

        const query =
          searchQuery.toLowerCase().trim();

        const matchName =
          item.name
            .toLowerCase()
            .includes(query);

        const matchDescription =
          item.description
            .toLowerCase()
            .includes(query);

        const matchTags =
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          );

        if (
          !matchName &&
          !matchDescription &&
          !matchTags
        ) {
          return false;
        }
      }

      return true;
    });

  }, [
    activeCategory,
    searchQuery,
  ]);


  /* ===================================================
     OPEN CREATE
     =================================================== */

  const handleCreate = () => {

    setEditingItem(null);

    setFormOpen(true);

  };


  /* ===================================================
     OPEN EDIT
     =================================================== */

  const handleEdit = (
    item: MenuItem
  ) => {

    setEditingItem(item);

    setFormOpen(true);

  };


  /* ===================================================
     RENDER
     =================================================== */

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

          <View style={styles.headerRow}>

            <View style={styles.headerText}>

              <Text style={styles.title}>
                Product Catalog & Menu
              </Text>

              <Text style={styles.subtitle}>
                {MENU_ITEMS.length} products • Manage
                recipes, weight tiers & availability
              </Text>

            </View>


            <Pressable
              onPress={handleCreate}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressed,
              ]}
            >

              <Plus
                size={16}
                color="#ffffff"
              />

              <Text style={styles.addText}>
                Add
              </Text>

            </Pressable>

          </View>


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
              placeholder="Search recipes, ingredients, spicy levels..."
              placeholderTextColor="#a8a29e"
              style={styles.searchInput}
              autoCorrect={false}
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
            CATEGORY TABS
            ================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >

          {CATEGORIES.map((category) => {

            const active =
              activeCategory === category;

            const count =
              category === 'All'
                ? MENU_ITEMS.length
                : MENU_ITEMS.filter(
                    (item) =>
                      item.category === category
                  ).length;

            return (

              <Pressable
                key={category}
                onPress={() =>
                  setActiveCategory(category)
                }
                style={({ pressed }) => [
                  styles.categoryButton,

                  active &&
                    styles.categoryButtonActive,

                  pressed &&
                    styles.pressed,
                ]}
              >

                <Text
                  style={[
                    styles.categoryText,

                    active &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>

                <View
                  style={[
                    styles.categoryCount,

                    active &&
                      styles.categoryCountActive,
                  ]}
                >

                  <Text
                    style={[
                      styles.categoryCountText,

                      active &&
                        styles.categoryCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>

                </View>

              </Pressable>

            );

          })}

        </ScrollView>


        {/* =================================================
            PRODUCT GRID
            ================================================= */}

        <View style={styles.productGrid}>

          {filteredItems.length === 0 ? (

            <View style={styles.emptyCard}>

              <View style={styles.emptyIcon}>

                <Layers
                  size={24}
                  color="#b45309"
                />

              </View>

              <Text style={styles.emptyTitle}>
                No products found
              </Text>

              <Text style={styles.emptyDescription}>
                Try searching for a different term
                or clear your category filter.
              </Text>

              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                style={styles.clearButton}
              >

                <Text style={styles.clearButtonText}>
                  Clear filters
                </Text>

              </Pressable>

            </View>

          ) : (

            filteredItems.map((item) => (

              <ProductCard
                key={item.id}
                item={item}
                onEdit={() =>
                  handleEdit(item)
                }
              />

            ))

          )}

        </View>


        <View style={{ height: 30 }} />

      </ScrollView>


      {/* =================================================
          FORM MODAL
          ================================================= */}

      <ProductFormModal
        visible={formOpen}
        item={editingItem}
        onClose={() =>
          setFormOpen(false)
        }
      />

    </View>
  );
}


/* =====================================================
   PRODUCT CARD
   ===================================================== */

interface ProductCardProps {
  item: MenuItem;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onEdit,
}) => {

  return (

    <View style={styles.productCard}>

      {/* PRODUCT IMAGE */}

      <View style={styles.productImage}>

        <Text style={styles.productEmoji}>
          {getProductEmoji(item.category)}
        </Text>

        {!item.available && (

          <View style={styles.unavailableOverlay}>

            <Text style={styles.unavailableText}>
              UNAVAILABLE
            </Text>

          </View>

        )}

      </View>


      {/* PRODUCT CONTENT */}

      <View style={styles.productContent}>

        <View style={styles.productHeader}>

          <View style={styles.productTitleArea}>

            <Text
              style={styles.productName}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text style={styles.productCategory}>
              {item.category}
            </Text>

          </View>

          <Text style={styles.productPrice}>
            ₹{item.price}
          </Text>

        </View>


        <Text
          style={styles.productDescription}
          numberOfLines={2}
        >
          {item.description}
        </Text>


        {/* TAGS */}

        <View style={styles.tagsRow}>

          {item.tags.map((tag) => (

            <View
              key={tag}
              style={styles.tag}
            >

              <Tag
                size={9}
                color="#92400e"
              />

              <Text style={styles.tagText}>
                {tag}
              </Text>

            </View>

          ))}

        </View>


        {/* DETAILS */}

        <View style={styles.detailsRow}>

          <View style={styles.detailItem}>

            <Clock
              size={12}
              color="#a8a29e"
            />

            <Text style={styles.detailText}>
              {item.prepTime}
            </Text>

          </View>


          <View style={styles.detailItem}>

            <Layers
              size={12}
              color="#a8a29e"
            />

            <Text style={styles.detailText}>
              {item.weight}
            </Text>

          </View>


          <View style={styles.detailItem}>

            <Text style={styles.stockText}>
              {item.stock} in stock
            </Text>

          </View>

        </View>


        {/* BOTTOM */}

        <View style={styles.cardFooter}>

          <View
            style={[
              styles.availability,
              item.available
                ? styles.available
                : styles.unavailable,
            ]}
          >

            {item.available ? (

              <CheckCircle2
                size={12}
                color="#166534"
              />

            ) : (

              <EyeOff
                size={12}
                color="#b91c1c"
              />

            )}

            <Text
              style={[
                styles.availabilityText,
                item.available
                  ? styles.availableText
                  : styles.unavailableText2,
              ]}
            >
              {item.available
                ? 'Available'
                : 'Unavailable'}
            </Text>

          </View>


          <View style={styles.actions}>

            <Pressable
              onPress={onEdit}
              style={styles.editButton}
            >

              <Edit3
                size={13}
                color="#650700"
              />

              <Text style={styles.editText}>
                Edit
              </Text>

            </Pressable>

            <Pressable
              style={styles.deleteButton}
            >

              <Trash2
                size={13}
                color="#b91c1c"
              />

            </Pressable>

          </View>

        </View>

      </View>

    </View>
  );
};


/* =====================================================
   PRODUCT FORM MODAL
   ===================================================== */

interface ProductFormModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
}

const ProductFormModal: React.FC<
  ProductFormModalProps
> = ({
  visible,
  item,
  onClose,
}) => {

  const [name, setName] =
    useState(item?.name || '');

  const [price, setPrice] =
    useState(
      item?.price?.toString() || ''
    );

  const [description, setDescription] =
    useState(item?.description || '');

  return (

    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >

      <View style={styles.modalBackground}>

        <View style={styles.modalCard}>

          {/* MODAL HEADER */}

          <View style={styles.modalHeader}>

            <View>

              <Text style={styles.modalTitle}>
                {item
                  ? 'Edit Product'
                  : 'Add Product'}
              </Text>

              <Text style={styles.modalSubtitle}>
                Product information
              </Text>

            </View>

            <Pressable
              onPress={onClose}
              style={styles.modalClose}
            >

              <X
                size={20}
                color="#57534e"
              />

            </Pressable>

          </View>


          {/* FORM */}

          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            <Text style={styles.inputLabel}>
              Product Name
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter product name"
              placeholderTextColor="#a8a29e"
              style={styles.input}
            />


            <Text style={styles.inputLabel}>
              Price
            </Text>

            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="₹0"
              placeholderTextColor="#a8a29e"
              keyboardType="numeric"
              style={styles.input}
            />


            <Text style={styles.inputLabel}>
              Description
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#a8a29e"
              multiline
              numberOfLines={4}
              style={[
                styles.input,
                styles.textArea,
              ]}
            />


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

                <Text style={styles.saveText}>
                  {item
                    ? 'Save Changes'
                    : 'Add Product'}
                </Text>

              </Pressable>

            </View>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
};


/* =====================================================
   EMOJI
   ===================================================== */

const getProductEmoji = (
  category: string
) => {

  switch (category) {

    case 'Pickles':
      return '🥭';

    case 'Chutneys':
      return '🥜';

    case 'Podis':
      return '🌶️';

    case 'Combos':
      return '🎁';

    case 'Seasonal':
      return '🍋';

    default:
      return '🍲';
  }
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
    paddingBottom: 35,
  },


  /* HEADER */

  headerCard: {
    backgroundColor: '#ffffff',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#e7e5e4',

    padding: 14,

    marginBottom: 9,

    elevation: 1,
  },

  headerRow: {
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


  /* ADD */

  addButton: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    backgroundColor: '#650700',

    paddingHorizontal: 13,

    paddingVertical: 9,

    borderRadius: 14,

    elevation: 2,
  },

  addText: {
    color: '#ffffff',

    fontSize: 10,

    fontWeight: '800',
  },


  /* SEARCH */

  searchBox: {
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


  /* CATEGORY */

  categoryContainer: {
    gap: 7,

    paddingBottom: 10,

    paddingRight: 10,
  },

  categoryButton: {
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

  categoryButtonActive: {
    backgroundColor: '#650700',

    borderColor: '#650700',
  },

  categoryText: {
    color: '#57534e',

    fontSize: 10,

    fontWeight: '800',
  },

  categoryTextActive: {
    color: '#ffffff',
  },

  categoryCount: {
    minWidth: 18,

    height: 18,

    borderRadius: 9,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 4,
  },

  categoryCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  categoryCountText: {
    color: '#57534e',

    fontSize: 8,

    fontWeight: '800',
  },

  categoryCountTextActive: {
    color: '#ffffff',
  },


  /* PRODUCT GRID */

  productGrid: {
    gap: 10,
  },


  /* PRODUCT CARD */

  productCard: {
    backgroundColor: '#ffffff',

    borderRadius: 19,

    borderWidth: 1,

    borderColor: '#e7e5e4',

    overflow: 'hidden',

    elevation: 1,
  },

  productImage: {
    height: 125,

    backgroundColor: '#fff7ed',

    alignItems: 'center',

    justifyContent: 'center',

    position: 'relative',
  },

  productEmoji: {
    fontSize: 55,
  },

  unavailableOverlay: {
    position: 'absolute',

    left: 10,

    top: 10,

    backgroundColor: '#fee2e2',

    paddingHorizontal: 7,

    paddingVertical: 4,

    borderRadius: 7,
  },

  unavailableText: {
    color: '#b91c1c',

    fontSize: 7,

    fontWeight: '900',
  },

  productContent: {
    padding: 12,
  },

  productHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    gap: 8,
  },

  productTitleArea: {
    flex: 1,
  },

  productName: {
    color: '#1c1917',

    fontSize: 14,

    fontWeight: '800',
  },

  productCategory: {
    color: '#a8a29e',

    fontSize: 9,

    marginTop: 3,

    fontWeight: '600',
  },

  productPrice: {
    color: '#650700',

    fontSize: 14,

    fontWeight: '900',
  },

  productDescription: {
    color: '#78716c',

    fontSize: 10,

    lineHeight: 15,

    marginTop: 7,
  },


  /* TAGS */

  tagsRow: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 5,

    marginTop: 9,
  },

  tag: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 3,

    backgroundColor: '#fffbeb',

    borderWidth: 1,

    borderColor: '#fde68a',

    borderRadius: 7,

    paddingHorizontal: 6,

    paddingVertical: 4,
  },

  tagText: {
    color: '#92400e',

    fontSize: 7,

    fontWeight: '700',
  },


  /* DETAILS */

  detailsRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 13,

    marginTop: 11,
  },

  detailItem: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,
  },

  detailText: {
    color: '#78716c',

    fontSize: 8,

    fontWeight: '600',
  },

  stockText: {
    color: '#57534e',

    fontSize: 8,

    fontWeight: '700',
  },


  /* FOOTER */

  cardFooter: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderTopWidth: 1,

    borderTopColor: '#f0eeec',

    marginTop: 11,

    paddingTop: 10,
  },

  availability: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    paddingHorizontal: 7,

    paddingVertical: 5,

    borderRadius: 8,
  },

  available: {
    backgroundColor: '#f0fdf4',
  },

  unavailable: {
    backgroundColor: '#fef2f2',
  },

  availabilityText: {
    fontSize: 8,

    fontWeight: '800',
  },

  availableText: {
    color: '#166534',
  },

  unavailableText2: {
    color: '#b91c1c',
  },

  actions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,
  },

  editButton: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    borderWidth: 1,

    borderColor: '#ead8d3',

    paddingHorizontal: 8,

    paddingVertical: 6,

    borderRadius: 8,
  },

  editText: {
    color: '#650700',

    fontSize: 8,

    fontWeight: '800',
  },

  deleteButton: {
    width: 28,

    height: 28,

    borderRadius: 8,

    backgroundColor: '#fef2f2',

    alignItems: 'center',

    justifyContent: 'center',
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

  emptyDescription: {
    color: '#78716c',

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 5,
  },

  clearButton: {
    marginTop: 12,

    padding: 8,
  },

  clearButtonText: {
    color: '#650700',

    fontSize: 10,

    fontWeight: '800',
  },


  /* MODAL */

  modalBackground: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: '#ffffff',

    borderTopLeftRadius: 25,

    borderTopRightRadius: 25,

    padding: 18,

    maxHeight: '85%',
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

  modalClose: {
    width: 35,

    height: 35,

    borderRadius: 12,

    backgroundColor: '#f5f5f4',

    alignItems: 'center',

    justifyContent: 'center',
  },

  inputLabel: {
    color: '#44403c',

    fontSize: 10,

    fontWeight: '800',

    marginBottom: 6,

    marginTop: 8,
  },

  input: {
    borderWidth: 1,

    borderColor: '#e7e5e4',

    backgroundColor: '#fafaf9',

    borderRadius: 13,

    minHeight: 42,

    paddingHorizontal: 12,

    color: '#1c1917',

    fontSize: 11,
  },

  textArea: {
    height: 100,

    paddingTop: 11,

    textAlignVertical: 'top',
  },

  modalActions: {
    flexDirection: 'row',

    gap: 10,

    marginTop: 20,

    marginBottom: 15,
  },

  cancelButton: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    minHeight: 44,

    borderRadius: 13,

    backgroundColor: '#f5f5f4',
  },

  cancelText: {
    color: '#57534e',

    fontSize: 11,

    fontWeight: '800',
  },

  saveButton: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    minHeight: 44,

    borderRadius: 13,

    backgroundColor: '#650700',
  },

  saveText: {
    color: '#ffffff',

    fontSize: 11,

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