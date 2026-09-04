"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../(auth)/AuthContext";
import "../css/cart.css";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const router = useRouter();
  const auth = useAuth();
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    if (!auth?.user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (!items.length) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <div className="cart-empty-icon"><ShoppingBag size={38} /></div>
          <p className="cart-kicker">YOUR KITCHEN BASKET</p>
          <h1>Your cart is waiting</h1>
          <p>Add your favourite homemade pickles and we’ll keep them ready for checkout.</p>
          <Link href="/menu" className="cart-primary-action">
            Explore the menu <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-page-container">
        <Link href="/menu" className="cart-back-link">
          <ArrowLeft size={17} /> Continue shopping
        </Link>

        <header className="cart-page-header">
          <div>
            <p className="cart-kicker">YOUR KITCHEN BASKET</p>
            <h1>Shopping cart</h1>
          </div>
          <span>{items.reduce((count, item) => count + item.quantity, 0)} items</span>
        </header>

        <div className="cart-page-grid">
          <section className="cart-lines" aria-label="Cart items">
            {items.map((item) => (
              <article className="cart-line" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-line-image" />
                <div className="cart-line-info">
                  <div className="cart-line-top">
                    <div>
                      <h2>{item.name}</h2>
                      <p>{item.size || item.description || "Handcrafted in our home kitchen"}</p>
                    </div>
                    <button
                      type="button"
                      className="cart-delete"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="cart-line-bottom">
                    <div className="cart-stepper" aria-label={`${item.name} quantity`}>
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={15} /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={15} /></button>
                    </div>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="cart-summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className="cart-summary-total"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
            <button type="button" onClick={handleCheckout} className="cart-primary-action cart-checkout-action">
              Proceed to checkout <ArrowRight size={18} />
            </button>
            <p className="cart-shipping-info"><Truck size={17} /> Freshly packed and shipped with care.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
