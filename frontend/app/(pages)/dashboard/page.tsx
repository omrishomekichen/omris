"use client";

import React, { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import Api from "../../__apis/api";

export default function DashboardPage() {
  const [cartCountMap, setCartCountMap] = useState<Record<string, number>>({});
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await Api.menu();
        const list = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
            ? response.data
            : [];

        const formatted = list.map((item: any) => {
          const cat = item.category || "veg";
          let defaultImg = "/images/mango_pickle.png";
          let tagLabel = item.isFeatured ? "★ FEATURED" : "HOMEMADE";

          if (cat === "nonVeg") {
            defaultImg = "/images/chicken_pickle.png";
            tagLabel = item.isFeatured ? "★ FEATURED NON-VEG" : "NON-VEG";
          } else if (cat === "veg") {
            defaultImg = "/images/mango_pickle.png";
            tagLabel = item.isFeatured ? "★ FEATURED VEG" : "VEG";
          } else if (cat === "spicedPowder") {
            defaultImg = "/images/garlic_pickle.png";
            tagLabel = item.isFeatured ? "★ FEATURED POWDER" : "SPICED POWDER";
          } else if (cat === "combo" || cat === "offer") {
            defaultImg = "/images/kitchen_craft.png";
            tagLabel = item.isFeatured ? "★ SPECIAL OFFER" : "SPECIAL COMBO";
          }

          return {
            id: item._id || item.menuId || item.id,
            menuId: item.menuId,
            name: item.name,
            category: cat,
            isFeatured: Boolean(item.isFeatured),
            price: item.priceOptions?.[0]?.price
              ? `₹${item.priceOptions[0].price}`
              : item.price || "₹299",
            description: item.description,
            image: item.image || defaultImg,
            tag: tagLabel,
            spiceLevel: cat === "nonVeg" ? "🌶️🌶️ Spicy" : "🌶️ Medium-Spicy",
          };
        });

        setAllProducts(formatted);
      } catch (error) {
        console.error("Error fetching menu items:", error);
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

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartCountMap((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [productId]: next,
      };
    });
  };

  const filteredProducts = allProducts.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "featured") return item.isFeatured;
    if (activeCategory === "veg") return item.category === "veg";
    if (activeCategory === "nonVeg") return item.category === "nonVeg";
    if (activeCategory === "spicedPowder")
      return item.category === "spicedPowder";
    if (activeCategory === "combo")
      return item.category === "combo" || item.category === "offer";
    return true;
  });

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
              <span className="accent-text">Omri's Home Kitchen</span>
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
                  <span className="feature-pill-title">+91 98765 43210</span>
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
                  <span className="card-price">₹350</span>
                  <button
                    type="button"
                    className="card-quick-add"
                    onClick={() => handleUpdateQuantity("mango-avakaya", 1)}
                  >
                    + Add ({cartCountMap["mango-avakaya"] || 0})
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
              <h2>Artisanal Kitchen Delicacies</h2>
              <p>
                Explore our full collection of small-batch pickles, spiced
                powders & combo offers.
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

          {/* Category Filter Pills */}
          <div className="category-tabs-bar">
            {[
              { id: "all", label: "All Items" },
              { id: "featured", label: "⭐ Featured" },
              { id: "nonVeg", label: "🍗 Non-Veg" },
              { id: "veg", label: "🥭 Veg Pickles" },
              { id: "spicedPowder", label: "🧄 Spiced Powders" },
              { id: "combo", label: "🎁 Combos & Offers" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-pill ${
                  activeCategory === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="products-wrapper" ref={scrollRef}>
            <div className="products-grid">
              {Array.isArray(filteredProducts) &&
                filteredProducts.map((product: any) => {
                  const qty = cartCountMap[product.id] || 0;
                  return (
                    <div
                      key={product.id}
                      className="simple-product-card is-visible"
                    >
                      <div className="product-img-frame">
                        <img src={product.image} alt={product.name} />
                        <span className="product-tag">{product.tag}</span>
                      </div>

                      <div className="product-details">
                        <span className="product-spice">
                          {product.spiceLevel}
                        </span>
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-desc">{product.description}</p>

                        <div className="product-action-row">
                          <span className="product-price">{product.price}</span>
                          {qty === 0 ? (
                            <button
                              type="button"
                              className="add-btn"
                              onClick={() =>
                                handleUpdateQuantity(product.id, 1)
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
                                onClick={() =>
                                  handleUpdateQuantity(product.id, -1)
                                }
                              >
                                <Minus size={14} />
                              </button>
                              <span>{qty}</span>
                              <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
                                onClick={() =>
                                  handleUpdateQuantity(product.id, 1)
                                }
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
              <span>About Omri's Home Kitchen</span>
            </span>

            <h2>From Our Kitchen to Your Dining Table</h2>

            <p>
              Omri’s Home Kitchen is a small family-run business born out of a
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

      <section className="contact-banner">
        <div className="section-container banner-box">
          <h2>Have Questions or Special Bulk Orders?</h2>
          <p>
            We are a growing home kitchen and love connecting with our customers
            directly!
          </p>

          <div className="banner-actions">
            <a href="tel:+919876543210" className="phone-btn">
              <PhoneCall size={18} />
              <span>Call / Inquiry: +91 98765 43210</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
