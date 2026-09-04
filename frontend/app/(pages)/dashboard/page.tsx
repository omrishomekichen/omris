"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../css/dashboard.css";
import {
  Sparkles,
  Heart,
  Leaf,
  Package,
  Plus,
  Minus,
  ArrowRight,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Info,
  ChevronDown,
  ShieldCheck,
  Flame,
  Star,
  MessageCircle,
} from "lucide-react";
import Api from "../../__apis/api";
import { DEFAULT_MENU_ITEMS } from "../../data/defaultMenu";
import { useCart } from "../../components/CartContext";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>(
    {},
  );
  const [expandedInfoMap, setExpandedInfoMap] = useState<
    Record<string, boolean>
  >({});
  const [reviews, setReviews] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, getQuantity, updateQuantity } = useCart();

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const res = await Api.getRecentReviews();
        if (res?.success && Array.isArray(res.reviews)) {
          setReviews(res.reviews.slice(0, 10));
        }
      } catch {
        console.error("Failed to load customer reviews.");
      }
    };
    fetchRecentReviews();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response: any = await Api.menu();
        const list = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
            ? response.data
            : response?.menu && Array.isArray(response.menu)
              ? response.menu
              : DEFAULT_MENU_ITEMS;


        let featuredList = list.filter(
          (item: any) =>
            item.isFeatured === true ||
            item.isFeatured === "true" ||
            item.isFeatured === 1,
        );

        if (featuredList.length < 3) {
          featuredList = list.slice(0, 8);
        }

        if (featuredList.length === 0) {
          featuredList = DEFAULT_MENU_ITEMS.slice(0, 8);
        }

        const formatted = featuredList.map((item: any) => {
          const cat = item.category || "veg";
          let defaultImg = "/images/mango_pickle.png";
          let tagLabel = "★ FEATURED";

          if (cat === "nonVeg") {
            defaultImg = "/images/chicken_pickle.png";
            tagLabel = "★ FEATURED NON-VEG";
          } else if (cat === "veg") {
            defaultImg = "/images/mango_pickle.png";
            tagLabel = "★ FEATURED VEG";
          } else if (cat === "spicedPowder") {
            defaultImg = "/images/garlic_pickle.png";
            tagLabel = "★ FEATURED POWDER";
          } else if (cat === "combo" || cat === "offer") {
            defaultImg = "/images/kitchen_craft.png";
            tagLabel = "★ SPECIAL OFFER";
          }

          const rawPrice = item.priceOptions?.[0]?.price
            ? Number(item.priceOptions[0].price)
            : Number(item.price) || 299;


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
            isFeatured: true,
            rawPrice: priceOpts[0]?.price || rawPrice,
            priceOptions: priceOpts,
            ingredients: item.ingredients || [],
            storage: item.storage,
            comboItems: item.comboItems || [],
            description: item.description,
            image: item.image || defaultImg,
            tag: tagLabel,
            spiceLevel: cat === "nonVeg" ? "🌶️🌶️ Spicy" : "🌶️ Medium-Spicy",
          };
        });

        setProducts(formatted);
      } catch {
        toast.error("Unable to load featured items. Please try again.");
      }
    };

    fetchMenu();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="dashboard-root">
      <section className="simple-hero">
        <div className="section-container hero-grid">
          <div className="hero-text">
            <div className="simple-badge">
              <Sparkles size={14} />
              <span>Traditional Home Kitchen</span>
            </div>

            <h1 className="hero-heading">
              Taste the Heritage of <br />
              <span className="accent-text">Aira Pickles</span>
            </h1>

            <p className="hero-subtext">
              Authentic, home-made pickles slow-crafted in fresh, small
              quantities using sun-dried ingredients, cold-pressed sesame oil,
              and secret family recipes. 100% natural with zero chemical
              preservatives.
            </p>

            <div className="hero-feature-row">
              <div className="feature-pill">
                <div className="feature-pill-icon">🏡</div>
                <div className="feature-pill-content">
                  <span className="feature-pill-title">Family Recipe</span>
                  <span className="feature-pill-subtitle">
                    Traditional homemade recipe
                  </span>
                </div>
              </div>

              <div className="feature-pill">
                <div className="feature-pill-icon">🌿</div>
                <div className="feature-pill-content">
                  <span className="feature-pill-title">100% Natural</span>
                  <span className="feature-pill-subtitle">
                    Fresh & quality ingredients
                  </span>
                </div>
              </div>

              <div className="feature-pill">
                <div className="feature-pill-icon">🚚</div>
                <div className="feature-pill-content">
                  <span className="feature-pill-title">Doorstep Shipping</span>
                  <span className="feature-pill-subtitle">
                    Freshly delivered to your door
                  </span>
                </div>
              </div>

              <div className="feature-pill">
                <div className="feature-pill-icon">📞</div>
                <div className="feature-pill-content">
                  <span className="feature-pill-title">+91 63014 53780</span>
                  <span className="feature-pill-subtitle">
                    Call us for orders & enquiries
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#pickles" className="primary-btn">
                <span>Order Pickles Now</span>
                <ArrowRight size={18} />
              </a>

              <a href="#story" className="secondary-btn">
                <span>Our Story</span>
              </a>
            </div>

            <div className="simple-trust-note">
              <Heart size={16} className="heart-icon" />
              <span>
                Handcrafted in small quantities • Loved by 1,000+ homes
              </span>
            </div>
          </div>

          <div className="hero-image-box">
            <div className="hero-card">
              <div className="hero-card-img-wrapper">
                <img
                  src="/images/mango_pickle.png"
                  alt="Fresh Avakaya Mango Pickle"
                />
                <span className="hero-card-badge">⭐ Signature Recipe</span>
              </div>

              <div className="hero-card-info">
                <div>
                  <h3>Classic Avakaya Mango</h3>
                  <span className="card-sub">
                    Sun-Dried Mangoes & Sesame Oil
                  </span>
                </div>

                <div className="card-price-box">
                  <div className="price-values-row">
                    <span className="menu-card-original-price">₹350</span>
                    <span className="card-price">₹280</span>
                  </div>
                  <button
                    type="button"
                    className="card-quick-add"
                    onClick={() =>
                      addItem({
                        id: "mango-avakaya-250g",
                        name: "Classic Avakaya Mango (250g)",
                        price: 280,
                        image: "/images/mango_pickle.png",
                        description: "250g • Sun-Dried Mangoes & Sesame Oil",
                      })
                    }
                  >
                    + Add ({getQuantity("mango-avakaya-250g")})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="promises-section">
        <div className="section-container promises-grid">
          <div className="promise-card">
            <div className="icon-circle">
              <Heart size={22} />
            </div>
            <div>
              <h3>100% Home-Made</h3>
              <p>
                Crafted in our family kitchen with personal care and hygienic
                preparation.
              </p>
            </div>
          </div>

          <div className="promise-card">
            <div className="icon-circle">
              <Leaf size={22} />
            </div>
            <div>
              <h3>Pure Ingredients</h3>
              <p>
                Made with natural sea salt, cold-pressed oils, and zero
                artificial colors.
              </p>
            </div>
          </div>

          <div className="promise-card">
            <div className="icon-circle">
              <Package size={22} />
            </div>
            <div>
              <h3>Fresh & Safely Packed</h3>
              <p>
                Packed carefully in leak-proof glass jars to keep the authentic
                taste intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pickles" className="pickles-section">
        <div className="section-container">
          <div className="pickles-header-row">
            <div>
              <h2>Featured Home-Made Delicacies</h2>
              <p>
                Handpicked customer favorites & special offers — freshly made
                and delivered with care.
              </p>
            </div>

            <div className="slider-nav-btns">
              <button
                type="button"
                className="scroll-btn"
                onClick={() => handleScroll("left")}
                aria-label="Scroll Left"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="scroll-btn"
                onClick={() => handleScroll("right")}
                aria-label="Scroll Right"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          <div className="products-wrapper" ref={scrollRef}>
            <div className="products-grid">
              {Array.isArray(products) &&
                products.map((product: any) => {
                  const priceOpts = product.priceOptions || [];
                  const selectedSizeIdx = selectedSizes[product.id] ?? 0;
                  const currentOpt = priceOpts[selectedSizeIdx] ||
                    priceOpts[0] || {
                      quantity: 250,
                      unit: "g",
                      price: product.rawPrice,
                    };
                  const sizeLabel = `${currentOpt.quantity}${currentOpt.unit}`;
                  const currentPrice = currentOpt.price;
                  const originalPrice = Math.round(currentPrice * 1.25);
                  const cartItemId = `${product.id}-${sizeLabel}`;
                  const qty = getQuantity(cartItemId);
                  const isInfoOpen = expandedInfoMap[product.id] || false;

                  const handleCardClick = (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    if (
                      target.closest("button") ||
                      target.closest("input") ||
                      target.closest("a")
                    ) {
                      return;
                    }
                    router.push(`/product/${product.id}`);
                  };

                  return (
                    <div
                      key={product.id}
                      className="simple-product-card is-visible"
                      onClick={handleCardClick}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="product-img-frame">
                        <img src={product.image} alt={product.name} />
                        <span className="product-tag">{product.tag}</span>
                        <span className="dash-rating-badge">
                          <Star size={11} fill="#775800" color="#775800" />
                          <span>4.9</span>
                        </span>
                      </div>

                      <div className="product-details">
                        <span className="product-spice">
                          {product.spiceLevel}
                        </span>
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-desc">{product.description}</p>


                 
                       

                        <div className="product-action-row">
                          <div className="price-display-box">
                            <div className="price-values-row">
                              <span className="menu-card-original-price">
                                ₹{originalPrice}
                              </span>
                              <span className="product-price">
                                ₹{currentPrice}
                              </span>
                            </div>
                            <span className="unit-subtext">
                              Basic Price ({sizeLabel})
                            </span>
                          </div>

                          {qty === 0 ? (
                            <button
                              type="button"
                              className="add-btn"
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
                            <div className="qty-control">
                              <button
                                type="button"
                                aria-label={`Decrease ${product.name} quantity`}
                                onClick={() => updateQuantity(cartItemId, -1)}
                              >
                                <Minus size={14} />
                              </button>
                              <span>{qty}</span>
                              <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
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
                })}
            </div>
          </div>
        </div>
      </section>

      <section id="story" className="story-section">
        <div className="section-container story-flex">
          <div className="story-image">
            <img
              src="/images/kitchen_craft.png"
              alt="Family spice preparation"
            />
          </div>

          <div className="story-content">
            <span className="simple-badge">
              <span>About Aira Pickles</span>
            </span>

            <h2>From Our Kitchen to Your Dining Table</h2>

            <p>
              Aira Pickles is a small family-run business born out of a
              love for authentic, home-style pickles. We started making pickles
              for our family and neighbors using traditional recipes handed down
              by our elders.
            </p>

            <p>
              We don't mass-produce in factories. Every single jar is made with
              hand-ground spices, sun-dried ingredients, and patience—giving you
              that warm, comforting flavor of home.
            </p>

            <div className="story-highlights">
              <div className="highlight-item">
                <strong>Handcrafted</strong>
                <span>Small batch care</span>
              </div>

              <div className="highlight-item">
                <strong>Natural</strong>
                <span>No preservatives</span>
              </div>

              <div className="highlight-item">
                <strong>Fresh</strong>
                <span>Pure sesame & mustard oil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Auto-Scrolling Marquee Section */}
      {reviews.length > 0 && (
        <section className="dashboard-reviews-section">
          <div className="section-container">
            <div className="reviews-section-header">
              <div className="simple-badge">
                <Star size={14} fill="#d97706" color="#d97706" />
                <span>Verified Customer Feedback</span>
              </div>
              <h2>Loved by Artisanal Spice Enthusiasts</h2>
              <p>Read real stories and verified reviews from families across India who enjoy Aira Pickles.</p>
            </div>

            <div className="reviews-marquee-wrapper">
              <div className="reviews-marquee-track">
                {[...reviews, ...reviews].map((rev, index) => (
                  <div key={`${rev._id || index}-${index}`} className="review-card-item">
                    <div className="review-card-top">
                      <div className="review-user-info">
                        <div className="avatar-circle">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <h4 className="reviewer-name">{rev.userName}</h4>
                          <span className="verified-badge">✓ Verified Buyer</span>
                        </div>
                      </div>
                      <div className="review-stars-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= rev.rating ? "#d97706" : "transparent"}
                            color={s <= rev.rating ? "#d97706" : "#cbd5e1"}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="review-comment-text">"{rev.comment}"</p>

                    <div className="review-card-footer">
                      <span className="reviewed-product-pill">
                        🍃 {rev.productName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="contact-banner">
        <div className="section-container banner-box">
          <h2>Have Questions or Special Bulk Orders?</h2>
          <p>
            We are a growing home kitchen and love connecting with our customers
            directly!
          </p>

          <div className="banner-actions">
            <a href="tel:+916301453780" className="phone-btn">
              <PhoneCall size={18} />
              <span>Call / Inquiry: +91 63014 53780</span>
            </a>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/916301453780"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={28} aria-hidden="true" />
      </a>
    </div>
  );
}
