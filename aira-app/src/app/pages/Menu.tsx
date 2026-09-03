import React, { useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  Image,
  Alert,
  Switch,
} from "react-native";

import {
  Plus,
  Search,
  X,
  Tag,
  Layers,
  Edit3,
  Trash2,
  CheckCircle2,
  EyeOff,
  Star,
  Package,
  Clock,
  ChevronDown,
} from "lucide-react-native";
import type {
  Category,
  MenuItem,
  ComboItem,
  Offer,
  PriceOption,
  PriceUnit,
  ShelfLifeUnit,
  ProductCardProps,
  ProductFormModalProps,
  InputLabelProps,
  FormSectionTitleProps,
  UnitSelectorProps,
} from "../types";
import { apiGetMenuItems } from "../../lib/api";
import { useAuth } from "../../Context/AuthContext";

/* =========================================================
   CONSTANTS
   ========================================================= */

const CATEGORIES: {
  value: Category;
  label: string;
}[] = [
  {
    value: "veg",
    label: "Veg",
  },
  {
    value: "nonVeg",
    label: "Non-Veg",
  },
  {
    value: "spicedPowder",
    label: "Spiced Powder",
  },
  {
    value: "combo",
    label: "Combo",
  },
  {
    value: "offer",
    label: "Offer",
  },
];

const PRICE_UNITS: PriceUnit[] = [
  "g",
  "kg",
  "ml",
  "l",
  "piece",
];

const SHELF_UNITS: ShelfLifeUnit[] = [
  "days",
  "weeks",
  "months",
  "years",
];

/* =========================================================
   SAMPLE DATA
   ========================================================= */


/* =========================================================
   HELPERS
   ========================================================= */

const getCategoryLabel = (
  category: Category
): string => {
  return (
    CATEGORIES.find(
      (item) => item.value === category
    )?.label || category
  );
};

const getCategoryEmoji = (
  category: Category
): string => {
  switch (category) {
    case "veg":
      return "🥭";

    case "nonVeg":
      return "🍗";

    case "spicedPowder":
      return "🌶️";

    case "combo":
      return "🎁";

    case "offer":
      return "🏷️";

    default:
      return "🍲";
  }
};

const createEmptyItem = (): MenuItem => ({
  menuId: "",
  name: "",
  category: "veg",
  description: "",
  ingredients: [],
  storage: {
    instructions: "",
    shelfLife: {
      value: undefined,
      unit: "months",
    },
  },
  image: null,
  priceOptions: [
    {
      quantity: 500,
      unit: "g",
      price: 0,
    },
  ],
  comboItems: [],
  offer: {
    enabled: false,
    title: "",
    description: "",
    price: undefined,
  },
  isAvailable: true,
  isFeatured: false,
  sortOrder: 0,
});

/* =========================================================
   MAIN SCREEN
   ========================================================= */

export default function MenuScreen() {
  const { session } = useAuth();
  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [activeCategory, setActiveCategory] =
    useState<Category | "All">("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMenuItems = async () => {
      const response = await apiGetMenuItems(session?.token);
      const items = response?.menuItems;

      if (isMounted && response?.success && Array.isArray(items)) {
        setMenuItems(
          items.map((item: MenuItem & { _id?: unknown }) => ({
            ...item,
            _id: item._id ? String(item._id) : undefined,
            image: item.image ?? null,
            ingredients: item.ingredients ?? [],
            priceOptions: item.priceOptions ?? [],
            comboItems: item.comboItems ?? [],
            offer: item.offer ?? { enabled: false },
            storage: item.storage ?? {},
            isAvailable: item.isAvailable ?? true,
            isFeatured: item.isFeatured ?? false,
            sortOrder: item.sortOrder ?? 0,
          })),
        );
      }
    };

    loadMenuItems().catch(() => {
      // Keep the local sample menu visible when the API is unavailable.
    });

    return () => {
      isMounted = false;
    };
  }, [session?.token]);

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredItems = useMemo(() => {
    const query =
      searchQuery.toLowerCase().trim();

    return menuItems
      .filter((item) => {
        if (
          activeCategory !== "All" &&
          item.category !== activeCategory
        ) {
          return false;
        }

        if (!query) {
          return true;
        }

        const searchableText = [
          item.menuId,
          item.name,
          item.description,
          item.category,
          ...item.ingredients,
          ...item.priceOptions.map(
            (option) =>
              `${option.quantity}${option.unit} ${option.price}`
          ),
          ...item.comboItems.map(
            (combo) => combo.itemName
          ),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder
      );
  }, [
    menuItems,
    activeCategory,
    searchQuery,
  ]);

  /* =======================================================
     CREATE
     ======================================================= */

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  /* =======================================================
     EDIT
     ======================================================= */

  const handleEdit = (
    item: MenuItem
  ) => {
    setEditingItem({
      ...item,
      ingredients: [
        ...item.ingredients,
      ],
      priceOptions: item.priceOptions.map(
        (option) => ({
          ...option,
        })
      ),
      comboItems: item.comboItems.map(
        (combo) => ({
          ...combo,
        })
      ),
    });

    setFormOpen(true);
  };

  /* =======================================================
     SAVE
     ======================================================= */

  const handleSave = (
    item: MenuItem
  ) => {
    const existing = menuItems.find(
      (menu) =>
        menu.menuId === item.menuId
    );

    if (
      !item.menuId.trim() ||
      !item.name.trim() ||
      !item.description.trim()
    ) {
      Alert.alert(
        "Required fields",
        "Menu ID, product name and description are required."
      );
      return;
    }

    if (
      item.priceOptions.length === 0
    ) {
      Alert.alert(
        "Price required",
        "Add at least one price option."
      );
      return;
    }

    const invalidPrice =
      item.priceOptions.some(
        (option) =>
          option.quantity <= 0 ||
          option.price < 0
      );

    if (invalidPrice) {
      Alert.alert(
        "Invalid price",
        "Quantity must be greater than 0 and price cannot be negative."
      );
      return;
    }

    if (
      editingItem &&
      existing &&
      existing.menuId !== editingItem.menuId
    ) {
      Alert.alert(
        "Duplicate Menu ID",
        "This Menu ID already exists."
      );
      return;
    }

    if (
      !editingItem &&
      existing
    ) {
      Alert.alert(
        "Duplicate Menu ID",
        "A product with this Menu ID already exists."
      );
      return;
    }

    if (editingItem) {
      setMenuItems((current) =>
        current.map((menu) =>
          menu.menuId === editingItem.menuId
            ? item
            : menu
        )
      );
    } else {
      setMenuItems((current) => [
        ...current,
        item,
      ]);
    }

    setFormOpen(false);
    setEditingItem(null);
  };

  /* =======================================================
     DELETE
     ======================================================= */

  const handleDelete = (
    item: MenuItem
  ) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMenuItems((current) =>
              current.filter(
                (menu) =>
                  menu.menuId !==
                  item.menuId
              )
            );
          },
        },
      ]
    );
  };

  /* =======================================================
     TOGGLE AVAILABILITY
     ======================================================= */

  const toggleAvailability = (
    item: MenuItem
  ) => {
    setMenuItems((current) =>
      current.map((menu) =>
        menu.menuId === item.menuId
          ? {
              ...menu,
              isAvailable:
                !menu.isAvailable,
            }
          : menu
      )
    );
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
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
                {menuItems.length} products •
                Manage prices, ingredients,
                offers & availability
              </Text>
            </View>

            <Pressable
              onPress={handleCreate}
              style={({ pressed }) => [
                styles.addButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Plus
                size={17}
                color="#ffffff"
              />

              <Text style={styles.addText}>
                Add
              </Text>
            </Pressable>
          </View>

          {/* SEARCH */}

          <View style={styles.searchBox}>
            <Search
              size={17}
              color="#a8a29e"
            />

            <TextInput
              value={searchQuery}
              onChangeText={
                setSearchQuery
              }
              placeholder="Search products, ingredients, menu ID..."
              placeholderTextColor="#a8a29e"
              style={
                styles.searchInput
              }
              autoCorrect={false}
            />

            {searchQuery.length > 0 && (
              <Pressable
                onPress={() =>
                  setSearchQuery("")
                }
              >
                <X
                  size={17}
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
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.categoryContainer
          }
        >
          <Pressable
            onPress={() =>
              setActiveCategory("All")
            }
            style={[
              styles.categoryButton,
              activeCategory ===
                "All" &&
                styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory ===
                  "All" &&
                  styles.categoryTextActive,
              ]}
            >
              All
            </Text>

            <View
              style={[
                styles.categoryCount,
                activeCategory ===
                  "All" &&
                  styles.categoryCountActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryCountText,
                  activeCategory ===
                    "All" &&
                    styles.categoryCountTextActive,
                ]}
              >
                {menuItems.length}
              </Text>
            </View>
          </Pressable>

          {CATEGORIES.map(
            (category) => {
              const count =
                menuItems.filter(
                  (item) =>
                    item.category ===
                    category.value
                ).length;

              const active =
                activeCategory ===
                category.value;

              return (
                <Pressable
                  key={
                    category.value
                  }
                  onPress={() =>
                    setActiveCategory(
                      category.value
                    )
                  }
                  style={[
                    styles.categoryButton,
                    active &&
                      styles.categoryButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      active &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category.label}
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
            }
          )}
        </ScrollView>

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        <View
          style={styles.productGrid}
        >
          {filteredItems.length ===
          0 ? (
            <View
              style={styles.emptyCard}
            >
              <View
                style={styles.emptyIcon}
              >
                <Layers
                  size={26}
                  color="#b45309"
                />
              </View>

              <Text
                style={styles.emptyTitle}
              >
                No products found
              </Text>

              <Text
                style={
                  styles.emptyDescription
                }
              >
                Try another search term
                or clear your category
                filter.
              </Text>

              <Pressable
                onPress={() => {
                  setSearchQuery("");
                  setActiveCategory(
                    "All"
                  );
                }}
                style={
                  styles.clearButton
                }
              >
                <Text
                  style={
                    styles.clearButtonText
                  }
                >
                  Clear filters
                </Text>
              </Pressable>
            </View>
          ) : (
            filteredItems.map(
              (item) => (
                <ProductCard
                  key={item.menuId}
                  item={item}
                  onEdit={() =>
                    handleEdit(item)
                  }
                  onDelete={() =>
                    handleDelete(item)
                  }
                  onToggleAvailability={() =>
                    toggleAvailability(
                      item
                    )
                  }
                />
              )
            )
          )}
        </View>

        <View
          style={{ height: 40 }}
        />
      </ScrollView>

      {/* =================================================
          FORM MODAL
      ================================================= */}

      <ProductFormModal
        visible={formOpen}
        item={editingItem}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
      />
    </View>
  );
}

/* =========================================================
   PRODUCT CARD
   ========================================================= */

const ProductCard: React.FC<
  ProductCardProps
> = ({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const lowestPrice =
    item.priceOptions.length > 0
      ? Math.min(
          ...item.priceOptions.map(
            (option) => option.price
          )
        )
      : 0;

  return (
    <View
      style={styles.productCard}
    >
      {/* IMAGE */}

      <View
        style={styles.productImage}
      >
        {item.image ? (
          <Image
            source={{
              uri: item.image,
            }}
            style={
              styles.productImageReal
            }
            resizeMode="cover"
          />
        ) : (
          <Text
            style={
              styles.productEmoji
            }
          >
            {getCategoryEmoji(
              item.category
            )}
          </Text>
        )}

        {!item.isAvailable && (
          <View
            style={
              styles.unavailableOverlay
            }
          >
            <Text
              style={
                styles.unavailableText
              }
            >
              UNAVAILABLE
            </Text>
          </View>
        )}

        {item.isFeatured && (
          <View
            style={
              styles.featuredBadge
            }
          >
            <Star
              size={11}
              color="#92400e"
              fill="#f59e0b"
            />

            <Text
              style={
                styles.featuredText
              }
            >
              Featured
            </Text>
          </View>
        )}
      </View>

      {/* CONTENT */}

      <View
        style={
          styles.productContent
        }
      >
        <View
          style={
            styles.productHeader
          }
        >
          <View
            style={
              styles.productTitleArea
            }
          >
            <Text
              style={
                styles.productName
              }
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text
              style={
                styles.productMenuId
              }
            >
              {item.menuId}
            </Text>

            <View
              style={
                styles.categoryBadge
              }
            >
              <Text
                style={
                  styles.categoryBadgeText
                }
              >
                {getCategoryLabel(
                  item.category
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.priceContainer
            }
          >
            <Text
              style={
                styles.priceFrom
              }
            >
              From
            </Text>

            <Text
              style={
                styles.productPrice
              }
            >
              ₹{lowestPrice}
            </Text>
          </View>
        </View>

        {/* DESCRIPTION */}

        <Text
          style={
            styles.productDescription
          }
          numberOfLines={3}
        >
          {item.description}
        </Text>

        {/* INGREDIENTS */}

        {item.ingredients
          .length > 0 && (
          <View
            style={
              styles.sectionSmall
            }
          >
            <View
              style={
                styles.sectionTitleRow
              }
            >
              <Tag
                size={12}
                color="#92400e"
              />

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Ingredients
              </Text>
            </View>

            <View
              style={styles.tagsRow}
            >
              {item.ingredients
                .slice(0, 5)
                .map(
                  (ingredient) => (
                    <View
                      key={
                        ingredient
                      }
                      style={styles.tag}
                    >
                      <Text
                        style={
                          styles.tagText
                        }
                      >
                        {
                          ingredient
                        }
                      </Text>
                    </View>
                  )
                )}

              {item.ingredients
                .length > 5 && (
                <Text
                  style={
                    styles.moreText
                  }
                >
                  +
                  {item.ingredients
                    .length -
                    5}{" "}
                  more
                </Text>
              )}
            </View>
          </View>
        )}

        {/* PRICE OPTIONS */}

        <View
          style={
            styles.priceOptionsBox
          }
        >
          <View
            style={
              styles.sectionTitleRow
            }
          >
            <Package
              size={13}
              color="#650700"
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              Price Options
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.priceOptionsRow
            }
          >
            {item.priceOptions.map(
              (
                option,
                index
              ) => (
                <View
                  key={index}
                  style={
                    styles.priceOption
                  }
                >
                  <Text
                    style={
                      styles.priceOptionQuantity
                    }
                  >
                    {option.quantity}
                    {option.unit}
                  </Text>

                  <Text
                    style={
                      styles.priceOptionPrice
                    }
                  >
                    ₹{option.price}
                  </Text>
                </View>
              )
            )}
          </ScrollView>
        </View>

        {/* COMBO */}

        {item.comboItems
          .length > 0 && (
          <View
            style={
              styles.comboBox
            }
          >
            <Text
              style={
                styles.comboTitle
              }
            >
              Combo contains
            </Text>

            {item.comboItems.map(
              (
                combo,
                index
              ) => (
                <Text
                  key={index}
                  style={
                    styles.comboText
                  }
                >
                  •{" "}
                  {
                    combo.itemName
                  }{" "}
                  —{" "}
                  {
                    combo.quantity
                  }
                  {combo.unit}
                </Text>
              )
            )}
          </View>
        )}

        {/* OFFER */}

        {item.offer.enabled && (
          <View
            style={
              styles.offerBox
            }
          >
            <View
              style={
                styles.offerHeader
              }
            >
              <Text
                style={
                  styles.offerTitle
                }
              >
                {item.offer.title ||
                  "Special Offer"}
              </Text>

              {item.offer.price !==
                undefined && (
                <Text
                  style={
                    styles.offerPrice
                  }
                >
                  ₹
                  {
                    item.offer
                      .price
                  }
                </Text>
              )}
            </View>

            {item.offer
              .description && (
              <Text
                style={
                  styles.offerDescription
                }
              >
                {
                  item.offer
                    .description
                }
              </Text>
            )}
          </View>
        )}

        {/* STORAGE */}

        <View
          style={
            styles.detailsRow
          }
        >
          {item.storage
            .shelfLife?.value !==
            undefined && (
            <View
              style={
                styles.detailItem
              }
            >
              <Clock
                size={12}
                color="#a8a29e"
              />

              <Text
                style={
                  styles.detailText
                }
              >
                Shelf life:{" "}
                {
                  item.storage
                    .shelfLife
                    .value
                }{" "}
                {
                  item.storage
                    .shelfLife
                    .unit
                }
              </Text>
            </View>
          )}

          <View
            style={
              styles.detailItem
            }
          >
            {item.isAvailable ? (
              <CheckCircle2
                size={13}
                color="#166534"
              />
            ) : (
              <EyeOff
                size={13}
                color="#b91c1c"
              />
            )}

            <Text
              style={[
                styles.detailText,
                item.isAvailable
                  ? styles.availableText
                  : styles.unavailableText2,
              ]}
            >
              {item.isAvailable
                ? "Available"
                : "Unavailable"}
            </Text>
          </View>
        </View>

        {/* FOOTER */}

        <View
          style={
            styles.cardFooter
          }
        >
          <Pressable
            onPress={
              onToggleAvailability
            }
            style={[
              styles.availabilityButton,
              item.isAvailable
                ? styles.available
                : styles.unavailable,
            ]}
          >
            {item.isAvailable ? (
              <CheckCircle2
                size={13}
                color="#166534"
              />
            ) : (
              <EyeOff
                size={13}
                color="#b91c1c"
              />
            )}

            <Text
              style={[
                styles.availabilityText,
                item.isAvailable
                  ? styles.availableText
                  : styles.unavailableText2,
              ]}
            >
              {item.isAvailable
                ? "Available"
                : "Unavailable"}
            </Text>
          </Pressable>

          <View
            style={styles.actions}
          >
            <Pressable
              onPress={onEdit}
              style={
                styles.editButton
              }
            >
              <Edit3
                size={14}
                color="#650700"
              />

              <Text
                style={
                  styles.editText
                }
              >
                Edit
              </Text>
            </Pressable>

            <Pressable
              onPress={onDelete}
              style={
                styles.deleteButton
              }
            >
              <Trash2
                size={14}
                color="#b91c1c"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

/* =========================================================
   PRODUCT FORM MODAL
   ========================================================= */

const ProductFormModal: React.FC<
  ProductFormModalProps
> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  const [form, setForm] =
    useState<MenuItem>(
      item || createEmptyItem()
    );

  const [ingredientsText, setIngredientsText] =
    useState(
      item?.ingredients.join(", ") ||
        ""
    );

  React.useEffect(() => {
    const next =
      item || createEmptyItem();

    setForm({
      ...next,
      storage: {
        ...next.storage,
        shelfLife: {
          ...next.storage.shelfLife,
        },
      },
      offer: {
        ...next.offer,
      },
      priceOptions:
        next.priceOptions.map(
          (option) => ({
            ...option,
          })
        ),
      comboItems:
        next.comboItems.map(
          (combo) => ({
            ...combo,
          })
        ),
    });

    setIngredientsText(
      next.ingredients.join(", ")
    );
  }, [item, visible]);

  /* =======================================================
     UPDATE FIELD
     ======================================================= */

  const updateField = <
    K extends keyof MenuItem
  >(
    key: K,
    value: MenuItem[K]
  ) => {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  };

  /* =======================================================
     PRICE OPTION
     ======================================================= */

  const updatePriceOption = (
    index: number,
    key: keyof PriceOption,
    value: string
  ) => {
    setForm((current) => {
      const options = [
        ...current.priceOptions,
      ];

      const currentOption =
        options[index];

      if (key === "quantity") {
        options[index] = {
          ...currentOption,
          quantity:
            Number(value) || 0,
        };
      }

      if (key === "price") {
        options[index] = {
          ...currentOption,
          price:
            Number(value) || 0,
        };
      }

      if (key === "unit") {
        options[index] = {
          ...currentOption,
          unit: value as PriceUnit,
        };
      }

      return {
        ...current,
        priceOptions: options,
      };
    });
  };

  const addPriceOption = () => {
    setForm((current) => ({
      ...current,
      priceOptions: [
        ...current.priceOptions,
        {
          quantity: 500,
          unit: "g",
          price: 0,
        },
      ],
    }));
  };

  const removePriceOption = (
    index: number
  ) => {
    setForm((current) => ({
      ...current,
      priceOptions:
        current.priceOptions.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =======================================================
     COMBO ITEM
     ======================================================= */

  const updateComboItem = (
    index: number,
    key: keyof ComboItem,
    value: string
  ) => {
    setForm((current) => {
      const items = [
        ...current.comboItems,
      ];

      const currentItem =
        items[index];

      if (key === "itemName") {
        items[index] = {
          ...currentItem,
          itemName: value,
        };
      }

      if (key === "quantity") {
        items[index] = {
          ...currentItem,
          quantity:
            Number(value) || 0,
        };
      }

      if (key === "unit") {
        items[index] = {
          ...currentItem,
          unit: value as PriceUnit,
        };
      }

      return {
        ...current,
        comboItems: items,
      };
    });
  };

  const addComboItem = () => {
    setForm((current) => ({
      ...current,
      comboItems: [
        ...current.comboItems,
        {
          itemName: "",
          quantity: 1,
          unit: "piece",
        },
      ],
    }));
  };

  const removeComboItem = (
    index: number
  ) => {
    setForm((current) => ({
      ...current,
      comboItems:
        current.comboItems.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =======================================================
     OFFER
     ======================================================= */

  const updateOffer = (
    key: keyof Offer,
    value: any
  ) => {
    setForm((current) => ({
      ...current,
      offer: {
        ...current.offer,
        [key]: value,
      },
    }));
  };

  /* =======================================================
     STORAGE
     ======================================================= */

  const updateStorage = (
    key: "instructions",
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      storage: {
        ...current.storage,
        [key]: value,
      },
    }));
  };

  const updateShelfLife = (
    key: "value" | "unit",
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      storage: {
        ...current.storage,
        shelfLife: {
          ...current.storage
            .shelfLife,
          [key]:
            key === "value"
              ? Number(value) || 0
              : value,
        },
      },
    }));
  };

  /* =======================================================
     SAVE
     ======================================================= */

  const handleSubmit = () => {
    const normalized: MenuItem = {
      ...form,

      menuId: form.menuId.trim(),

      name: form.name.trim(),

      description:
        form.description.trim(),

      ingredients:
        ingredientsText
          .split(",")
          .map(
            (item) => item.trim()
          )
          .filter(Boolean),

      image:
        form.image?.trim() || null,

      priceOptions:
        form.priceOptions.map(
          (option) => ({
            quantity:
              Number(
                option.quantity
              ),
            unit: option.unit,
            price:
              Number(option.price),
          })
        ),

      comboItems:
        form.comboItems
          .filter(
            (item) =>
              item.itemName.trim()
          )
          .map((item) => ({
            itemName:
              item.itemName.trim(),
            quantity:
              Number(item.quantity),
            unit: item.unit,
          })),

      storage: {
        instructions:
          form.storage
            .instructions?.trim(),

        shelfLife: {
          value:
            form.storage
              .shelfLife?.value,

          unit:
            form.storage
              .shelfLife?.unit,
        },
      },

      offer: {
        enabled:
          form.offer.enabled,

        title:
          form.offer.title?.trim(),

        description:
          form.offer.description?.trim(),

        price:
          form.offer.price !==
          undefined
            ? Number(
                form.offer.price
              )
            : undefined,
      },

      isAvailable:
        form.isAvailable,

      isFeatured:
        form.isFeatured,

      sortOrder:
        Number(form.sortOrder) || 0,
    };

    onSave(normalized);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={
          styles.modalBackground
        }
      >
        <View
          style={styles.modalCard}
        >
          {/* =================================================
              MODAL HEADER
          ================================================= */}

          <View
            style={
              styles.modalHeader
            }
          >
            <View
              style={
                styles.modalHeaderText
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                {item
                  ? "Edit Product"
                  : "Add Product"}
              </Text>

              <Text
                style={
                  styles.modalSubtitle
                }
              >
                Configure product details,
                prices and availability
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={
                styles.modalClose
              }
            >
              <X
                size={20}
                color="#57534e"
              />
            </Pressable>
          </View>

          {/* =================================================
              FORM
          ================================================= */}

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.formContent
            }
          >
            {/* MENU ID */}

            <InputLabel text="Menu ID *" />

            <TextInput
              value={form.menuId}
              onChangeText={(value) =>
                updateField(
                  "menuId",
                  value.toUpperCase()
                )
              }
              placeholder="Example: MANGO-001"
              placeholderTextColor="#a8a29e"
              style={styles.input}
              autoCapitalize="characters"
            />

            {/* PRODUCT NAME */}

            <InputLabel text="Product Name *" />

            <TextInput
              value={form.name}
              onChangeText={(value) =>
                updateField(
                  "name",
                  value
                )
              }
              placeholder="Enter product name"
              placeholderTextColor="#a8a29e"
              style={styles.input}
            />

            {/* CATEGORY */}

            <InputLabel text="Category *" />

            <View
              style={
                styles.categorySelectGrid
              }
            >
              {CATEGORIES.map(
                (category) => {
                  const active =
                    form.category ===
                    category.value;

                  return (
                    <Pressable
                      key={
                        category.value
                      }
                      onPress={() =>
                        updateField(
                          "category",
                          category.value
                        )
                      }
                      style={[
                        styles.formCategoryButton,
                        active &&
                          styles.formCategoryButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.formCategoryEmoji,
                        ]}
                      >
                        {getCategoryEmoji(
                          category.value
                        )}
                      </Text>

                      <Text
                        style={[
                          styles.formCategoryText,
                          active &&
                            styles.formCategoryTextActive,
                        ]}
                      >
                        {
                          category.label
                        }
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>

            {/* DESCRIPTION */}

            <InputLabel text="Description *" />

            <TextInput
              value={
                form.description
              }
              onChangeText={(value) =>
                updateField(
                  "description",
                  value
                )
              }
              placeholder="Describe the product"
              placeholderTextColor="#a8a29e"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
              ]}
            />

            {/* IMAGE */}

            <InputLabel text="Image URL" />

            <TextInput
              value={
                form.image || ""
              }
              onChangeText={(value) =>
                updateField(
                  "image",
                  value || null
                )
              }
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#a8a29e"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
            />

            {/* INGREDIENTS */}

            <InputLabel text="Ingredients" />

            <TextInput
              value={
                ingredientsText
              }
              onChangeText={
                setIngredientsText
              }
              placeholder="Raw Mango, Mustard, Chilli, Salt..."
              placeholderTextColor="#a8a29e"
              multiline
              style={[
                styles.input,
                styles.ingredientsInput,
              ]}
            />

            <Text
              style={
                styles.helperText
              }
            >
              Separate ingredients with
              commas.
            </Text>

            {/* =================================================
                PRICE OPTIONS
            ================================================= */}

            <FormSectionTitle
              icon={
                <Package
                  size={15}
                  color="#650700"
                />
              }
              title="Price Options"
              buttonText="Add Price"
              onPress={
                addPriceOption
              }
            />

            {form.priceOptions.map(
              (
                option,
                index
              ) => (
                <View
                  key={index}
                  style={
                    styles.dynamicCard
                  }
                >
                  <View
                    style={
                      styles.dynamicHeader
                    }
                  >
                    <Text
                      style={
                        styles.dynamicTitle
                      }
                    >
                      Option {index + 1}
                    </Text>

                    {form.priceOptions
                      .length >
                      1 && (
                      <Pressable
                        onPress={() =>
                          removePriceOption(
                            index
                          )
                        }
                      >
                        <Trash2
                          size={15}
                          color="#b91c1c"
                        />
                      </Pressable>
                    )}
                  </View>

                  <View
                    style={
                      styles.threeColumns
                    }
                  >
                    <View
                      style={
                        styles.flexInput
                      }
                    >
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Quantity
                      </Text>

                      <TextInput
                        value={String(
                          option.quantity
                        )}
                        onChangeText={(
                          value
                        ) =>
                          updatePriceOption(
                            index,
                            "quantity",
                            value
                          )
                        }
                        keyboardType="numeric"
                        style={
                          styles.smallInput
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.flexInput
                      }
                    >
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Unit
                      </Text>

                      <UnitSelector
                        value={
                          option.unit
                        }
                        options={
                          PRICE_UNITS
                        }
                        onChange={(
                          value
                        ) =>
                          updatePriceOption(
                            index,
                            "unit",
                            value
                          )
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.flexInput
                      }
                    >
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Price ₹
                      </Text>

                      <TextInput
                        value={String(
                          option.price
                        )}
                        onChangeText={(
                          value
                        ) =>
                          updatePriceOption(
                            index,
                            "price",
                            value
                          )
                        }
                        keyboardType="numeric"
                        style={
                          styles.smallInput
                        }
                      />
                    </View>
                  </View>
                </View>
              )
            )}

            {/* =================================================
                COMBO ITEMS
            ================================================= */}

            <FormSectionTitle
              icon={
                <Layers
                  size={15}
                  color="#650700"
                />
              }
              title="Combo Items"
              buttonText="Add Item"
              onPress={
                addComboItem
              }
            />

            {form.comboItems
              .length === 0 && (
              <View
                style={
                  styles.infoBox
                }
              >
                <Text
                  style={
                    styles.infoText
                  }
                >
                  Add items here only for
                  combo products.
                </Text>
              </View>
            )}

            {form.comboItems.map(
              (
                combo,
                index
              ) => (
                <View
                  key={index}
                  style={
                    styles.dynamicCard
                  }
                >
                  <View
                    style={
                      styles.dynamicHeader
                    }
                  >
                    <Text
                      style={
                        styles.dynamicTitle
                      }
                    >
                      Combo Item{" "}
                      {index + 1}
                    </Text>

                    <Pressable
                      onPress={() =>
                        removeComboItem(
                          index
                        )
                      }
                    >
                      <Trash2
                        size={15}
                        color="#b91c1c"
                      />
                    </Pressable>
                  </View>

                  <Text
                    style={
                      styles.smallLabel
                    }
                  >
                    Item Name
                  </Text>

                  <TextInput
                    value={
                      combo.itemName
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateComboItem(
                        index,
                        "itemName",
                        value
                      )
                    }
                    placeholder="Example: Mango Pickle"
                    placeholderTextColor="#a8a29e"
                    style={
                      styles.smallInput
                    }
                  />

                  <View
                    style={
                      styles.twoColumns
                    }
                  >
                    <View
                      style={
                        styles.flexInput
                      }
                    >
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Quantity
                      </Text>

                      <TextInput
                        value={String(
                          combo.quantity
                        )}
                        onChangeText={(
                          value
                        ) =>
                          updateComboItem(
                            index,
                            "quantity",
                            value
                          )
                        }
                        keyboardType="numeric"
                        style={
                          styles.smallInput
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.flexInput
                      }
                    >
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Unit
                      </Text>

                      <UnitSelector
                        value={
                          combo.unit
                        }
                        options={
                          PRICE_UNITS
                        }
                        onChange={(
                          value
                        ) =>
                          updateComboItem(
                            index,
                            "unit",
                            value
                          )
                        }
                      />
                    </View>
                  </View>
                </View>
              )
            )}

            {/* =================================================
                STORAGE
            ================================================= */}

            <FormSectionTitle
              icon={
                <Clock
                  size={15}
                  color="#650700"
                />
              }
              title="Storage"
            />

            <InputLabel text="Storage Instructions" />

            <TextInput
              value={
                form.storage
                  .instructions ||
                ""
              }
              onChangeText={(value) =>
                updateStorage(
                  "instructions",
                  value
                )
              }
              placeholder="Store in a cool and dry place..."
              placeholderTextColor="#a8a29e"
              multiline
              style={[
                styles.input,
                styles.storageTextArea,
              ]}
            />

            <InputLabel text="Shelf Life" />

            <View
              style={
                styles.twoColumns
              }
            >
              <View
                style={
                  styles.flexInput
                }
              >
                <TextInput
                  value={
                    form.storage
                      .shelfLife
                      ?.value !==
                    undefined
                      ? String(
                          form.storage
                            .shelfLife
                            ?.value
                        )
                      : ""
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateShelfLife(
                      "value",
                      value
                    )
                  }
                  placeholder="6"
                  placeholderTextColor="#a8a29e"
                  keyboardType="numeric"
                  style={
                    styles.input
                  }
                />
              </View>

              <View
                style={
                  styles.flexInput
                }
              >
                <UnitSelector
                  value={
                    form.storage
                      .shelfLife
                      ?.unit ||
                    "months"
                  }
                  options={
                    SHELF_UNITS
                  }
                  onChange={(
                    value
                  ) =>
                    updateShelfLife(
                      "unit",
                      value
                    )
                  }
                />
              </View>
            </View>

            {/* =================================================
                OFFER
            ================================================= */}

            <FormSectionTitle
              icon={
                <Tag
                  size={15}
                  color="#650700"
                />
              }
              title="Offer"
            />

            <View
              style={
                styles.switchRow
              }
            >
              <View
                style={
                  styles.switchTextArea
                }
              >
                <Text
                  style={
                    styles.switchTitle
                  }
                >
                  Enable Offer
                </Text>

                <Text
                  style={
                    styles.switchDescription
                  }
                >
                  Show this product as a
                  special offer.
                </Text>
              </View>

              <Switch
                value={
                  form.offer.enabled
                }
                onValueChange={(
                  value
                ) =>
                  updateOffer(
                    "enabled",
                    value
                  )
                }
                trackColor={{
                  false: "#d6d3d1",
                  true: "#d99a8f",
                }}
                thumbColor={
                  form.offer.enabled
                    ? "#650700"
                    : "#f5f5f4"
                }
              />
            </View>

            {form.offer
              .enabled && (
              <>
                <InputLabel text="Offer Title" />

                <TextInput
                  value={
                    form.offer
                      .title ||
                    ""
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateOffer(
                      "title",
                      value
                    )
                  }
                  placeholder="Combo Special"
                  placeholderTextColor="#a8a29e"
                  style={
                    styles.input
                  }
                />

                <InputLabel text="Offer Description" />

                <TextInput
                  value={
                    form.offer
                      .description ||
                    ""
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateOffer(
                      "description",
                      value
                    )
                  }
                  placeholder="Save more with this offer..."
                  placeholderTextColor="#a8a29e"
                  multiline
                  style={[
                    styles.input,
                    styles.textArea,
                  ]}
                />

                <InputLabel text="Offer Price ₹" />

                <TextInput
                  value={
                    form.offer
                      .price !==
                    undefined
                      ? String(
                          form.offer
                            .price
                        )
                      : ""
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateOffer(
                      "price",
                      value ===
                        ""
                        ? undefined
                        : Number(
                            value
                          )
                    )
                  }
                  placeholder="799"
                  placeholderTextColor="#a8a29e"
                  keyboardType="numeric"
                  style={
                    styles.input
                  }
                />
              </>
            )}

            {/* =================================================
                SETTINGS
            ================================================= */}

            <FormSectionTitle
              icon={
                <Star
                  size={15}
                  color="#650700"
                />
              }
              title="Product Settings"
            />

            <View
              style={
                styles.switchRow
              }
            >
              <View
                style={
                  styles.switchTextArea
                }
              >
                <Text
                  style={
                    styles.switchTitle
                  }
                >
                  Available
                </Text>

                <Text
                  style={
                    styles.switchDescription
                  }
                >
                  Customers can order this
                  product.
                </Text>
              </View>

              <Switch
                value={
                  form.isAvailable
                }
                onValueChange={(
                  value
                ) =>
                  updateField(
                    "isAvailable",
                    value
                  )
                }
                trackColor={{
                  false: "#d6d3d1",
                  true: "#d99a8f",
                }}
                thumbColor={
                  form.isAvailable
                    ? "#650700"
                    : "#f5f5f4"
                }
              />
            </View>

            <View
              style={
                styles.switchRow
              }
            >
              <View
                style={
                  styles.switchTextArea
                }
              >
                <Text
                  style={
                    styles.switchTitle
                  }
                >
                  Featured Product
                </Text>

                <Text
                  style={
                    styles.switchDescription
                  }
                >
                  Highlight this product in
                  the app.
                </Text>
              </View>

              <Switch
                value={
                  form.isFeatured
                }
                onValueChange={(
                  value
                ) =>
                  updateField(
                    "isFeatured",
                    value
                  )
                }
                trackColor={{
                  false: "#d6d3d1",
                  true: "#d99a8f",
                }}
                thumbColor={
                  form.isFeatured
                    ? "#650700"
                    : "#f5f5f4"
                }
              />
            </View>

            {/* SORT ORDER */}

            <InputLabel text="Sort Order" />

            <TextInput
              value={String(
                form.sortOrder
              )}
              onChangeText={(value) =>
                updateField(
                  "sortOrder",
                  Number(value) || 0
                )
              }
              placeholder="0"
              placeholderTextColor="#a8a29e"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* =================================================
                ACTIONS
            ================================================= */}

            <View
              style={
                styles.modalActions
              }
            >
              <Pressable
                onPress={onClose}
                style={
                  styles.cancelButton
                }
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={
                  handleSubmit
                }
                style={
                  styles.saveButton
                }
              >
                <CheckCircle2
                  size={16}
                  color="#ffffff"
                />

                <Text
                  style={
                    styles.saveText
                  }
                >
                  {item
                    ? "Save Changes"
                    : "Add Product"}
                </Text>
              </Pressable>
            </View>

            <View
              style={{ height: 25 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* =========================================================
   INPUT LABEL
   ========================================================= */

const InputLabel = ({
  text,
}: InputLabelProps) => {
  return (
    <Text
      style={styles.inputLabel}
    >
      {text}
    </Text>
  );
};

/* =========================================================
   FORM SECTION TITLE
   ========================================================= */

const FormSectionTitle = ({
  icon,
  title,
  buttonText,
  onPress,
}: FormSectionTitleProps) => {
  return (
    <View
      style={
        styles.formSectionHeader
      }
    >
      <View
        style={
          styles.formSectionTitleRow
        }
      >
        {icon}

        <Text
          style={
            styles.formSectionTitle
          }
        >
          {title}
        </Text>
      </View>

      {buttonText &&
        onPress && (
          <Pressable
            onPress={onPress}
            style={
              styles.addSmallButton
            }
          >
            <Plus
              size={13}
              color="#650700"
            />

            <Text
              style={
                styles.addSmallText
              }
            >
              {buttonText}
            </Text>
          </Pressable>
        )}
    </View>
  );
};

/* =========================================================
   UNIT SELECTOR
   ========================================================= */

const UnitSelector = ({
  value,
  options,
  onChange,
}: UnitSelectorProps) => {
  const [open, setOpen] =
    useState(false);

  return (
    <View
      style={
        styles.unitSelectorWrapper
      }
    >
      <Pressable
        onPress={() =>
          setOpen((current) => !current)
        }
        style={
          styles.unitSelector
        }
      >
        <Text
          style={
            styles.unitSelectorText
          }
        >
          {value}
        </Text>

        <ChevronDown
          size={15}
          color="#78716c"
        />
      </Pressable>

      {open && (
        <View
          style={
            styles.unitDropdown
          }
        >
          {options.map(
            (option) => (
              <Pressable
                key={option}
                onPress={() => {
                  onChange(
                    option
                  );
                  setOpen(false);
                }}
                style={
                  styles.unitOption
                }
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    option ===
                      value &&
                      styles.unitOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            )
          )}
        </View>
      )}
    </View>
  );
};

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  content: {
    padding: 12,
    paddingBottom: 35,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: "#1c1917",
    fontSize: 18,
    fontWeight: "800",
  },

  subtitle: {
    color: "#78716c",
    fontSize: 10,
    marginTop: 4,
    lineHeight: 15,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#650700",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 2,
  },

  addText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 15,
    minHeight: 44,
    paddingHorizontal: 11,
    marginTop: 13,
  },

  searchInput: {
    flex: 1,
    color: "#1c1917",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  /* =======================================================
     CATEGORY
  ======================================================= */

  categoryContainer: {
    gap: 7,
    paddingBottom: 10,
    paddingRight: 10,
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  categoryButtonActive: {
    backgroundColor: "#650700",
    borderColor: "#650700",
  },

  categoryText: {
    color: "#57534e",
    fontSize: 10,
    fontWeight: "800",
  },

  categoryTextActive: {
    color: "#ffffff",
  },

  categoryCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f5f5f4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  categoryCountActive: {
    backgroundColor:
      "rgba(255,255,255,0.2)",
  },

  categoryCountText: {
    color: "#57534e",
    fontSize: 8,
    fontWeight: "800",
  },

  categoryCountTextActive: {
    color: "#ffffff",
  },

  /* =======================================================
     PRODUCT
  ======================================================= */

  productGrid: {
    gap: 10,
  },

  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    overflow: "hidden",
    elevation: 1,
  },

  productImage: {
    height: 145,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  productImageReal: {
    width: "100%",
    height: "100%",
  },

  productEmoji: {
    fontSize: 60,
  },

  unavailableOverlay: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  unavailableText: {
    color: "#b91c1c",
    fontSize: 7,
    fontWeight: "900",
  },

  featuredBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  featuredText: {
    color: "#92400e",
    fontSize: 7,
    fontWeight: "800",
  },

  productContent: {
    padding: 12,
  },

  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  productTitleArea: {
    flex: 1,
  },

  productName: {
    color: "#1c1917",
    fontSize: 15,
    fontWeight: "800",
  },

  productMenuId: {
    color: "#a8a29e",
    fontSize: 8,
    marginTop: 3,
    fontWeight: "700",
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f5f5f4",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },

  categoryBadgeText: {
    color: "#57534e",
    fontSize: 7,
    fontWeight: "800",
  },

  priceContainer: {
    alignItems: "flex-end",
  },

  priceFrom: {
    color: "#a8a29e",
    fontSize: 7,
    fontWeight: "600",
  },

  productPrice: {
    color: "#650700",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 1,
  },

  productDescription: {
    color: "#78716c",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 9,
  },

  /* =======================================================
     INGREDIENTS
  ======================================================= */

  sectionSmall: {
    marginTop: 10,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  sectionTitle: {
    color: "#44403c",
    fontSize: 9,
    fontWeight: "800",
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 6,
  },

  tag: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  tagText: {
    color: "#92400e",
    fontSize: 7,
    fontWeight: "700",
  },

  moreText: {
    color: "#78716c",
    fontSize: 7,
    alignSelf: "center",
  },

  /* =======================================================
     PRICE OPTIONS
  ======================================================= */

  priceOptionsBox: {
    marginTop: 11,
    backgroundColor: "#fafaf9",
    borderRadius: 11,
    padding: 9,
  },

  priceOptionsRow: {
    gap: 6,
    paddingTop: 6,
  },

  priceOption: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ead8d3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 62,
  },

  priceOptionQuantity: {
    color: "#57534e",
    fontSize: 8,
    fontWeight: "800",
  },

  priceOptionPrice: {
    color: "#650700",
    fontSize: 9,
    fontWeight: "900",
    marginTop: 2,
  },

  /* =======================================================
     COMBO
  ======================================================= */

  comboBox: {
    marginTop: 9,
    backgroundColor: "#fff7ed",
    borderRadius: 10,
    padding: 9,
  },

  comboTitle: {
    color: "#92400e",
    fontSize: 9,
    fontWeight: "900",
    marginBottom: 4,
  },

  comboText: {
    color: "#78350f",
    fontSize: 8,
    lineHeight: 14,
  },

  /* =======================================================
     OFFER
  ======================================================= */

  offerBox: {
    marginTop: 9,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    padding: 9,
  },

  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  offerTitle: {
    color: "#991b1b",
    fontSize: 10,
    fontWeight: "900",
  },

  offerPrice: {
    color: "#650700",
    fontSize: 12,
    fontWeight: "900",
  },

  offerDescription: {
    color: "#7f1d1d",
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  /* =======================================================
     DETAILS
  ======================================================= */

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 11,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  detailText: {
    color: "#78716c",
    fontSize: 8,
    fontWeight: "600",
  },

  availableText: {
    color: "#166534",
  },

  unavailableText2: {
    color: "#b91c1c",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0eeec",
    marginTop: 11,
    paddingTop: 10,
  },

  availabilityButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
  },

  available: {
    backgroundColor: "#f0fdf4",
  },

  unavailable: {
    backgroundColor: "#fef2f2",
  },

  availabilityText: {
    fontSize: 8,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#ead8d3",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  editText: {
    color: "#650700",
    fontSize: 8,
    fontWeight: "800",
  },

  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     EMPTY
  ======================================================= */

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    padding: 40,
    alignItems: "center",
  },

  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#fffbeb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  emptyTitle: {
    color: "#1c1917",
    fontSize: 13,
    fontWeight: "800",
  },

  emptyDescription: {
    color: "#78716c",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 5,
  },

  clearButton: {
    marginTop: 12,
    padding: 8,
  },

  clearButtonText: {
    color: "#650700",
    fontSize: 10,
    fontWeight: "800",
  },

  /* =======================================================
     MODAL
  ======================================================= */

  modalBackground: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.48)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 18,
    maxHeight: "94%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 8,
  },

  modalHeaderText: {
    flex: 1,
  },

  modalTitle: {
    color: "#1c1917",
    fontSize: 18,
    fontWeight: "800",
  },

  modalSubtitle: {
    color: "#78716c",
    fontSize: 9,
    marginTop: 3,
  },

  modalClose: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#f5f5f4",
    alignItems: "center",
    justifyContent: "center",
  },

  formContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  /* =======================================================
     FORM
  ======================================================= */

  inputLabel: {
    color: "#44403c",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#fafaf9",
    borderRadius: 13,
    minHeight: 43,
    paddingHorizontal: 12,
    color: "#1c1917",
    fontSize: 11,
  },

  textArea: {
    height: 105,
    paddingTop: 11,
  },

  ingredientsInput: {
    minHeight: 70,
    paddingTop: 10,
  },

  storageTextArea: {
    minHeight: 80,
    paddingTop: 10,
  },

  helperText: {
    color: "#a8a29e",
    fontSize: 8,
    marginTop: 4,
  },

  /* =======================================================
     CATEGORY FORM
  ======================================================= */

  categorySelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  formCategoryButton: {
    width: "31%",
    minHeight: 72,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#fafaf9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  formCategoryButtonActive: {
    backgroundColor: "#650700",
    borderColor: "#650700",
  },

  formCategoryEmoji: {
    fontSize: 22,
  },

  formCategoryText: {
    color: "#57534e",
    fontSize: 8,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 4,
  },

  formCategoryTextActive: {
    color: "#ffffff",
  },

  /* =======================================================
     FORM SECTION
  ======================================================= */

  formSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 3,
  },

  formSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  formSectionTitle: {
    color: "#1c1917",
    fontSize: 13,
    fontWeight: "900",
  },

  addSmallButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: "#ead8d3",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  addSmallText: {
    color: "#650700",
    fontSize: 8,
    fontWeight: "800",
  },

  /* =======================================================
     DYNAMIC
  ======================================================= */

  dynamicCard: {
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 13,
    padding: 10,
    marginTop: 8,
  },

  dynamicHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  dynamicTitle: {
    color: "#57534e",
    fontSize: 9,
    fontWeight: "900",
  },

  threeColumns: {
    flexDirection: "row",
    gap: 7,
  },

  twoColumns: {
    flexDirection: "row",
    gap: 8,
  },

  flexInput: {
    flex: 1,
  },

  smallLabel: {
    color: "#78716c",
    fontSize: 8,
    fontWeight: "800",
    marginBottom: 5,
  },

  smallInput: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#ffffff",
    borderRadius: 9,
    minHeight: 38,
    paddingHorizontal: 9,
    color: "#1c1917",
    fontSize: 10,
  },

  /* =======================================================
     UNIT SELECTOR
  ======================================================= */

  unitSelectorWrapper: {
    position: "relative",
    zIndex: 100,
  },

  unitSelector: {
    minHeight: 38,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#ffffff",
    borderRadius: 9,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  unitSelectorText: {
    color: "#1c1917",
    fontSize: 10,
    fontWeight: "700",
  },

  unitDropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 42,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 9,
    elevation: 5,
    zIndex: 999,
  },

  unitOption: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
  },

  unitOptionText: {
    color: "#57534e",
    fontSize: 9,
    fontWeight: "700",
  },

  unitOptionTextActive: {
    color: "#650700",
  },

  /* =======================================================
     INFO
  ======================================================= */

  infoBox: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 10,
    padding: 9,
    marginTop: 8,
  },

  infoText: {
    color: "#92400e",
    fontSize: 8,
    lineHeight: 13,
  },

  /* =======================================================
     SWITCH
  ======================================================= */

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#fafaf9",
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 10,
    marginTop: 8,
  },

  switchTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  switchTitle: {
    color: "#44403c",
    fontSize: 10,
    fontWeight: "800",
  },

  switchDescription: {
    color: "#a8a29e",
    fontSize: 8,
    lineHeight: 13,
    marginTop: 2,
  },

  /* =======================================================
     ACTIONS
  ======================================================= */

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 13,
    backgroundColor: "#f5f5f4",
  },

  cancelText: {
    color: "#57534e",
    fontSize: 11,
    fontWeight: "800",
  },

  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 46,
    borderRadius: 13,
    backgroundColor: "#650700",
  },

  saveText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },
});