"use client";

import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCart } from "./CartContext";
import "./css/cart-drawer.css";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div className={`cart-drawer-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button type="button" className="cart-drawer-backdrop" aria-label="Close cart" onClick={onClose} tabIndex={open ? 0 : -1} />
      <aside className="cart-drawer" aria-labelledby="cart-heading" aria-modal="true" role="dialog">
        <header className="cart-drawer-header">
          <div>
            <p className="cart-drawer-eyebrow">YOUR ORDER</p>
            <h2 id="cart-heading">Your Kitchen Basket</h2>
          </div>
          <button type="button" className="cart-close-button" aria-label="Close cart" onClick={onClose}>
            <X size={22} />
          </button>
        </header>

        <div className="cart-drawer-content">
          {items.length ? (
            <div className="cart-items-list">
              {items.map((item) => (
                <article key={item.id} className="cart-item">
                  <img className="cart-item-image" src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <div className="cart-item-topline">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.size || item.description || "Handcrafted in our home kichen"}</p>
                      </div>
                      <button type="button" className="cart-remove-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="cart-item-bottomline">
                      <div className="cart-quantity-control" aria-label={`${item.name} quantity`}>
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={15} /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={15} /></button>
                      </div>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cart-empty-state">
              <div><ShoppingBag size={31} /></div>
              <h3>Your basket is waiting</h3>
              <p>Add a few kitchen favorites and they’ll appear here.</p>
              <button type="button" onClick={onClose}>Explore our menu</button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-drawer-footer">
            <div className="cart-subtotal"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <p className="cart-shipping-note"><Truck size={16} /> Shipping and taxes calculated at checkout.</p>
            <button
              type="button"
              className="cart-checkout-button"
              onClick={() => {
                onClose();
                window.location.href = "/checkout";
              }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={19} />
            </button>
            <button type="button" className="cart-continue-button" onClick={onClose}>Continue Shopping</button>
          </footer>
        )}
      </aside>
    </div>
  );
}
