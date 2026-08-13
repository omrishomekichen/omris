'use client';

import React, { useState } from 'react';
import '../css/dashboard.css';

import {
  Sparkles,
  Heart,
  Leaf,
  Package,
  Plus,
  Minus,
  ArrowRight,
  PhoneCall,
} from 'lucide-react';


/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [
  {
    id: 'mango-avakaya',
    name: 'Classic Avakaya Mango Pickle',
    price: '₹350',
    description:
      'Crisp green raw mangoes prepared with hand-ground spices and traditional sesame oil.',
    image: '/images/mango_pickle.png',
    tag: 'Popular',
    spiceLevel: '🌶️🌶️ Medium-Spicy',
  },
  {
    id: 'chicken-pickle',
    name: 'Spicy Country Chicken Pickle',
    price: '₹499',
    description:
      'Tender boneless chicken slow-cooked with curry leaves and authentic roasted spices.',
    image: '/images/chicken_pickle.png',
    tag: 'Specialty',
    spiceLevel: '🌶️🌶️🌶️ Spicy',
  },
  {
    id: 'garlic-pickle',
    name: 'Roasted Garlic & Herb Pickle',
    price: '₹399',
    description:
      'Mellow roasted garlic cloves steeped in herb-infused mustard oil and fenugreek.',
    image: '/images/garlic_pickle.png',
    tag: 'Mild',
    spiceLevel: '🌶️ Mild & Flavorful',
  },
];


/* =========================================================
   DASHBOARD
   ========================================================= */

export default function DashboardPage() {
  const [cartCountMap, setCartCountMap] = useState<Record<string, number>>({});


  /* =======================================================
     UPDATE CART QUANTITY
     ======================================================= */

  const handleUpdateQuantity = (
    productId: string,
    delta: number
  ) => {
    setCartCountMap((prev) => {
      const current = prev[productId] || 0;

      const next = Math.max(
        0,
        current + delta
      );

      return {
        ...prev,
        [productId]: next,
      };
    });
  };


  return (
    <div className="dashboard-root">

      {/* ===================================================
          1. HERO SECTION
          =================================================== */}

      <section className="simple-hero">

        <div className="section-container hero-grid">

          {/* -----------------------------------------------
              HERO TEXT
              ----------------------------------------------- */}

          <div className="hero-text">

            {/* Badge */}

            <div className="simple-badge">
              <Sparkles size={14} />

              <span>
                Traditional Home Kitchen
              </span>
            </div>


            {/* Heading */}

            <h1 className="hero-heading">
              Taste the Heritage of{' '}
              <br />

              <span className="accent-text">
                Omri's Home Kitchen
              </span>
            </h1>


            {/* Description */}

            <p className="hero-subtext">
              Authentic, home-made pickles slow-crafted
              in fresh, small quantities using sun-dried
              ingredients, cold-pressed sesame oil, and
              secret family recipes. 100% natural with
              zero chemical preservatives.
            </p>


            {/* =================================================
                FEATURE CARDS
                ================================================= */}

            <div className="hero-feature-row">

              {/* Family Recipe */}

              <div className="feature-pill">

                <div className="feature-pill-icon">
                  🏡
                </div>

                <div className="feature-pill-content">

                  <span className="feature-pill-title">
                    Family Recipe
                  </span>

                  <span className="feature-pill-subtitle">
                    Traditional homemade recipe
                  </span>

                </div>

              </div>


              {/* Natural */}

              <div className="feature-pill">

                <div className="feature-pill-icon">
                  🌿
                </div>

                <div className="feature-pill-content">

                  <span className="feature-pill-title">
                    100% Natural
                  </span>

                  <span className="feature-pill-subtitle">
                    Fresh & quality ingredients
                  </span>

                </div>

              </div>


              {/* Shipping */}

              <div className="feature-pill">

                <div className="feature-pill-icon">
                  🚚
                </div>

                <div className="feature-pill-content">

                  <span className="feature-pill-title">
                    Doorstep Shipping
                  </span>

                  <span className="feature-pill-subtitle">
                    Freshly delivered to your door
                  </span>

                </div>

              </div>


              {/* Phone */}

              <div className="feature-pill">

                <div className="feature-pill-icon">
                  📞
                </div>

                <div className="feature-pill-content">

                  <span className="feature-pill-title">
                    +91 98765 43210
                  </span>

                  <span className="feature-pill-subtitle">
                    Call us for orders & enquiries
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                HERO ACTIONS
                ================================================= */}

            <div className="hero-actions">

              <a
                href="#pickles"
                className="primary-btn"
              >
                <span>
                  Order Pickles Now
                </span>

                <ArrowRight size={18} />
              </a>


              <a
                href="#story"
                className="secondary-btn"
              >
                <span>
                  Our Story
                </span>
              </a>

            </div>


            {/* =================================================
                TRUST NOTE
                ================================================= */}

            <div className="simple-trust-note">

              <Heart
                size={16}
                className="heart-icon"
              />

              <span>
                Handcrafted in small quantities •
                Loved by 1,000+ homes
              </span>

            </div>

          </div>


          {/* =================================================
              HERO IMAGE CARD
              ================================================= */}

          <div className="hero-image-box">

            <div className="hero-card">

              {/* Image */}

              <div className="hero-card-img-wrapper">

                <img
                  src="/images/mango_pickle.png"
                  alt="Fresh Avakaya Mango Pickle"
                />

                <span className="hero-card-badge">
                  ⭐ Signature Recipe
                </span>

              </div>


              {/* Product information */}

              <div className="hero-card-info">

                <div>

                  <h3>
                    Classic Avakaya Mango
                  </h3>

                  <span className="card-sub">
                    Sun-Dried Mangoes & Sesame Oil
                  </span>

                </div>


                {/* Price + Add */}

                <div className="card-price-box">

                  <span className="card-price">
                    ₹350
                  </span>

                  <button
                    type="button"
                    className="card-quick-add"
                    onClick={() =>
                      handleUpdateQuantity(
                        'mango-avakaya',
                        1
                      )
                    }
                  >
                    + Add (
                    {cartCountMap['mango-avakaya'] || 0}
                    )
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          2. THREE SIMPLE PROMISES
          ===================================================== */}

      <section className="promises-section">

        <div className="section-container promises-grid">


          {/* Home Made */}

          <div className="promise-card">

            <div className="icon-circle">
              <Heart size={22} />
            </div>

            <div>

              <h3>
                100% Home-Made
              </h3>

              <p>
                Crafted in our family kitchen with
                personal care and hygienic preparation.
              </p>

            </div>

          </div>


          {/* Pure Ingredients */}

          <div className="promise-card">

            <div className="icon-circle">
              <Leaf size={22} />
            </div>

            <div>

              <h3>
                Pure Ingredients
              </h3>

              <p>
                Made with natural sea salt,
                cold-pressed oils, and zero artificial
                colors.
              </p>

            </div>

          </div>


          {/* Fresh Packing */}

          <div className="promise-card">

            <div className="icon-circle">
              <Package size={22} />
            </div>

            <div>

              <h3>
                Fresh & Safely Packed
              </h3>

              <p>
                Packed carefully in leak-proof glass
                jars to keep the authentic taste intact.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          3. SIGNATURE PICKLES
          ===================================================== */}

      <section
        id="pickles"
        className="pickles-section"
      >

        <div className="section-container">


          {/* Section Heading */}

          <div className="simple-heading">

            <h2>
              Our Home-Made Pickles
            </h2>

            <p>
              Pick your favorite jar below. Every jar
              is made fresh and delivered with care.
            </p>

          </div>


          {/* Products */}

          <div className="products-grid">

            {PRODUCTS.map((product) => {

              const qty =
                cartCountMap[product.id] || 0;


              return (

                <div
                  key={product.id}
                  className="simple-product-card"
                >


                  {/* Product Image */}

                  <div className="product-img-frame">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <span className="product-tag">
                      {product.tag}
                    </span>

                  </div>


                  {/* Product Details */}

                  <div className="product-details">

                    <span className="product-spice">
                      {product.spiceLevel}
                    </span>


                    <h3 className="product-title">
                      {product.name}
                    </h3>


                    <p className="product-desc">
                      {product.description}
                    </p>


                    {/* Product Actions */}

                    <div className="product-action-row">

                      <span className="product-price">
                        {product.price}
                      </span>


                      {qty === 0 ? (

                        <button
                          type="button"
                          className="add-btn"
                          onClick={() =>
                            handleUpdateQuantity(
                              product.id,
                              1
                            )
                          }
                        >

                          <Plus size={16} />

                          <span>
                            Add to Order
                          </span>

                        </button>

                      ) : (

                        <div className="qty-control">

                          <button
                            type="button"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                -1
                              )
                            }
                          >
                            <Minus size={14} />
                          </button>


                          <span>
                            {qty}
                          </span>


                          <button
                            type="button"
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                1
                              )
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

      </section>


      {/* =====================================================
          4. OUR STORY
          ===================================================== */}

      <section
        id="story"
        className="story-section"
      >

        <div className="section-container story-flex">


          {/* Story Image */}

          <div className="story-image">

            <img
              src="/images/kitchen_craft.png"
              alt="Family spice preparation"
            />

          </div>


          {/* Story Content */}

          <div className="story-content">


            {/* Badge */}

            <span className="simple-badge">

              <span>
                About Omri's Home Kitchen
              </span>

            </span>


            {/* Heading */}

            <h2>
              From Our Kitchen to Your
              Dining Table
            </h2>


            {/* Paragraph */}

            <p>
              Omri’s Home Kitchen is a small family-run
              business born out of a love for authentic,
              home-style pickles. We started making
              pickles for our family and neighbors using
              traditional recipes handed down by our
              elders.
            </p>


            <p>
              We don't mass-produce in factories.
              Every single jar is made with hand-ground
              spices, sun-dried ingredients, and
              patience—giving you that warm, comforting
              flavor of home.
            </p>


            {/* Highlights */}

            <div className="story-highlights">


              <div className="highlight-item">

                <strong>
                  Handcrafted
                </strong>

                <span>
                  Small batch care
                </span>

              </div>


              <div className="highlight-item">

                <strong>
                  Natural
                </strong>

                <span>
                  No preservatives
                </span>

              </div>


              <div className="highlight-item">

                <strong>
                  Fresh
                </strong>

                <span>
                  Pure sesame & mustard oil
                </span>

              </div>


            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          5. CONTACT BANNER
          ===================================================== */}

      <section className="contact-banner">

        <div className="section-container banner-box">


          <h2>
            Have Questions or Special
            Bulk Orders?
          </h2>


          <p>
            We are a growing home kitchen and love
            connecting with our customers directly!
          </p>


          <div className="banner-actions">

            <a
              href="tel:+919876543210"
              className="phone-btn"
            >

              <PhoneCall size={18} />

              <span>
                Call / Inquiry: +91 98765 43210
              </span>

            </a>

          </div>

        </div>

      </section>

    </div>
  );
}
