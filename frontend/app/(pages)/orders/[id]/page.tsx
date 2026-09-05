"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  Truck,
  CheckCircle2,
  Receipt,
  Utensils,
  ShieldCheck,
  MapPin,
  CreditCard,
  HelpCircle,
  AlertTriangle,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";

import Api from "../../../__apis/api";
import "../../css/orderDetails.css";

type OrderStatus =
  | "pending"
  | "payment_verification"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "rejected";

interface OrderItem {
  _id?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id?: string;
  userId?: string;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  orderItems?: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  utrNumber?: string;
  totalPrice?: number;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const orderIdParam = Array.isArray(rawId) ? rawId[0] : rawId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderReviews, setOrderReviews] = useState<Record<string, { rating: number; comment: string }>>({});
  const [activeReviewItem, setActiveReviewItem] = useState<OrderItem | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!orderIdParam) return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await Api.getOrderById(orderIdParam);

        if (!res?.success || !res?.order) {
          setError(res?.message || "Order not found or unavailable.");
          setOrder(null);
          return;
        }

        setOrder(res.order);

        const revRes = await Api.getOrderReviews(res.order.orderId || res.order._id || orderIdParam);
        if (revRes?.success && Array.isArray(revRes.reviews)) {
          const map: Record<string, { rating: number; comment: string }> = {};
          revRes.reviews.forEach((r: any) => {
            map[r.productName] = { rating: r.rating, comment: r.comment };
          });
          setOrderReviews(map);
        }
      } catch (err) {
        setError("Unable to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderIdParam]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const QUICK_TAGS = [
    "🌶️ Super Spicy",
    "👵 Grandma's Recipe",
    "🌿 100% Fresh",
    "🏺 Perfect Jar",
    "🔥 Authentic Andhra Flavor",
    "⭐ Must-Try Delicacy",
  ];

  const handleToggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    let newTags: string[];
    if (isSelected) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);

    const baseComment = reviewComment.split("\n\nTags: ")[0];
    if (newTags.length > 0) {
      setReviewComment(`${baseComment.trim()}\n\nTags: ${newTags.join(", ")}`);
    } else {
      setReviewComment(baseComment.trim());
    }
  };

  const handleOpenReview = (item: OrderItem) => {
    const existing = orderReviews[item.name];
    setActiveReviewItem(item);
    setReviewRating(existing ? existing.rating : 5);
    setReviewComment(existing ? existing.comment : "");
    setSelectedTags([]);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewItem || !order) return;

    if (!reviewComment.trim()) {
      toast.error("Please write a short comment for your review.");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await Api.createReview({
        orderId: order.orderId || order._id || orderIdParam || "",
        productName: activeReviewItem.name,
        productId: activeReviewItem._id || activeReviewItem.name.toLowerCase().replace(/\s+/g, "-"),
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res?.success) {
        toast.success("🎉 +50 Spice Points Earned! Badge Unlocked: Gourmet Reviewer 🏅", {
          duration: 4500,
          style: { background: "#78350f", color: "#fef3c7", fontWeight: "bold" },
        });
        setOrderReviews((prev) => ({
          ...prev,
          [activeReviewItem.name]: { rating: reviewRating, comment: reviewComment },
        }));
        setActiveReviewItem(null);
      } else {
        toast.error(res?.message || "Failed to submit review.");
      }
    } catch {
      toast.error("An error occurred while submitting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price?: number): string => {
    return Number(price ?? 0).toLocaleString("en-IN");
  };

  const formatStatus = (status?: OrderStatus): string => {
    if (!status) return "PENDING";
    return status.replace(/_/g, " ").toUpperCase();
  };

  const getStepStatus = (status?: OrderStatus): number => {
    switch (status) {
      case "pending":
        return 1;
      case "payment_verification":
        return 1;
      case "confirmed":
        return 2;
      case "processing":
        return 3;
      case "shipped":
        return 4;
      case "delivered":
        return 5;
      case "cancelled":
      case "rejected":
        return 0;
      default:
        return 1;
    }
  };

  const currentStep = getStepStatus(order?.status);
  const progressPercent =
    currentStep > 0 ? ((currentStep - 1) / 4) * 100 : 0;

  const isCancelled =
    order?.status === "cancelled" || order?.status === "rejected";

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="order-detail-root">
        <main className="order-detail-container">
          <div className="order-tracker-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p style={{ color: "#59413c", fontSize: "1.1rem" }}>Loading order details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-root">
        <main className="order-detail-container">
          <div className="order-detail-top-nav">
            <Link href="/orders" className="back-to-orders-btn">
              <ArrowLeft size={16} />
              <span>Back to Orders</span>
            </Link>
          </div>

          <div className="order-tracker-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#991b1b",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              Order Not Found
            </h2>
            <p style={{ color: "#59413c", marginBottom: "1.5rem" }}>
              {error || "We couldn't locate the requested order details."}
            </p>
            <Link href="/orders" className="action-outline-btn">
              Return to Order History
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const orderNumber = order.orderId || order._id || "N/A";
  const items = order.orderItems || [];
  const itemsSubtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="order-detail-root">
      <main className="order-detail-container">
        {/* Navigation & Action Bar */}
        <div className="order-detail-top-nav">
          <Link href="/orders" className="back-to-orders-btn">
            <ArrowLeft size={16} />
            <span>Back to All Orders</span>
          </Link>

          <div className="top-action-group">
            <button
              type="button"
              className="action-outline-btn"
              onClick={handlePrint}
              title="Print Order Invoice"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>

            <Link href="/menu" className="action-outline-btn">
              <RotateCcw size={16} />
              <span>Reorder Menu</span>
            </Link>
          </div>
        </div>

        {/* Order Header Summary Banner */}
        <div className="order-header-card">
          <div className="order-header-main">
            <div className="order-title-row">
              <h1 className="order-detail-h1">Order #{orderNumber}</h1>
              <span
                className={`order-status-badge status-${
                  order.status || "pending"
                }`}
              >
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="order-header-meta">
              <span>Placed on {formatDate(order.createdAt)}</span>
              <span className="meta-divider">•</span>
              <span>{items.length} {items.length === 1 ? "Item" : "Items"}</span>
              <span className="meta-divider">•</span>
              <strong style={{ color: "#650700" }}>₹{formatPrice(order.totalPrice)}</strong>
            </div>
          </div>

          {!isCancelled && (
            <div className="estimated-delivery-badge">
              <div className="est-icon-wrapper">
                <Truck size={20} />
              </div>
              <div className="est-text-group">
                <span className="est-label">Estimated Delivery</span>
                <span className="est-value">
                  {order.status === "delivered"
                    ? "Delivered Successfully"
                    : order.status === "shipped"
                    ? "Out for Delivery Today"
                    : "Within 2 - 4 Business Days"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status Timeline or Cancellation Banner */}
        {isCancelled ? (
          <div className="cancelled-alert-banner">
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <h3>Order {order.status === "rejected" ? "Rejected" : "Cancelled"}</h3>
              <p>
                This order was {order.status === "rejected" ? "rejected" : "cancelled"}. If you paid via UPI or Card, your refund will be processed back to your original payment method. Please contact support if you need assistance.
              </p>
            </div>
          </div>
        ) : (
          <div className="order-tracker-card">
            <div className="tracker-card-title">
              <Truck size={20} style={{ color: "#650700" }} />
              <span>Order Tracking Status</span>
            </div>

            <div className="detail-stepper-wrapper">
              <div className="detail-stepper-track-bg">
                <div
                  className="detail-stepper-track-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="detail-stepper-steps">
                {/* Step 1 */}
                <div className={`detail-step ${currentStep >= 1 ? (currentStep === 1 ? "current" : "completed") : ""}`}>
                  <div className="detail-step-icon">
                    <Receipt size={18} />
                  </div>
                  <span className="detail-step-title">Order Placed</span>
                  <span className="detail-step-desc">Received</span>
                </div>

                {/* Step 2 */}
                <div className={`detail-step ${currentStep >= 2 ? (currentStep === 2 ? "current" : "completed") : ""}`}>
                  <div className="detail-step-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="detail-step-title">Payment Verified</span>
                  <span className="detail-step-desc">Confirmed</span>
                </div>

                {/* Step 3 */}
                <div className={`detail-step ${currentStep >= 3 ? (currentStep === 3 ? "current" : "completed") : ""}`}>
                  <div className="detail-step-icon">
                    <Utensils size={18} />
                  </div>
                  <span className="detail-step-title">Preparing Fresh</span>
                  <span className="detail-step-desc">Handcrafted</span>
                </div>

                {/* Step 4 */}
                <div className={`detail-step ${currentStep >= 4 ? (currentStep === 4 ? "current" : "completed") : ""}`}>
                  <div className="detail-step-icon">
                    <Truck size={18} />
                  </div>
                  <span className="detail-step-title">Out for Delivery</span>
                  <span className="detail-step-desc">In Transit</span>
                </div>

                {/* Step 5 */}
                <div className={`detail-step ${currentStep >= 5 ? (currentStep === 5 ? "current" : "completed") : ""}`}>
                  <div className="detail-step-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="detail-step-title">Delivered</span>
                  <span className="detail-step-desc">Enjoy your meal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed Order Review Call-To-Action Banner */}
        {order.status === "delivered" && (
          <div className="completed-order-review-banner">
            <div className="banner-content">
              <Star size={24} fill="#d97706" color="#d97706" style={{ flexShrink: 0 }} />
              <div>
                <h3>Order Delivered! How was your experience?</h3>
                <p>We'd love to hear your feedback! Click "Write Review" on any of the items below to leave your rating and comments.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content 2-Column Grid */}
        <div className="order-detail-grid">
          {/* Left Column: Ordered Items List */}
          <div className="order-items-card">
            <div className="card-section-title">
              <span>Ordered Items</span>
              <span className="items-count-tag">{items.length} {items.length === 1 ? "Item" : "Items"}</span>
            </div>

            <div className="items-list-container">
              {items.map((item, idx) => {
                const itemKey = `${item._id || idx}-${item.name}`;
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                const existingReview = orderReviews[item.name];

                return (
                  <div key={itemKey} className="order-item-row">
                    <div className="item-left-block">
                      <div className="item-image-wrapper">
                        <img
                          src={item.image || "/images/mango_pickle.png"}
                          alt={item.name}
                          className="item-img"
                        />
                      </div>

                      <div className="item-details-group">
                        <h4 className="item-name">{item.name}</h4>
                        <span className="item-unit-price">
                          ₹{formatPrice(item.price)} each
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
                          <span className="item-qty-badge">
                            Quantity: <strong>{item.quantity}</strong>
                          </span>
                          {order.status !== "cancelled" && order.status !== "rejected" && (
                            existingReview ? (
                              <button
                                type="button"
                                className="review-badge-btn reviewed"
                                onClick={() => handleOpenReview(item)}
                                title="Edit your review"
                              >
                                <Star size={12} fill="#d97706" color="#d97706" />
                                <span>{existingReview.rating}/5 Reviewed</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="review-badge-btn action"
                                onClick={() => handleOpenReview(item)}
                              >
                                <Star size={12} />
                                <span>Write Review</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="item-right-price">
                      ₹{formatPrice(itemTotal)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Address, Payment & Total Summary */}
          <div className="order-sidebar-column">
            {/* Delivery Address Card */}
            <div className="info-sidebar-card">
              <div className="card-section-title">
                <span>Shipping Address</span>
              </div>

              <div className="address-info-block">
                <div className="info-icon-circle">
                  <MapPin size={20} />
                </div>
                <div className="address-text-wrapper">
                  <span className="address-recipient-name">
                    {order.customerName || "Customer"}
                  </span>
                  <p className="address-full-text">
                    {order.shippingAddress || "No address provided."}
                  </p>
                  {order.customerPhone && order.customerPhone !== "N/A" && (
                    <p className="address-full-text">Phone: {order.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="info-sidebar-card">
              <div className="card-section-title">
                <span>Payment Information</span>
              </div>

              <div className="payment-info-block">
                <div className="payment-method-row">
                  <span style={{ fontSize: "0.88rem", color: "#59413c" }}>Payment Method:</span>
                  <span className="method-pill">
                    <CreditCard size={14} />
                    {order.paymentMethod || "COD / Online"}
                  </span>
                </div>

                {order.utrNumber && order.utrNumber !== "N/A" && (
                  <div className="utr-row">
                    <span className="utr-label">UTR / Transaction Ref</span>
                    <span className="utr-code">{order.utrNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Price Breakdown Card */}
            <div className="financial-summary-card">
              <div className="card-section-title">
                <span>Payment Summary</span>
              </div>

              <div className="summary-rows-group">
                <div className="summary-line">
                  <span>Items Subtotal</span>
                  <span>₹{formatPrice(itemsSubtotal || order.totalPrice)}</span>
                </div>

                <div className="summary-line">
                  <span>Shipping & Delivery</span>
                  <span className="free-tag">FREE</span>
                </div>
              </div>

              <div className="summary-total-line">
                <span>Total Amount Paid</span>
                <span className="summary-total-amount">₹{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {/* Help & Support Contact Card */}
            <div className="support-banner-card">
              <div className="support-icon-circle">
                <HelpCircle size={24} />
              </div>
              <div className="support-text-group">
                <h4 className="support-title">Need help with your order?</h4>
                <p className="support-sub">
                  Contact our support team anytime at{" "}
                  <a href="mailto:airapickles@gmail.com" className="support-contact-link">
                    airapickles@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Product Review Modal */}
      {activeReviewItem && (
        <div className="review-modal-backdrop" onClick={() => setActiveReviewItem(null)}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h3>Review {activeReviewItem.name}</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setActiveReviewItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="review-modal-form">
              <div className="star-rating-picker-group">
                <label className="picker-label">Your Rating</label>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= reviewRating ? "active" : ""}`}
                      onClick={() => setReviewRating(star)}
                    >
                      <Star
                        size={28}
                        fill={star <= reviewRating ? "#d97706" : "transparent"}
                        color={star <= reviewRating ? "#d97706" : "#cbd5e1"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-comment-group">
                <label htmlFor="reviewCommentInput" className="picker-label">Your Review & Comments</label>
                <textarea
                  id="reviewCommentInput"
                  rows={4}
                  className="review-textarea"
                  placeholder="Tell us what you loved about this artisanal batch (taste, aroma, freshness, packaging)..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>

              <div className="review-modal-actions">
                <button
                  type="button"
                  className="action-cancel-btn"
                  onClick={() => setActiveReviewItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="action-submit-btn"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
