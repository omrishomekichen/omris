"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../css/orders.css";
import toast from "react-hot-toast";

import {
  Truck,
  CheckCircle2,
  Receipt,
  Utensils,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

import Api from "../../__apis/api";

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
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id?: string;
  userId?: string;
  orderId?: string;
  orderItems?: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  utrNumber?: string;
  totalPrice?: number;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

interface OrdersResponse {
  success?: boolean;
  message?: string;
  orders?: Order[];
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "completed"
  >("all");

  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState<boolean>(true);


  const [userlogin, setUserLogin] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response: OrdersResponse = await Api.orders();



        if (!response?.success) {
          toast.error(response?.message || "Please log in to view your orders.");

          setUserLogin(false);
          setActiveOrders([]);
          setPastOrders([]);

          return;
        }

        const orders = Array.isArray(response.orders)
          ? response.orders
          : [];

        const completedStatuses: OrderStatus[] = [
          "delivered",
          "cancelled",
          "rejected",
        ];

        const active = orders.filter((order) => {
          const status = String(
            order?.status || ""
          ).toLowerCase();

          return !completedStatuses.includes(
            status as OrderStatus
          );
        });

        const past = orders.filter((order) => {
          const status = String(
            order?.status || ""
          ).toLowerCase();

          return completedStatuses.includes(
            status as OrderStatus
          );
        });

        setActiveOrders(active);
        setPastOrders(past);
        setUserLogin(true);
      } catch {
        toast.error("Unable to load your orders. Please try again.");

        setUserLogin(false);
        setActiveOrders([]);
        setPastOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrdersCount =
    activeOrders.length + pastOrders.length;

  const getCurrentStep = (
    status?: OrderStatus
  ): number => {
    switch (status) {
      case "pending":
        return 1;

      case "payment_verification":
        return 1;

      case "confirmed":
        return 2;

      case "processing":
        return 2;

      case "shipped":
        return 3;

      case "delivered":
        return 4;

      case "cancelled":
      case "rejected":
        return 0;

      default:
        return 1;
    }
  };

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatPrice = (
    price?: number
  ): string => {
    return Number(
      price ?? 0
    ).toLocaleString("en-IN");
  };

  const formatStatus = (
    status?: OrderStatus
  ): string => {
    if (!status) {
      return "PENDING";
    }

    return status
      .replace(/_/g, " ")
      .toUpperCase();
  };

  return (
    <div className="orders-page-root">
      <main className="orders-container">





        <div className="orders-header-block">
          <h1 className="orders-header-title">
            Order History & Tracking
          </h1>

          <p className="orders-header-sub">
            Track your live home delivery
            status and review your past
            artisanal pickle orders.
          </p>
        </div>





        {!userlogin && !loading && (
          <div className="orders-empty-state">

            <div className="empty-icon-circle">
              <ShoppingBag size={32} />
            </div>

            <h2 className="empty-title">
              Please Login
            </h2>

            <p className="empty-sub">
              Please login to view your
              orders and track your
              deliveries.
            </p>

            <Link
              href="/login"
              className="explore-menu-btn"
            >
              <span>
                Login
              </span>

              <ArrowRight size={18} />
            </Link>

          </div>
        )}





        {userlogin && (
          <>




            {totalOrdersCount > 0 && (
              <div className="orders-tabs-bar">

                <button
                  type="button"
                  className={`orders-tab-btn ${
                    activeTab === "all"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("all")
                  }
                >
                  All Orders (
                  {totalOrdersCount}
                  )
                </button>

                <button
                  type="button"
                  className={`orders-tab-btn ${
                    activeTab === "active"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("active")
                  }
                >
                  Active Orders (
                  {activeOrders.length}
                  )
                </button>

                <button
                  type="button"
                  className={`orders-tab-btn ${
                    activeTab === "completed"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("completed")
                  }
                >
                  Past Orders (
                  {pastOrders.length}
                  )
                </button>

              </div>
            )}





            {loading ? (
              <div className="orders-empty-state">
                <p>
                  Loading your orders...
                </p>
              </div>

            ) : totalOrdersCount === 0 ? (





              <div className="orders-empty-state">

                <div className="empty-icon-circle">
                  <ShoppingBag size={32} />
                </div>

                <h2 className="empty-title">
                  No Orders Yet
                </h2>

                <p className="empty-sub">
                  You haven't placed any
                  orders with Aira Pickles
                  yet. Explore our
                  handcrafted selection of
                  small-batch pickles made
                  with traditional family
                  recipes!
                </p>

                <Link
                  href="/menu"
                  className="explore-menu-btn"
                >
                  <span>
                    Explore Artisanal Menu
                  </span>

                  <ArrowRight size={18} />
                </Link>

              </div>

            ) : (





              <>




                {(activeTab === "all" ||
                  activeTab === "active") &&
                  activeOrders.length > 0 && (

                    <section className="orders-section">

                      <h2 className="section-heading">
                        Active Orders
                      </h2>

                      <div className="orderdiv">

                        {activeOrders.map(
                          (
                            order,
                            orderIndex
                          ) => {

                            const orderKey =
                              `${
                                order.orderId ??
                                order._id ??
                                "order"
                              }-${orderIndex}`;

                            const orderNumber =
                              order.orderId ??
                              order._id ??
                              `ORDER-${orderIndex + 1}`;

                            const status =
                              order.status ??
                              "pending";

                            const currentStep =
                              getCurrentStep(
                                status
                              );

                            const progressWidth =
                              currentStep > 0
                                ? ((currentStep - 1) /
                                    3) *
                                  100
                                : 0;

                            return (
                              <div
                                key={orderKey}
                                className="active-order-card"
                              >

                                <div className="active-card-glow" />



                                <div className="active-card-header">

                                  <div>

                                    <div className="order-meta-pill-row">

                                      <span className="order-status-badge in-progress">
                                        {formatStatus(
                                          status
                                        )}
                                      </span>

                                      <span className="order-id">
                                        Order #
                                        {orderNumber}
                                      </span>

                                      {order.createdAt && (
                                        <span className="order-time-text">
                                          •{" "}
                                          {formatDate(
                                            order.createdAt
                                          )}
                                        </span>
                                      )}

                                    </div>

                                    <h3 className="estimated-delivery-title">
                                      Estimated Delivery:{" "}

                                      <span>
                                        {status ===
                                        "shipped"
                                          ? "Today"
                                          : status ===
                                            "processing"
                                          ? "Preparing"
                                          : "Processing"}
                                      </span>
                                    </h3>

                                  </div>

                                  <Link
                                    href={`/orders/${order.orderId || order._id}`}
                                    className="view-details-btn"
                                  >
                                    <span>
                                      View Details
                                    </span>

                                    <ArrowRight
                                      size={16}
                                    />
                                  </Link>

                                </div>



                                <div className="progress-tracker-wrapper">

                                  <div className="progress-track-bg">

                                    <div
                                      className="progress-track-fill"
                                      style={{
                                        width: `${progressWidth}%`,
                                      }}
                                    />

                                  </div>

                                  <div className="tracker-steps">



                                    <div
                                      className={`step-item ${
                                        currentStep >= 1
                                          ? "completed"
                                          : ""
                                      }`}
                                    >

                                      <div className="step-icon-circle">
                                        <Receipt size={16} />
                                      </div>

                                      <span className="step-label">
                                        Order Placed
                                      </span>

                                    </div>



                                    <div
                                      className={`step-item ${
                                        currentStep >= 2
                                          ? "completed"
                                          : ""
                                      }`}
                                    >

                                      <div className="step-icon-circle">
                                        <Utensils size={16} />
                                      </div>

                                      <span className="step-label">
                                        Preparing Fresh
                                      </span>

                                    </div>



                                    <div
                                      className={`step-item ${
                                        currentStep >= 3
                                          ? "completed"
                                          : ""
                                      }`}
                                    >

                                      <div className="step-icon-circle">
                                        <Truck size={16} />
                                      </div>

                                      <span className="step-label">
                                        Out for Delivery
                                      </span>

                                    </div>



                                    <div
                                      className={`step-item ${
                                        currentStep >= 4
                                          ? "completed"
                                          : ""
                                      }`}
                                    >

                                      <div className="step-icon-circle">
                                        <CheckCircle2
                                          size={16}
                                        />
                                      </div>

                                      <span className="step-label">
                                        Delivered
                                      </span>

                                    </div>

                                  </div>

                                </div>



                                <div className="active-card-footer">

                                  <div className="order-summary-text">

                                    <span>
                                      {order.orderItems
                                        ?.length ?? 0}{" "}
                                      Items
                                    </span>

                                    <span className="dot">
                                      •
                                    </span>

                                    <strong className="order-total-price">
                                      Total: ₹
                                      {formatPrice(
                                        order.totalPrice
                                      )}
                                    </strong>

                                  </div>



                                  {order.orderItems &&
                                    order.orderItems.length >
                                      0 && (

                                      <div className="item-avatars-row">

                                        {order.orderItems.map(
                                          (
                                            item,
                                            itemIndex
                                          ) => {

                                            const itemKey =
                                              `${orderKey}-item-${
                                                item._id ??
                                                itemIndex
                                              }`;

                                            return (
                                              <img
                                                key={itemKey}
                                                src={
                                                  item.image ||
                                                  "/images/mango_pickle.png"
                                                }
                                                alt={
                                                  item.name ||
                                                  "Order item"
                                                }
                                                className="item-avatar-img"
                                                title={
                                                  item.name
                                                }
                                              />
                                            );
                                          }
                                        )}

                                      </div>
                                    )}

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </section>
                  )}





                {(activeTab === "all" ||
                  activeTab === "completed") &&
                  pastOrders.length > 0 && (

                    <section className="orders-section">

                      <h2 className="section-heading">
                        Past Orders
                      </h2>

                      <div className="past-orders-list">

                        {pastOrders.map(
                          (
                            order,
                            orderIndex
                          ) => {

                            const orderKey =
                              `${
                                order.orderId ??
                                order._id ??
                                "past-order"
                              }-${orderIndex}`;

                            const orderNumber =
                              order.orderId ??
                              order._id ??
                              `ORDER-${orderIndex + 1}`;

                            const firstItem =
                              order.orderItems?.[0];

                            return (
                              <div
                                key={orderKey}
                                className="past-order-card"
                              >



                                <div className="past-card-left">

                                  <img
                                    src={
                                      firstItem?.image ||
                                      "/images/mango_pickle.png"
                                    }
                                    alt={
                                      firstItem?.name ||
                                      "Order"
                                    }
                                    className="past-order-thumb"
                                  />

                                  <div className="past-order-info">



                                    <div className="past-order-meta">

                                      <span>
                                        {formatDate(
                                          order.createdAt
                                        )}
                                      </span>

                                      <span className="meta-dot">
                                        •
                                      </span>

                                      <span>
                                        Order #
                                        {orderNumber}
                                      </span>

                                    </div>



                                    <h4 className="past-order-title">

                                      {firstItem?.name ||
                                        `Order #${orderNumber}`}

                                    </h4>



                                    <p className="past-order-items-sub">

                                      {order.orderItems
                                        ?.map(
                                          (item) =>
                                            `${item.name} × ${item.quantity}`
                                        )
                                        .join(", ")}

                                    </p>



                                    <div className="past-order-price-row">

                                      <span className="past-order-price">
                                        ₹
                                        {formatPrice(
                                          order.totalPrice
                                        )}
                                      </span>

                                      <span className="delivered-tag">

                                        <CheckCircle2
                                          size={12}
                                        />

                                        <span>
                                          {formatStatus(
                                            order.status
                                          )}
                                        </span>

                                      </span>

                                    </div>

                                  </div>

                                </div>



                                <div className="past-card-actions">

                                  <Link
                                    href={`/orders/${order.orderId || order._id}`}
                                    className="view-details-btn"
                                    style={{ textDecoration: "none" }}
                                  >
                                    <span>
                                      View Details
                                    </span>

                                    <ArrowRight
                                      size={14}
                                    />
                                  </Link>

                                  <Link
                                    href="/menu"
                                    className="reorder-btn"
                                  >

                                    <RotateCcw
                                      size={14}
                                    />

                                    <span>
                                      Reorder
                                    </span>

                                  </Link>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </section>
                  )}

              </>
            )}
          </>
        )}

      </main>
    </div>
  );
}
