"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../css/checkout.css";
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Sparkles,
  QrCode,
  Upload,
  Copy,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { useCart } from "../../components/CartContext";
import Api from "../../__apis/api";
import toast from "react-hot-toast";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<number>(1);


  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    state: "Telangana",
    landmark: "",
    notes: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("upi");
  const [upiId, setUpiId] = useState("");
  const [upiScreenshot, setUpiScreenshot] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [upiScreenshotName, setUpiScreenshotName] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setFormData((prev) => ({
          ...prev,
          fullName: u.name || prev.fullName,
          email: u.email || prev.email,
        }));
      }
    } catch (e) {

    }
  }, []);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setUpiScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpiScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("6301453780@ybl");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const shippingCost =
    subtotal >= 499 || shippingMethod === "standard"
      ? subtotal >= 499
        ? 0
        : 49
      : 99;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "OMRI10") {
      setDiscountPercent(10);
      setCouponApplied(true);
      toast.success("Coupon applied: 10% off!");
    } else {
      toast.error("Invalid coupon code. Try 'OMRI10' for 10% off!");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.pincode
    ) {
      toast.error("Please fill in all required shipping fields.");
      setStep(1);
      return;
    }

    if (paymentMethod === "upi" && !upiScreenshot && !utrNumber.trim()) {
      toast.error(
        "Please upload your payment screenshot or enter the UTR/Reference number to complete your UPI payment.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedShippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      const formattedItems = items.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      }));

      const res = await Api.placeOrder(
        formData.email,
        formattedItems,
        formattedShippingAddress,
        paymentMethod === "cod" ? "Cash on Delivery" : "UPI Payment (QR)",
        utrNumber.trim(),
        grandTotal,
        screenshotFile,
      );


      clearCart();
      setIsSubmitting(false);
      router.push("/orders");
    } catch {
      setIsSubmitting(false);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!items.length && !isSubmitting) {
    return (
      <div className="checkout-empty-container">
        <div className="checkout-empty-card">
          <ShoppingBag size={48} className="empty-bag-icon" />
          <h2>Your Basket is Empty</h2>
          <p>
            Add some handcrafted home-made pickles to your cart to proceed with
            checkout.
          </p>
          <Link href="/menu" className="return-menu-btn">
            <ArrowLeft size={16} />
            <span>Explore Artisanal Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-root">
      <div className="checkout-container">

        <div className="checkout-stepper-header">
          <Link href="/" className="back-home-link">
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </Link>

          <div className="checkout-steps-indicator">
            <div className={`step-node ${step >= 1 ? "active" : ""}`}>
              <span className="step-num">1</span>
              <span className="step-name">Delivery Address</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${step >= 2 ? "active" : ""}`}>
              <span className="step-num">2</span>
              <span className="step-name">Shipping Method</span>
            </div>
            <div className="step-line" />
            <div className={`step-node ${step >= 3 ? "active" : ""}`}>
              <span className="step-num">3</span>
              <span className="step-name">Payment</span>
            </div>
          </div>
        </div>

        <div className="checkout-main-grid">

          <div className="checkout-form-column">

            {step === 1 && (
              <div className="checkout-step-panel">
                <div className="panel-title-row">
                  <MapPin size={22} className="panel-icon" />
                  <h2>Shipping & Contact Information</h2>
                </div>

                <div className="form-fields-grid">
                  <div className="field-group full">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field-group half">
                    <label>Phone Number (for OTP & Delivery) *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 63014 53780"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field-group half">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="field-group full">
                    <label>Flat / Door No. & Street Address *</label>
                    <textarea
                      name="address"
                      rows={2}
                      placeholder="e.g. H.No 4-12/A, Golden Valley Road, Jubilee Hills"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field-group third">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="500033"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field-group third">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Hyderabad"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field-group third">
                    <label>State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    >
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="step-actions-row">
                  <button
                    type="button"
                    className="continue-step-btn"
                    onClick={() => {
                      if (
                        !formData.fullName ||
                        !formData.phone ||
                        !formData.address ||
                        !formData.pincode
                      ) {
                        toast.error(
                          "Please fill in required fields: Name, Phone, Address, and Pincode.",
                        );
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    <span>Continue to Shipping Method</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}


            {step === 2 && (
              <div className="checkout-step-panel">
                <div className="panel-title-row">
                  <Truck size={22} className="panel-icon" />
                  <h2>Select Shipping Speed</h2>
                </div>

                <div className="shipping-options-list">
                  <label
                    className={`shipping-option-card ${shippingMethod === "standard" ? "selected" : ""}`}
                    onClick={() => setShippingMethod("standard")}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                    />
                    <div className="option-details">
                      <span className="option-title">
                        Standard Fresh Home Delivery
                      </span>
                      <span className="option-sub">
                        Delivered in 1-2 business days in glass-safe packaging
                      </span>
                    </div>
                    <span className="option-price">
                      {subtotal >= 499 ? "FREE" : "₹49"}
                    </span>
                  </label>

                  <label
                    className={`shipping-option-card ${shippingMethod === "express" ? "selected" : ""}`}
                    onClick={() => setShippingMethod("express")}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                    />
                    <div className="option-details">
                      <span className="option-title">Express Air Shipping</span>
                      <span className="option-sub">
                        Guaranteed Next-Day Delivery across India
                      </span>
                    </div>
                    <span className="option-price">₹99</span>
                  </label>
                </div>

                <div className="step-actions-row">
                  <button
                    type="button"
                    className="prev-step-btn"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    className="continue-step-btn"
                    onClick={() => setStep(3)}
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}


            {step === 3 && (
              <div className="checkout-step-panel">
                <div className="panel-title-row">
                  <CreditCard size={22} className="panel-icon" />
                  <h2>Select Payment Option</h2>
                </div>

                <div className="payment-options-list">

                  <label
                    className={`payment-option-card ${paymentMethod === "upi" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                    />
                    <div className="option-details">
                      <span className="option-title">
                        UPI Payment (QR Code & Upload Screenshot)
                      </span>
                      <span className="option-sub">
                        Scan QR Code via GPay, PhonePe, Paytm or BHIM & upload
                        payment screenshot
                      </span>
                    </div>
                    <span className="payment-badge">INSTANT & SECURE</span>
                  </label>


                  {paymentMethod === "upi" && (
                    <div className="upi-qr-panel">
                      <div className="upi-qr-header">
                        <QrCode size={20} className="upi-qr-icon" />
                        <div>
                          <h4>Scan QR Code to Pay</h4>
                          <p>
                            Pay <strong>{formatCurrency(grandTotal)}</strong> to
                            Omri's Home Kichen
                          </p>
                        </div>
                      </div>

                      <div className="upi-qr-body">
                        <div className="qr-image-wrapper">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                              `upi://pay?pa=6301453780@ybl&pn=Omris%20Home%20Kitchen&am=${grandTotal}&cu=INR`,
                            )}`}
                            alt="UPI Payment QR Code"
                            className="qr-code-img"
                          />
                        </div>

                        <div className="qr-details-side">
                          <div className="upi-id-pill">
                            <span className="label">UPI ID:</span>
                            <span className="value">6301453780@ybl</span>
                            <button
                              type="button"
                              className="copy-upi-btn"
                              onClick={handleCopyUpi}
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? (
                                <Check size={14} className="copied" />
                              ) : (
                                <Copy size={14} />
                              )}
                              <span>{copiedUpi ? "Copied" : "Copy"}</span>
                            </button>
                          </div>

                          <div className="upi-apps-row">
                            <span className="apps-tag">Accepts:</span>
                            <span className="app-badge">GPay</span>
                            <span className="app-badge">PhonePe</span>
                            <span className="app-badge">Paytm</span>
                            <span className="app-badge">BHIM</span>
                          </div>


                          <div className="screenshot-upload-box">
                            <label className="upload-label">
                              Upload Payment Screenshot *
                            </label>
                            <input
                              type="file"
                              id="upi-screenshot-input"
                              accept="image/*"
                              onChange={handleScreenshotChange}
                              style={{ display: "none" }}
                            />

                            {!upiScreenshot ? (
                              <label
                                htmlFor="upi-screenshot-input"
                                className="file-drop-zone"
                              >
                                <Upload size={22} className="upload-icon" />
                                <span className="drop-title">
                                  Click to upload payment screenshot
                                </span>
                                <span className="drop-sub">
                                  PNG, JPG, JPEG up to 10MB
                                </span>
                              </label>
                            ) : (
                              <div className="screenshot-preview-card">
                                <img
                                  src={upiScreenshot}
                                  alt="Payment Screenshot Preview"
                                  className="preview-thumb"
                                />
                                <div className="preview-info">
                                  <span className="file-name">
                                    {upiScreenshotName || "screenshot.jpg"}
                                  </span>
                                  <span className="upload-status">
                                    ✓ Screenshot attached
                                  </span>
                                </div>
                                <label
                                  htmlFor="upi-screenshot-input"
                                  className="change-file-btn"
                                >
                                  Change
                                </label>
                              </div>
                            )}

                            <div className="utr-field-wrapper">
                              <label htmlFor="utr-input">
                                12-Digit UTR / Ref Number (Optional):
                              </label>
                              <input
                                id="utr-input"
                                type="text"
                                placeholder="e.g. 408512930412"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  <label
                    className={`payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div className="option-details">
                      <span className="option-title">
                        Cash on Delivery (COD)
                      </span>
                      <span className="option-sub">
                        Pay cash when fresh pickle jar reaches your doorstep
                      </span>
                    </div>
                  </label>
                </div>

                <div className="step-actions-row">
                  <button
                    type="button"
                    className="prev-step-btn"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    className="place-order-final-btn"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                  >
                    <Lock size={16} />
                    <span>
                      {isSubmitting
                        ? "Placing Order..."
                        : `Complete Order • ${formatCurrency(grandTotal)}`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>


          <aside className="checkout-summary-column">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-items-list">
                {items.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="summary-item-thumb"
                    />
                    <div className="summary-item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>


              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <div className="coupon-input-row">
                  <Tag size={16} className="tag-icon" />
                  <input
                    type="text"
                    placeholder="Coupon Code (Try OMRI10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="apply-coupon-btn">
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <span className="coupon-success">
                    ✓ 10% Artisanal discount applied!
                  </span>
                )}
              </form>


              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {couponApplied && (
                  <div className="breakdown-row discount">
                    <span>Discount (10%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="breakdown-row">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}
                  </span>
                </div>

                <div className="breakdown-divider" />

                <div className="breakdown-row total">
                  <span>Total Amount</span>
                  <strong>{formatCurrency(grandTotal)}</strong>
                </div>
              </div>

              <div className="trust-foot-note">
                <ShieldCheck size={18} />
                <span>
                  100% Secure SSL Checkout • Fresh Small-Batch Guarantee
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
