"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import "../../css/product.css";
import {
  Star,
  StarHalf,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  PackageCheck,
  Snowflake,
  Leaf,
  ShieldCheck,
  Flame,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Api from "../../../__apis/api";
import { useCart } from "../../../components/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const router = useRouter();
  const { addItem, getQuantity, updateQuantity } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response: any = await Api.menu();
        const list = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
          ? response.data
          : [];

        // Find current product or fallback
        let found = list.find(
          (p: any) =>
            p._id === productId ||
            p.menuId === productId ||
            p.id === productId,
        );

        if (!found && list.length > 0) {
          found = list[0];
        }

        if (found) {
          const cat = found.category || "veg";
          let defaultImg = "/images/mango_pickle.png";
          if (cat === "nonVeg") defaultImg = "/images/chicken_pickle.png";
          if (cat === "spicedPowder") defaultImg = "/images/garlic_pickle.png";
          if (cat === "combo" || cat === "offer") defaultImg = "/images/kitchen_craft.png";

          const rawPrice = found.priceOptions?.[0]?.price
            ? Number(found.priceOptions[0].price)
            : Number(found.price) || 299;

          const rawPriceOpts =
            found.priceOptions && found.priceOptions.length > 0
              ? found.priceOptions
              : cat === "combo" || cat === "offer"
              ? [{ quantity: 1, unit: "piece", price: rawPrice }]
              : [
                  { quantity: 250, unit: "g", price: Math.round(rawPrice * 0.52) },
                  { quantity: 500, unit: "g", price: rawPrice },
                  { quantity: 1, unit: "kg", price: Math.round(rawPrice * 1.85) },
                ];

          const priceOpts = [...rawPriceOpts].sort(
            (a: any, b: any) => Number(a.price) - Number(b.price),
          );

          setProduct({
            id: found._id || found.menuId || found.id || "product-detail",
            name: found.name || "Classic Mango Pickle",
            category: cat,
            description:
              found.description ||
              "A timeless recipe passed down through generations. Our Classic Mango Pickle is handcrafted with sun-dried raw green mangoes, steeped in cold-pressed mustard oil and a proprietary blend of aromatic spices.",
            image: found.image || defaultImg,
            priceOptions: priceOpts,
            ingredients: found.ingredients?.length
              ? found.ingredients
              : [
                  "Hand-picked Raw Mangoes",
                  "Cold-pressed Sesame & Mustard Oil",
                  "Fenugreek Seeds",
                  "Sun-dried Red Chilies",
                  "Turmeric Powder",
                  "Natural Sea Salt",
                ],
            storage: found.storage?.instructions || "Store in a cool, dry glass jar. Use a dry spoon.",
            shelfLife: "6 Months",
            rating: 4.9,
            reviewCount: 128,
          });

          // Related products
          const related = list
            .filter((p: any) => (p._id || p.id) !== found._id)
            .slice(0, 3)
            .map((item: any) => ({
              id: item._id || item.menuId || item.id,
              name: item.name,
              price: item.priceOptions?.[0]?.price || item.price || 249,
              image: item.image || defaultImg,
              description: item.description,
            }));

          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="product-loading-container">
        <p>Loading handcrafted product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-loading-container">
        <p>Product not found.</p>
        <Link href="/menu" className="return-link">
          Back to Menu
        </Link>
      </div>
    );
  }

  const currentOpt = product.priceOptions[selectedSizeIdx] || product.priceOptions[0];
  const sizeLabel = `${currentOpt.quantity}${currentOpt.unit}`;
  const currentPrice = currentOpt.price;
  const totalPrice = currentPrice * itemQuantity;
  const cartItemId = `${product.id}-${sizeLabel}`;

  const handleAddToCart = () => {
    for (let i = 0; i < itemQuantity; i++) {
      addItem({
        id: cartItemId,
        name: `${product.name} (${sizeLabel})`,
        price: currentPrice,
        image: product.image,
        description: `${sizeLabel} • Handcrafted Home Recipe`,
      });
    }
  };

  return (
    <div className="product-detail-root">
      <main className="product-detail-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="product-breadcrumb">
          <Link href="/menu" className="breadcrumb-link">
            Menu
          </Link>
          <ChevronRight size={14} className="breadcrumb-icon" />
          <span className="breadcrumb-category">
            {product.category === "nonVeg"
              ? "Non-Vegetarian"
              : product.category === "spicedPowder"
              ? "Spiced Powders"
              : "Vegetarian"}
          </span>
          <ChevronRight size={14} className="breadcrumb-icon" />
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="product-hero-grid">
          {/* Left: Bento Image Gallery */}
          <div className="product-gallery-box">
            <div className="gallery-main-frame">
              <img src={product.image} alt={product.name} className="gallery-main-img" />
              <span className="gallery-badge">100% Home-Made</span>
            </div>
          </div>

          {/* Right: Product Details & Controls */}
          <div className="product-info-column">
            <div className="product-header-block">
              <span className="category-pill-tag">
                {product.category === "nonVeg" ? "NON-VEGETARIAN" : "VEGETARIAN"}
              </span>

              <h1 className="product-main-title">{product.name}</h1>

              <div className="product-rating-row">
                <div className="star-icons">
                  <Star size={18} fill="#775800" color="#775800" />
                  <Star size={18} fill="#775800" color="#775800" />
                  <Star size={18} fill="#775800" color="#775800" />
                  <Star size={18} fill="#775800" color="#775800" />
                  <StarHalf size={18} fill="#775800" color="#775800" />
                </div>
                <span className="review-count">({product.reviewCount} Reviews)</span>
              </div>

              <p className="product-hero-desc">{product.description}</p>
            </div>

            {/* Size Selector Box */}
            <div className="product-size-card">
              <h3 className="size-selector-heading">SELECT PACK SIZE</h3>

              <div className="size-options-grid">
                {product.priceOptions.map((opt: any, idx: number) => {
                  const label = `${opt.quantity}${opt.unit}`;
                  const isSelected = selectedSizeIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`product-size-radio ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedSizeIdx(idx)}
                    >
                      <span className="radio-label">{label}</span>
                      <span className="radio-price">₹{opt.price}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Counter & Add to Order */}
              <div className="quantity-add-row">
                <div className="quantity-counter">
                  <button
                    type="button"
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="counter-val">{itemQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setItemQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button type="button" className="add-to-cart-primary" onClick={handleAddToCart}>
                  <ShoppingBag size={18} />
                  <span>Add to Order — ₹{totalPrice}</span>
                </button>
              </div>
            </div>

            {/* Key Info Badges */}
            <div className="key-badges-grid">
              <div className="badge-card">
                <PackageCheck size={20} className="badge-icon" />
                <div>
                  <div className="badge-title">Shelf Life</div>
                  <div className="badge-sub">{product.shelfLife}</div>
                </div>
              </div>

              <div className="badge-card">
                <Snowflake size={20} className="badge-icon" />
                <div>
                  <div className="badge-title">Storage</div>
                  <div className="badge-sub">Clean dry glass jar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artisanal Process Story Section */}
        <section className="artisanal-story-section">
          <div className="story-card-left">
            <h2 className="story-section-title">The Artisanal Process</h2>
            <p className="story-paragraph">
              Every jar of Omri's Home Kitchen pickle is a labor of love. We start by hand-selecting the firmest, most tart raw green mangoes directly from local family orchards. The mangoes are washed, carefully sliced, and sun-dried to concentrate their natural tanginess.
            </p>
            <p className="story-paragraph">
              Next, we prepare our signature spice blend, slow-roasting each spice to perfection before stone-grinding them. Finally, the mangoes are folded into pure cold-pressed sesame oil, allowing the deep flavors to mature naturally over weeks. No artificial colors or factory preservatives—just time and family tradition.
            </p>

            <h3 className="ingredients-heading">Ingredients & Spices</h3>
            <ul className="ingredients-grid">
              {product.ingredients.map((ing: string, i: number) => (
                <li key={i} className="ingredient-item">
                  <Leaf size={14} className="leaf-icon" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

         
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <h2 className="related-section-title">You May Also Like</h2>
            <div className="related-cards-grid">
              {relatedProducts.map((item) => (
                <div key={item.id} className="related-product-card">
                  <div className="related-img-frame">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="related-info">
                    <h3 className="related-name">{item.name}</h3>
                    <p className="related-desc">{item.description}</p>
                    <div className="related-action-row">
                      <span className="related-price">From ₹{item.price}</span>
                      <button
                        type="button"
                        className="related-add-btn"
                        onClick={() =>
                          addItem({
                            id: `${item.id}-250g`,
                            name: `${item.name} (250g)`,
                            price: Number(item.price),
                            image: item.image,
                            description: item.description,
                          })
                        }
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
