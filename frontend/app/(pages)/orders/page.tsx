"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../css/orders.css";
import {
  Package,
  Truck,
  CheckCircle2,
  Receipt,
  Utensils,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Clock,
  ExternalLink,
} from "lucide-react";
import Api from "../../__apis/api";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all",
  );
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Read user orders from localStorage or API
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      const email = parsedUser.email;
      const orders: any = Api.orders(token, email);
      console.log(orders);
      if (orders) {
        const parsed = orders.data as any;
        if (Array.isArray(parsed)) {
          const active = parsed.filter((o: any) => o.status !== "Delivered");
          const completed = parsed.filter((o: any) => o.status === "Delivered");
          setActiveOrders(active);
          setPastOrders(completed);
        }
      } else {
        setActiveOrders([]);
        setPastOrders([]);
      }
    } catch (e) {
      console.error("Error reading saved orders:", e);
      setActiveOrders([]);
      setPastOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalOrdersCount = activeOrders.length + pastOrders.length;

  return (
    <div className="orders-page-root">
      <main className="orders-container">
        {/* Page Header */}
        <div className="orders-header-block">
          <h1 className="orders-header-title">Order History & Tracking</h1>
          <p className="orders-header-sub">
            Track your live home delivery status and review your past artisanal
            pickle orders.
          </p>
        </div>

        {/* Filter Tabs */}
        {totalOrdersCount > 0 && (
          <div className="orders-tabs-bar">
            <button
              type="button"
              className={`orders-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Orders ({totalOrdersCount})
            </button>
            <button
              type="button"
              className={`orders-tab-btn ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active Orders ({activeOrders.length})
            </button>
            <button
              type="button"
              className={`orders-tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Past Orders ({pastOrders.length})
            </button>
          </div>
        )}

        {loading ? (
          <div className="orders-empty-state">
            <p>Loading your orders...</p>
          </div>
        ) : totalOrdersCount === 0 ? (
          /* Empty Orders State */
          <div className="orders-empty-state">
            <div className="empty-icon-circle">
              <ShoppingBag size={32} />
            </div>
            <h2 className="empty-title">No Orders Yet</h2>
            <p className="empty-sub">
              You haven't placed any orders with Omri's Home Kitchen yet.
              Explore our handcrafted selection of small-batch pickles made with
              traditional family recipes!
            </p>
            <Link href="/menu" className="explore-menu-btn">
              <span>Explore Artisanal Menu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Active Orders Section */}
            {(activeTab === "all" || activeTab === "active") &&
              activeOrders.length > 0 && (
                <section className="orders-section">
                  <h2 className="section-heading">Active Orders</h2>

                  {activeOrders.map((order) => (
                    <div key={order.id} className="active-order-card">
                      <div className="active-card-glow" />

                      <div className="active-card-header">
                        <div>
                          <div className="order-meta-pill-row">
                            <span className="order-status-badge in-progress">
                              {order.status || "IN PROGRESS"}
                            </span>
                            <span className="order-id">Order #{order.id}</span>
                            {order.date && (
                              <span className="order-time-text">
                                • {order.date}
                              </span>
                            )}
                          </div>
                          <h3 className="estimated-delivery-title">
                            Estimated Delivery:{" "}
                            <span>{order.estimatedDelivery || "Today"}</span>
                          </h3>
                        </div>

                        <button type="button" className="view-details-btn">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      {/* Stepper Progress Tracker */}
                      <div className="progress-tracker-wrapper">
                        <div className="progress-track-bg">
                          <div
                            className="progress-track-fill"
                            style={{
                              width: `${(((order.currentStep || 2) - 1) / 3) * 100}%`,
                            }}
                          />
                        </div>

                        <div className="tracker-steps">
                          <div
                            className={`step-item ${
                              (order.currentStep || 2) >= 1 ? "completed" : ""
                            }`}
                          >
                            <div className="step-icon-circle">
                              <Receipt size={16} />
                            </div>
                            <span className="step-label">Order Placed</span>
                          </div>

                          <div
                            className={`step-item ${
                              (order.currentStep || 2) >= 2 ? "completed" : ""
                            }`}
                          >
                            <div className="step-icon-circle">
                              <Utensils size={16} />
                            </div>
                            <span className="step-label">Preparing Fresh</span>
                          </div>

                          <div
                            className={`step-item ${
                              (order.currentStep || 2) >= 3 ? "completed" : ""
                            }`}
                          >
                            <div className="step-icon-circle">
                              <Truck size={16} />
                            </div>
                            <span className="step-label">Out for Delivery</span>
                          </div>

                          <div
                            className={`step-item ${
                              (order.currentStep || 2) >= 4 ? "completed" : ""
                            }`}
                          >
                            <div className="step-icon-circle">
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="step-label">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="active-card-footer">
                        <div className="order-summary-text">
                          <span>{order.items?.length || 1} Items</span>
                          <span className="dot">•</span>
                          <strong className="order-total-price">
                            Total: ₹{order.total}
                          </strong>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="item-avatars-row">
                            {order.items.map((item: any, idx: number) => (
                              <img
                                key={idx}
                                src={item.image || "/images/mango_pickle.png"}
                                alt={item.name}
                                className="item-avatar-img"
                                title={item.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              )}

            {/* Past Orders Section */}
            {(activeTab === "all" || activeTab === "completed") &&
              pastOrders.length > 0 && (
                <section className="orders-section">
                  <h2 className="section-heading">Past Orders</h2>

                  <div className="past-orders-list">
                    {pastOrders.map((order) => (
                      <div key={order.id} className="past-order-card">
                        <div className="past-card-left">
                          <img
                            src={order.image || "/images/mango_pickle.png"}
                            alt={order.title || "Order"}
                            className="past-order-thumb"
                          />

                          <div className="past-order-info">
                            <div className="past-order-meta">
                              <span>{order.date}</span>
                              <span className="meta-dot">•</span>
                              <span>Order #{order.id}</span>
                            </div>

                            <h4 className="past-order-title">
                              {order.title || `Order #${order.id}`}
                            </h4>
                            <p className="past-order-items-sub">
                              {Array.isArray(order.items)
                                ? order.items
                                    .map((i: any) => i.name || i)
                                    .join(", ")
                                : ""}
                            </p>

                            <div className="past-order-price-row">
                              <span className="past-order-price">
                                ₹{order.total}
                              </span>
                              <span className="delivered-tag">
                                <CheckCircle2 size={12} />
                                <span>Delivered</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="past-card-actions">
                          <Link href="/menu" className="reorder-btn">
                            <RotateCcw size={14} />
                            <span>Reorder</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </>
        )}
      </main>
    </div>
  );
}
