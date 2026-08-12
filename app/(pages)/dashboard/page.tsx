'use client';

import React from 'react';
import "../css/dashboard.css"

const products = [
  {
    name: "Classic Mango Pickle",
    description:
      "Traditional recipe with a perfect balance of spice and tang.",
    price: "$12.00",
    badge: "Best Seller",
    badgeStyle: "bg-secondary text-on-secondary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3LzLIUy2pS4i75tWKRGT-I6flSxYDrKAGtt68B_QcSgp6zAobh6WcKRVw3Dj1csnUTaI3C3GPgj2xR_G5JcysKe8pJEJ5z5CSIc_dwXZ45Bn2vRkxKICizjemiU_GOlanj7gQGwNd_42p17rhZBkw5guhcozJC2emxBlEqAPr_j8Z9GK6ILYk_Rwqtp2tuz1ZjTFi-TcWhuaksyLxwazSWufA1dDnULr2uicG4l0eY8zoCHap-Jo8",
  },
  {
    name: "Spicy Chicken Pickle",
    description:
      "Premium cut meat slow-cooked in aromatic heritage spices.",
    price: "$18.00",
    badge: "Hot",
    badgeStyle: "bg-primary text-on-primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4HMuDrTR6qSVIsufp-OBWoG3nojz-y5XNQZfmLIo676cAX3tX4SXi54KrPiS8uG6B5bZ_oVDplM13sWdMkum8X9cFqqemb7phJJ8c4a628W0LLWde9_0jcND3EPrZqkvV4apEHPnEUYkm9JRPuZviJ7MHuY_vXIYFKrR-PKu4a9-Os32FM9oNP0adGTz9RSRCVJW3PzDKYr32sZLkovQLpOLaTBYyk7vK8fGLTb8ViUweqUYkl0h2",
  },
  {
    name: "Roasted Garlic Pickle",
    description:
      "Mellow, rich roasted garlic cloves steeped in herb-infused oil.",
    price: "$14.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeDHuPl9On58n6u4ugAWAG7KT_GkIqedxxixoTkl42BCtY95Cxw0e230OuMnJZJXogcWIHIFVXCcSW3sBzujg0DIxlQE8_b_WYbFwf5G18Aw_Ib31g7wDEGAPaVUXn3zPZ6pGGS8pcx24zIFyiSfl6l87nOFnMdkBw4Cp7WlfVOZiOabshvT6i00pnxmnKcwTjejYsV2jZQehudsR19qcdUvm5b_GMfgCWEvbxHi_FuiSInna9uA_R",
  },
];

export default function DashboardPage() {
  return (
    <div className="home-page">

    

      <main>

       
        <section className="hero-section">

          <div className="hero-container">

            <div className="hero-content">

              <span className="premium-label">
                Premium Quality
              </span>

              <h1>
                Artisanal Home-made Pickles
              </h1>

              <p>
                Crafted with tradition, served with love. Experience the rich,
                authentic taste of carefully preserved vegetables and meats,
                perfected by our head chef.
              </p>

              <div className="hero-button-container">
                <button className="shop-button">
                  Shop Now
                </button>
              </div>

            </div>

            <div className="hero-image-container">
              <img
                alt="Appetizing image of artisanal pickles"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzWwMqfozhGzJG15BTJN5CzqwhxLyLJWmwic7zGKsh4hVMGB4IC81Im0amZRKh3W1aSbWxEGhfVTRZTn8MVTtnqKTwzXTpHISPCkJEPgkvQqeBvLlhrgHFndCZXhenfvDQi0Cya9htK8PxgQSxDb10nGAtkRnihL8Wu5sOKEHtkLQPOqLQ-37je_x0__FVrac1oJqbaqc3hJ59VF1ba9AH_PHXQWijzTGzyRWyiwHTdhricy7xBiikdYjcCfHBvGoVTg"
              />
            </div>

          </div>

          {/* Decorative Elements */}
          <div className="hero-decoration-right" />
          <div className="hero-decoration-left" />

        </section>

        {/* Best Sellers */}
        <section id="menu" className="best-sellers">

          <div className="section-container">

            <div className="section-heading">
              <h2>
                Best Sellers
              </h2>

              <p>
                Discover our most loved creations, crafted in small batches
                for the perfect taste.
              </p>
            </div>

            <div className="products-grid">

              {products.map((product) => (
                <div
                  key={product.name}
                  className="product-card"
                >

                  <div className="product-image-container">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    {product.badge && (
                      <div className={`product-badge ${product.badgeStyle}`}>
                        {product.badge}
                      </div>
                    )}

                  </div>

                  <div className="product-content">

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.description}
                    </p>

                    <div className="product-bottom">

                      <span className="product-price">
                        {product.price}
                      </span>

                      <button
                        aria-label={`Add ${product.name} to cart`}
                        className="add-button"
                      >
                        <span className="material-symbols-outlined">
                          add
                        </span>
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            <div className="view-menu-container">
              <button className="view-menu-button">
                View Full Menu
              </button>
            </div>

          </div>

        </section>

        {/* Brand Story */}
        <section id="about" className="brand-story">

          <div className="section-container">

            <div className="brand-grid">

              <div className="story-image-wrapper">

                <div className="story-image">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACQ4OXwng0Ezq2aE89i3dIJvy5Rhmqdy5bYwDC2sHKzvg76UhnmWzvzWTOnlpyYQtNykkyDXpgwHNa4UXkdWeXO1KjJRpTtrpnO4y_TRd-MdtAY4HvgRd3t1vnVXY_0gmGjIORwbadX0lbqLIgfdDw8yKKwC648WwGmfwLCL_mGM7Q1mE94y07iArP5T3xmSdWLJSCrEPZnU4dxwcYtyu-7jUk8k9xaC_HTnWhuEuckbPZke1zlxVD"
                    alt="Chef preparing spices"
                  />
                </div>

                <div className="tradition-badge">
                  <p>
                    "Made with tradition."
                  </p>
                </div>

              </div>

              <div className="story-content">

                <h2>
                  The Story Behind the Spice
                </h2>

                <p>
                  Omri's Home Kitchen started with a simple belief: the best
                  flavors come from patience and heritage. Every jar we produce
                  is a testament to family recipes passed down through
                  generations, utilizing only hand-picked ingredients and
                  artisanal methods.
                </p>

                <p>
                  We don't mass-produce. We craft. From the sun-drying of raw
                  mangoes to the slow roasting of spices, we ensure that every
                  bite delivers that nostalgic, premium taste of home.
                </p>

                <div className="story-button-container">
                  <button className="story-button">
                    Read Our Full Story
                  </button>
                </div>

              </div>

            </div>

          </div>

        </section>

      </main>



    </div>
  );
}
  