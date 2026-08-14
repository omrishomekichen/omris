"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../css/menu.css";
import {
  Heart,
  Plus,
  Minus,
  Sparkles,
  Flame,
  ArrowUpDown,
  Filter,
  Search,
  X,
  Info,
  ChevronDown,
  ShieldCheck,
  Star,
  Tag,
} from "lucide-react";
import Api from "../../__apis/api";
import { useCart } from "../../components/CartContext";

export default function MenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>(
    {},
  );
  const [expandedInfoMap, setExpandedInfoMap] = useState<
    Record<string, boolean>
  >({});
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("popularity");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addItem, getQuantity, updateQuantity } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await Api.menu();
        const list = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
            ? response.data
            : [];

        const formatted = list.map((item: any) => {
          const cat = item.category || "veg";
          let defaultImg = "/images/mango_pickle.png";
          let badgeText = item.isFeatured ? "Best Seller" : "";

          if (cat === "nonVeg") {
            defaultImg = "/images/chicken_pickle.png";
            badgeText = item.isFeatured ? "Hot 🔥" : "";
          } else if (cat === "veg") {
            defaultImg = "/images/mango_pickle.png";
            badgeText = item.isFeatured ? "Best Seller" : "";
          } else if (cat === "spicedPowder") {
            defaultImg = "/images/garlic_pickle.png";
            badgeText = item.isFeatured ? "Signature" : "";
          } else if (cat === "combo" || cat === "offer") {
            defaultImg = "/images/kitchen_craft.png";
            badgeText = "Special Combo";
          }

          const rawPrice = item.priceOptions?.[0]?.price
            ? Number(item.priceOptions[0].price)
            : Number(item.price) || 299;

          // Default price options if missing in DB, sorted low-to-high so basic price is FIRST
          const rawPriceOpts =
            item.priceOptions && item.priceOptions.length > 0
              ? item.priceOptions
              : cat === "combo" || cat === "offer"
                ? [{ quantity: 1, unit: "piece", price: rawPrice }]
                : [
                    {
                      quantity: 250,
                      unit: "g",
                      price: Math.round(rawPrice * 0.52),
                    },
                    { quantity: 500, unit: "g", price: rawPrice },
                    {
                      quantity: 1,
                      unit: "kg",
                      price: Math.round(rawPrice * 1.85),
                    },
                  ];

          const priceOpts = [...rawPriceOpts].sort(
            (a: any, b: any) => Number(a.price) - Number(b.price),
          );

          return {
            id: item._id || item.menuId || item.id,
            menuId: item.menuId,
            name: item.name,
            category: cat,
            isFeatured: Boolean(item.isFeatured),
            rawPrice: priceOpts[0]?.price || rawPrice,
            priceOptions: priceOpts,
            ingredients: item.ingredients || [],
            storage: item.storage,
            comboItems: item.comboItems || [],
            description: item.description,
            image: item.image || defaultImg,
            badge: badgeText,
            spiceLevel: cat === "nonVeg" ? "🌶️🌶️ Spicy" : "🌶️ Medium-Spicy",
          };
        });

        setProducts(formatted);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavoritesMap((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Sort logic
  const sortProducts = (items: any[]) => {
    const sorted = [...items];
    if (sortOption === "priceLow") {
      sorted.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortOption === "priceHigh") {
      sorted.sort((a, b) => b.rawPrice - a.rawPrice);
    } else if (sortOption === "popularity") {
      sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return sorted;
  };

  // Filtered & Searched list
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedTab === "all"
        ? true
        : selectedTab === "veg"
          ? p.category === "veg"
          : selectedTab === "nonVeg"
            ? p.category === "nonVeg"
            : selectedTab === "spicedPowder"
              ? p.category === "spicedPowder"
              : selectedTab === "combo"
                ? p.category === "combo" || p.category === "offer"
                : true;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = sortProducts(filteredProducts);

  // Group by category for section layout
  const vegPickles = sortedProducts.filter((p) => p.category === "veg");
  const nonVegPickles = sortedProducts.filter((p) => p.category === "nonVeg");
  const spicedPowders = sortedProducts.filter(
    (p) => p.category === "spicedPowder",
  );
  const comboPickles = sortedProducts.filter(
    (p) => p.category === "combo" || p.category === "offer",
  );

  const renderCard = (product: any) => {
    const priceOpts = product.priceOptions || [];
    const selectedSizeIdx = selectedSizes[product.id] ?? 0;
    const currentOpt = priceOpts[selectedSizeIdx] ||
      priceOpts[0] || { quantity: 250, unit: "g", price: product.rawPrice };
    const sizeLabel = `${currentOpt.quantity}${currentOpt.unit}`;
    const currentPrice = currentOpt.price;
    const originalPrice = Math.round(currentPrice * 1.25);
    const cartItemId = `${product.id}-${sizeLabel}`;
    const qty = getQuantity(cartItemId);
    const isFav = favoritesMap[product.id] || false;
    const isInfoOpen = expandedInfoMap[product.id] || false;

    let badgeClass = "badge-bestseller";
    if (product.badge?.includes("Hot")) badgeClass = "badge-hot";
    if (
      product.badge?.includes("Signature") ||
      product.badge?.includes("Combo")
    )
      badgeClass = "badge-featured";

    const handleCardClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("input") || target.closest("a")) {
        return;
      }
      router.push(`/product/${product.id}`);
    };

    return (
      <div
        key={product.id}
        className="menu-product-card is-visible"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        <div className="menu-card-img-wrapper">
          <img src={product.image} alt={product.name} />
          <div className="menu-card-badges-row">
            {product.badge && (
              <span className={`menu-card-badge ${badgeClass}`}>
                {product.badge}
              </span>
            )}
            <span className="rating-badge">
              <Star size={11} fill="#775800" color="#775800" />
              <span>4.9</span>
            </span>
          </div>
        </div>

        <div className="menu-card-content">
          <div className="menu-card-header">
            <div>
              <span className="menu-card-spice-tag">{product.spiceLevel}</span>
              <h3 className="menu-card-title">
                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {product.name}
                </Link>
              </h3>
            </div>
            <button
              type="button"
              className={`menu-fav-btn ${isFav ? "active" : ""}`}
              onClick={() => toggleFavorite(product.id)}
              aria-label="Save to favorites"
            >
              <Heart size={18} fill={isFav ? "#ba1a1a" : "none"} />
            </button>
          </div>

          <p className="menu-card-desc">{product.description}</p>

          <div className="menu-card-footer">
            <div className="price-display-box">
              <div className="price-values-row">
                <span className="menu-card-original-price">
                  ₹{originalPrice}
                </span>
                <span className="menu-card-price">₹{currentPrice}</span>
              </div>
              <span className="unit-subtext">Basic Price ({sizeLabel})</span>
            </div>

            {qty === 0 ? (
              <button
                type="button"
                className="menu-add-btn"
                onClick={() =>
                  addItem({
                    id: cartItemId,
                    name: `${product.name} (${sizeLabel})`,
                    price: currentPrice,
                    image: product.image,
                    description: `${sizeLabel} • Handcrafted Home Recipe`,
                  })
                }
              >
                <Plus size={16} />
                <span>Add to Order</span>
              </button>
            ) : (
              <div className="menu-qty-control">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => updateQuantity(cartItemId, -1)}
                >
                  <Minus size={14} />
                </button>
                <span className="menu-qty-count">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => updateQuantity(cartItemId, 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="menu-page-root">
      <main className="menu-container">
        {/* Page Header */}
        <div className="menu-header-block">
          <h1 className="menu-header-title">Artisanal Pickles Menu</h1>
          <p className="menu-header-sub">
            Discover our handcrafted selection of small-batch pickles, made with
            love, tradition, and the finest organic ingredients.
          </p>
        </div>

        {/* Sort, Filter & Search Bar */}
        <div className="menu-controls-bar">
          <div className="menu-category-tabs">
            {[
              { id: "all", label: "All Pickles" },
              { id: "veg", label: "Vegetable Pickles" },
              { id: "nonVeg", label: "Non-Veg Specialties" },
              { id: "spicedPowder", label: "Spiced Powders" },
              { id: "combo", label: "Combos & Offers" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`menu-tab-btn ${
                  selectedTab === tab.id ? "active" : ""
                }`}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="menu-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="menu-search-input"
              placeholder="Search pickles, powders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="menu-sort-box">
            <label htmlFor="sort" className="sort-label">
              Sort By:
            </label>
            <select
              id="sort"
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="menu-empty-state">
            <p>Loading artisanal delicacies...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="menu-empty-state">
            <p>No items found in this category.</p>
          </div>
        ) : selectedTab !== "all" ? (
          <div className="menu-section">
            <div className="menu-products-row-wrapper">
              <div className="menu-products-grid">
                {sortedProducts.map(renderCard)}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Category: Vegetable Pickles */}
            {vegPickles.length > 0 && (
              <section className="menu-section">
                <div className="category-title-row">
                  <h2>Vegetable Pickles</h2>
                  <span className="category-count">
                    {vegPickles.length} Items Available
                  </span>
                </div>
                <div className="menu-products-row-wrapper">
                  <div className="menu-products-grid">
                    {vegPickles.map(renderCard)}
                  </div>
                </div>
              </section>
            )}

            {/* Category: Non-Veg Specialties */}
            {nonVegPickles.length > 0 && (
              <section className="menu-section">
                <div className="category-title-row">
                  <h2>Non-Veg Specialties</h2>
                  <span className="category-count">
                    {nonVegPickles.length} Items Available
                  </span>
                </div>
                <div className="menu-products-row-wrapper">
                  <div className="menu-products-grid">
                    {nonVegPickles.map(renderCard)}
                  </div>
                </div>
              </section>
            )}

            {/* Category: Spiced Powders */}
            {spicedPowders.length > 0 && (
              <section className="menu-section">
                <div className="category-title-row">
                  <h2>Spiced Powders</h2>
                  <span className="category-count">
                    {spicedPowders.length} Items Available
                  </span>
                </div>
                <div className="menu-products-row-wrapper">
                  <div className="menu-products-grid">
                    {spicedPowders.map(renderCard)}
                  </div>
                </div>
              </section>
            )}

            {/* Category: Combos & Offers */}
            {comboPickles.length > 0 && (
              <section className="menu-section">
                <div className="category-title-row">
                  <h2>Combos & Offers</h2>
                  <span className="category-count">
                    {comboPickles.length} Items Available
                  </span>
                </div>
                <div className="menu-products-row-wrapper">
                  <div className="menu-products-grid">
                    {comboPickles.map(renderCard)}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
