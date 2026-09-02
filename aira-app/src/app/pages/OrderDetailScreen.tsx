import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Modal,
  Linking,
  Alert,
  Dimensions,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { Order } from "@/app/types";

import { useAuth } from "../../Context/AuthContext";
import { apiGetAdminOrders } from "../../lib/api";

import {
  ArrowLeft,
  Phone,
  MapPin,
  Send,
  CreditCard,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Building2,
  Copy,
  Check,
  MessageCircle,
  X,
  Package,
  Truck,
  CircleCheck,
  Eye,
} from "lucide-react-native";

interface OrderDetailScreenProps {
  orderId: string;
  onBack: () => void;
}

/* =========================================================
   STATUS BADGE
========================================================= */

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const normalized = status?.toLowerCase() || "";

  let backgroundColor = "#f5f5f4";
  let borderColor = "#d6d3d1";
  let textColor = "#57534e";

  if (
    normalized.includes("pending") ||
    normalized.includes("await")
  ) {
    backgroundColor = "#fffbeb";
    borderColor = "#fde68a";
    textColor = "#92400e";
  } else if (
    normalized.includes("confirm") ||
    normalized.includes("process")
  ) {
    backgroundColor = "#eff6ff";
    borderColor = "#bfdbfe";
    textColor = "#1d4ed8";
  } else if (
    normalized.includes("ship") ||
    normalized.includes("dispatch")
  ) {
    backgroundColor = "#f0fdf4";
    borderColor = "#bbf7d0";
    textColor = "#15803d";
  } else if (
    normalized.includes("deliver") ||
    normalized.includes("complete")
  ) {
    backgroundColor = "#ecfdf5";
    borderColor = "#a7f3d0";
    textColor = "#047857";
  } else if (
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    backgroundColor = "#fef2f2";
    borderColor = "#fecaca";
    textColor = "#dc2626";
  }

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor,
          borderColor,
          paddingHorizontal: size === "md" ? 11 : 8,
          paddingVertical: size === "md" ? 6 : 4,
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: textColor,
          },
        ]}
      />

      <Text
        style={[
          styles.statusBadgeText,
          {
            color: textColor,
            fontSize: size === "md" ? 10 : 9,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

/* =========================================================
   STATUS STEPPER
========================================================= */

interface StatusStepperProps {
  order: Order;
}

const StatusStepper: React.FC<StatusStepperProps> = ({
  order,
}) => {
  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentStatus =
    order.status?.toLowerCase() || "pending";

  const getCurrentIndex = () => {
    if (currentStatus.includes("deliver")) return 4;
    if (
      currentStatus.includes("ship") ||
      currentStatus.includes("dispatch")
    )
      return 3;
    if (currentStatus.includes("process")) return 2;
    if (currentStatus.includes("confirm")) return 1;

    return 0;
  };

  const currentIndex = getCurrentIndex();

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        Order Status
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepperContainer}
      >
        {statuses.map((status, index) => {
          const completed = index <= currentIndex;
          const active = index === currentIndex;

          return (
            <View
              key={status}
              style={styles.stepWrapper}
            >
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    completed
                      ? styles.stepCircleCompleted
                      : styles.stepCirclePending,
                  ]}
                >
                  {completed ? (
                    <Check
                      size={13}
                      color="#fff"
                      strokeWidth={3}
                    />
                  ) : (
                    <Text style={styles.stepNumber}>
                      {index + 1}
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.stepText,
                    completed && styles.stepTextCompleted,
                    active && styles.stepTextActive,
                  ]}
                >
                  {status}
                </Text>
              </View>

              {index < statuses.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index < currentIndex
                      ? styles.stepLineCompleted
                      : styles.stepLinePending,
                  ]}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

/* =========================================================
   FORWARD ORDER SHEET
========================================================= */

interface ForwardOrderSheetProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const ForwardOrderSheet: React.FC<
  ForwardOrderSheetProps
> = ({ order, isOpen, onClose }) => {
  const [selectedBranch, setSelectedBranch] =
    useState(order.branch || "");

  const branches = [
    "Hyderabad Central",
    "Secunderabad",
    "Kukatpally",
    "Madhapur",
    "Gachibowli",
  ];

  const handleRoute = () => {
    if (!selectedBranch) {
      Alert.alert(
        "Select Branch",
        "Please select a branch first."
      );
      return;
    }

    /*
      Connect your routing API/context here.

      Example:
      await assignOrder(order.id, selectedBranch);
    */

    Alert.alert(
      "Order Routed",
      `Order ${order.orderNumber} routed to ${selectedBranch}.`,
      [
        {
          text: "OK",
          onPress: onClose,
        },
      ]
    );
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={onClose}
        />

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>
                Route Order
              </Text>

              <Text style={styles.sheetSubtitle}>
                Order {order.orderNumber}
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={20} color="#44403c" />
            </Pressable>
          </View>

          <Text style={styles.sheetLabel}>
            Select Fulfillment Branch
          </Text>

          <ScrollView
            style={styles.branchList}
            showsVerticalScrollIndicator={false}
          >
            {branches.map((branch) => {
              const selected =
                selectedBranch === branch;

              return (
                <Pressable
                  key={branch}
                  onPress={() =>
                    setSelectedBranch(branch)
                  }
                  style={[
                    styles.branchOption,
                    selected &&
                      styles.branchOptionSelected,
                  ]}
                >
                  <Building2
                    size={18}
                    color={
                      selected ? "#650700" : "#78716c"
                    }
                  />

                  <Text
                    style={[
                      styles.branchOptionText,
                      selected &&
                        styles.branchOptionTextSelected,
                    ]}
                  >
                    {branch}
                  </Text>

                  {selected && (
                    <CheckCircle2
                      size={18}
                      color="#650700"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            style={styles.routeConfirmButton}
            onPress={handleRoute}
          >
            <Send size={17} color="#fff" />

            <Text style={styles.routeConfirmText}>
              Route Order
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

/* =========================================================
   SCREENSHOT VIEWER
========================================================= */

interface ScreenshotViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  utrNumber?: string;
  customerName: string;
}

const ScreenshotViewer: React.FC<
  ScreenshotViewerProps
> = ({
  isOpen,
  onClose,
  imageUrl,
  utrNumber,
  customerName,
}) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.imageModal}>
        <View style={styles.imageHeader}>
          <View>
            <Text style={styles.imageTitle}>
              Payment Proof
            </Text>

            <Text style={styles.imageCustomer}>
              {customerName}
            </Text>
          </View>

          <Pressable
            style={styles.imageCloseButton}
            onPress={onClose}
          >
            <X size={22} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.paymentImage}
            resizeMode="contain"
          />
        </View>

        {utrNumber && (
          <View style={styles.imageUtrBox}>
            <Text style={styles.imageUtrLabel}>
              UTR / UPI Reference
            </Text>

            <Text style={styles.imageUtr}>
              {utrNumber}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

/* =========================================================
   MAIN ORDER DETAIL SCREEN
========================================================= */

export const OrderDetailScreen: React.FC<
  OrderDetailScreenProps
> = ({ orderId, onBack }) => {
  const { profile } = useAuth();
  const isOwner = profile?.role === "owner";
  const [orders, setOrders] = useState<Order[]>([]);

  const [forwardSheetOpen, setForwardSheetOpen] =
    useState(false);

  const [
    screenshotViewerOpen,
    setScreenshotViewerOpen,
  ] = useState(false);

  const [copiedUtr, setCopiedUtr] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await apiGetAdminOrders();
      setOrders(response?.orders ?? []);
    };

    loadOrders().catch((error) => {
      console.error("Error fetching order details:", error);
    });
  }, []);

  const order = orders.find(
    (o) => o.id === orderId
  );

  /* -------------------------------------------------------
     ORDER NOT FOUND
  ------------------------------------------------------- */

  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <View style={styles.notFoundCard}>
          <Package
            size={42}
            color="#650700"
          />

          <Text style={styles.notFoundTitle}>
            Order Not Found
          </Text>

          <Text style={styles.notFoundText}>
            The requested order ID may have been
            deleted or is not accessible.
          </Text>

          <Pressable
            onPress={onBack}
            style={styles.returnButton}
          >
            <ArrowLeft size={15} color="#fff" />

            <Text style={styles.returnButtonText}>
              Return to Queue
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* -------------------------------------------------------
     COPY UTR
  ------------------------------------------------------- */

  const handleCopyUtr = async () => {
    if (!order.utrNumber) return;

    await Clipboard.setStringAsync(
      order.utrNumber
    );

    setCopiedUtr(true);

    setTimeout(() => {
      setCopiedUtr(false);
    }, 2000);
  };

  /* -------------------------------------------------------
     CALL CUSTOMER
  ------------------------------------------------------- */

  const handleCall = async () => {
    if (!order.customerPhone) return;

    try {
      await Linking.openURL(
        `tel:${order.customerPhone}`
      );
    } catch {
      Alert.alert(
        "Error",
        "Unable to open phone dialer."
      );
    }
  };

  /* -------------------------------------------------------
     WHATSAPP
  ------------------------------------------------------- */

  const handleWhatsApp = async () => {
    const phone =
      order.customerPhone?.replace(
        /[^0-9]/g,
        ""
      );

    if (!phone) {
      Alert.alert(
        "Phone Number Missing",
        "Customer phone number is not available."
      );
      return;
    }

    const url = `https://wa.me/91${phone}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Error",
        "WhatsApp is not available."
      );
    }
  };

  const handleVerifyPayment = () => {
    Alert.alert(
      "Verify Payment",
      `Approve payment of ₹${order.totalAmount.toLocaleString(
        "en-IN"
      )}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: () => {
            Alert.alert(
              "Payment verification unavailable",
              "The backend does not currently expose a payment verification endpoint."
            );
          },
        },
      ]
    );
  };

  const isUnassigned =
    !order.assignedAdminId;

  const isAssigned =
    Boolean(order.assignedAdminId);

  /* -------------------------------------------------------
     MAIN UI
  ------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={onBack}
            >
              <ArrowLeft
                size={17}
                color="#650700"
              />

              <Text style={styles.backText}>
                Back to Orders
              </Text>
            </Pressable>

            <StatusBadge
              status={order.status}
              size="md"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <View style={styles.orderTitleRow}>
                <Text style={styles.orderTitle}>
                  Order {order.orderNumber}
                </Text>

                <Text style={styles.orderId}>
                  ID: {order.id}
                </Text>
              </View>

              <View style={styles.dateRow}>
                <Clock
                  size={12}
                  color="#a8a29e"
                />

                <Text style={styles.dateText}>
                  Placed on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </View>
            </View>

            {isOwner && (
              <Pressable
                onPress={() =>
                  setForwardSheetOpen(true)
                }
                style={[
                  styles.routeButton,
                  isUnassigned
                    ? styles.routeButtonUnassigned
                    : styles.routeButtonAssigned,
                ]}
              >
                <Send
                  size={14}
                  color={
                    isUnassigned
                      ? "#fff"
                      : "#2C4A7C"
                  }
                />

                <Text
                  style={[
                    styles.routeButtonText,
                    isUnassigned
                      ? styles.routeButtonTextWhite
                      : styles.routeButtonTextBlue,
                  ]}
                >
                  {isAssigned
                    ? "Re-Route"
                    : "Route"}
                </Text>
              </Pressable>
            )}
          </View>

          {/* ASSIGNMENT */}

          <View style={styles.assignmentBox}>
            <View style={styles.assignmentRow}>
              <Building2
                size={16}
                color="#b45309"
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.assignmentText}>
                  <Text style={styles.bold}>
                    Fulfillment Branch:{" "}
                  </Text>

                  {order.branch ? (
                    <Text style={styles.branchText}>
                      {order.branch}
                    </Text>
                  ) : (
                    <Text style={styles.unassignedText}>
                      ⚠️ Unassigned
                    </Text>
                  )}
                </Text>
              </View>
            </View>

            {order.assignedAdminName && (
              <Text style={styles.staffText}>
                <Text style={styles.bold}>
                  Assigned Staff:{" "}
                </Text>
                {order.assignedAdminName}
              </Text>
            )}
          </View>
        </View>

        {/* =================================================
            STATUS
        ================================================= */}

        <StatusStepper order={order} />

        {/* =================================================
            PAYMENT VERIFICATION
        ================================================= */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <CreditCard
                size={17}
                color="#650700"
              />

              <Text style={styles.sectionTitle}>
                UPI Payment Verification
              </Text>
            </View>

            {order.paymentVerified ? (
              <View style={styles.verifiedBadge}>
                <CheckCircle2
                  size={12}
                  color="#047857"
                />

                <Text style={styles.verifiedText}>
                  Verified
                </Text>
              </View>
            ) : (
              <View style={styles.awaitingBadge}>
                <Text style={styles.awaitingText}>
                  Awaiting
                </Text>
              </View>
            )}
          </View>

          {/* UTR */}

          <View style={styles.infoBox}>
            <Text style={styles.label}>
              CUSTOMER UTR / UPI REF
            </Text>

            <View style={styles.utrRow}>
              <Text style={styles.utrText}>
                {order.utrNumber ||
                  "No UTR provided"}
              </Text>

              {order.utrNumber && (
                <Pressable
                  onPress={handleCopyUtr}
                  style={styles.copyButton}
                >
                  {copiedUtr ? (
                    <Check
                      size={15}
                      color="#059669"
                    />
                  ) : (
                    <Copy
                      size={15}
                      color="#57534e"
                    />
                  )}
                </Pressable>
              )}
            </View>
          </View>

          {/* SCREENSHOT */}

          <View
            style={[
              styles.infoBox,
              { marginTop: 10 },
            ]}
          >
            <Text style={styles.label}>
              PAYMENT SCREENSHOT
            </Text>

            <View style={styles.screenshotRow}>
              <Text style={styles.proofText}>
                {order.paymentScreenshotUrl
                  ? "Proof attached"
                  : "No screenshot uploaded"}
              </Text>

              {order.paymentScreenshotUrl && (
                <Pressable
                  onPress={() =>
                    setScreenshotViewerOpen(
                      true
                    )
                  }
                  style={styles.viewProofButton}
                >
                  <Eye
                    size={13}
                    color="#292524"
                  />

                  <Text
                    style={styles.viewProofText}
                  >
                    View
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* VERIFY BUTTON */}

          {!order.paymentVerified && (
            <Pressable
              style={styles.verifyButton}
              onPress={handleVerifyPayment}
            >
              <CheckCircle2
                size={16}
                color="#fff"
              />

              <Text style={styles.verifyText}>
                Approve Payment ₹
                {order.totalAmount.toLocaleString(
                  "en-IN"
                )}
              </Text>
            </Pressable>
          )}
        </View>

        {/* =================================================
            ORDER ITEMS
        ================================================= */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Order Items ({order.items.length})
          </Text>

          <View style={styles.itemsContainer}>
            {order.items.map((item: Order["items"][number], index: number) => (
              <View
                key={index}
                style={styles.itemRow}
              >
                <View style={styles.itemLeft}>
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    style={styles.itemImage}
                  />

                  <View
                    style={styles.itemDetails}
                  >
                    <Text
                      style={styles.itemName}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={styles.itemVariant}
                    >
                      Weight:{" "}
                      <Text
                        style={
                          styles.itemVariantBold
                        }
                      >
                        {item.variant}
                      </Text>
                    </Text>

                    <Text
                      style={styles.itemPrice}
                    >
                      ₹{item.unitPrice} ×{" "}
                      {item.quantity} qty
                    </Text>
                  </View>
                </View>

                <Text
                  style={styles.itemSubtotal}
                >
                  ₹{item.subtotal}
                </Text>
              </View>
            ))}
          </View>

          {/* TOTAL */}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              TOTAL ORDER AMOUNT
            </Text>

            <Text style={styles.totalAmount}>
              ₹
              {order.totalAmount.toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
        </View>

        {/* =================================================
            CUSTOMER + ADDRESS
        ================================================= */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Customer & Shipping Info
          </Text>

          {/* CUSTOMER */}

          <View style={styles.customerBox}>
            <Text style={styles.label}>
              CUSTOMER
            </Text>

            <Text style={styles.customerName}>
              {order.customerName}
            </Text>

            <View style={styles.contactRow}>
              <Pressable
                style={styles.callButton}
                onPress={handleCall}
              >
                <Phone
                  size={12}
                  color="#650700"
                />

                <Text style={styles.callText}>
                  Call
                </Text>
              </Pressable>

              <Pressable
                style={styles.whatsappButton}
                onPress={handleWhatsApp}
              >
                <MessageCircle
                  size={12}
                  color="#059669"
                />

                <Text
                  style={styles.whatsappText}
                >
                  WhatsApp
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ADDRESS */}

          <View
            style={[
              styles.customerBox,
              { marginTop: 10 },
            ]}
          >
            <Text style={styles.label}>
              DELIVERY ADDRESS
            </Text>

            <View style={styles.addressRow}>
              <MapPin
                size={14}
                color="#650700"
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.addressText}>
                  {order.shippingAddress.line1}
                </Text>

                {order.shippingAddress.line2 && (
                  <Text
                    style={styles.addressText}
                  >
                    {order.shippingAddress.line2}
                  </Text>
                )}

                <Text style={styles.addressText}>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} -{" "}
                  <Text style={styles.pincode}>
                    {
                      order.shippingAddress
                        .pincode
                    }
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ===================================================
          FORWARD SHEET
      =================================================== */}

      {forwardSheetOpen && (
        <ForwardOrderSheet
          order={order}
          isOpen={forwardSheetOpen}
          onClose={() =>
            setForwardSheetOpen(false)
          }
        />
      )}

      {/* ===================================================
          SCREENSHOT VIEWER
      =================================================== */}

      {screenshotViewerOpen &&
        order.paymentScreenshotUrl && (
          <ScreenshotViewer
            isOpen={screenshotViewerOpen}
            onClose={() =>
              setScreenshotViewerOpen(false)
            }
            imageUrl={
              order.paymentScreenshotUrl
            }
            utrNumber={order.utrNumber}
            customerName={order.customerName}
          />
        )}
    </View>
  );
};

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f3",
  },

  content: {
    padding: 14,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    padding: 16,
    marginBottom: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
  },

  backText: {
    color: "#650700",
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#f5f5f4",
    marginVertical: 12,
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  orderInfo: {
    flex: 1,
  },

  orderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
  },

  orderTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1c1917",
  },

  orderId: {
    backgroundColor: "#f5f5f4",
    color: "#57534e",
    fontSize: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    fontFamily: "monospace",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },

  dateText: {
    color: "#78716c",
    fontSize: 10,
  },

  routeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 15,
  },

  routeButtonUnassigned: {
    backgroundColor: "#2C4A7C",
  },

  routeButtonAssigned: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  routeButtonText: {
    fontSize: 10,
    fontWeight: "800",
  },

  routeButtonTextWhite: {
    color: "#fff",
  },

  routeButtonTextBlue: {
    color: "#2C4A7C",
  },

  assignmentBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fcf8f4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },

  assignmentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  assignmentText: {
    color: "#44403c",
    fontSize: 11,
    lineHeight: 17,
  },

  bold: {
    fontWeight: "800",
  },

  branchText: {
    color: "#2C4A7C",
    fontWeight: "800",
  },

  unassignedText: {
    color: "#dc2626",
    fontWeight: "800",
  },

  staffText: {
    color: "#57534e",
    fontSize: 10,
    marginTop: 8,
  },

  /* STATUS */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusBadgeText: {
    fontWeight: "800",
  },

  stepperContainer: {
    alignItems: "center",
    paddingVertical: 5,
    paddingRight: 10,
  },

  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepItem: {
    alignItems: "center",
    minWidth: 65,
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  stepCircleCompleted: {
    backgroundColor: "#650700",
  },

  stepCirclePending: {
    backgroundColor: "#f5f5f4",
    borderWidth: 1,
    borderColor: "#d6d3d1",
  },

  stepNumber: {
    color: "#78716c",
    fontSize: 10,
    fontWeight: "800",
  },

  stepText: {
    color: "#a8a29e",
    fontSize: 9,
    marginTop: 5,
    fontWeight: "600",
  },

  stepTextCompleted: {
    color: "#650700",
  },

  stepTextActive: {
    fontWeight: "900",
  },

  stepLine: {
    width: 28,
    height: 2,
    marginHorizontal: 2,
    marginBottom: 18,
  },

  stepLineCompleted: {
    backgroundColor: "#650700",
  },

  stepLinePending: {
    backgroundColor: "#e7e5e4",
  },

  /* GENERAL */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },

  sectionTitle: {
    color: "#1c1917",
    fontSize: 14,
    fontWeight: "800",
  },

  /* PAYMENT */

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  verifiedText: {
    color: "#047857",
    fontSize: 9,
    fontWeight: "800",
  },

  awaitingBadge: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  awaitingText: {
    color: "#92400e",
    fontSize: 9,
    fontWeight: "800",
  },

  infoBox: {
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 16,
    padding: 12,
  },

  label: {
    color: "#a8a29e",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  utrRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  utrText: {
    flex: 1,
    color: "#1c1917",
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "monospace",
  },

  copyButton: {
    backgroundColor: "#f5f5f4",
    padding: 7,
    borderRadius: 9,
  },

  screenshotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  proofText: {
    flex: 1,
    color: "#44403c",
    fontSize: 11,
    fontWeight: "600",
  },

  viewProofButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#e7e5e4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
  },

  viewProofText: {
    color: "#292524",
    fontSize: 10,
    fontWeight: "800",
  },

  verifyButton: {
    marginTop: 12,
    minHeight: 46,
    backgroundColor: "#059669",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
  },

  verifyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },

  /* ITEMS */

  itemsContainer: {
    marginTop: 8,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
  },

  itemImage: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#f5f5f4",
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    color: "#1c1917",
    fontSize: 12,
    fontWeight: "800",
  },

  itemVariant: {
    color: "#78716c",
    fontSize: 10,
    marginTop: 3,
  },

  itemVariantBold: {
    color: "#44403c",
    fontWeight: "800",
  },

  itemPrice: {
    color: "#a8a29e",
    fontSize: 9,
    marginTop: 3,
  },

  itemSubtotal: {
    color: "#650700",
    fontSize: 12,
    fontWeight: "800",
  },

  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: "#78716c",
    fontSize: 9,
    fontWeight: "800",
  },

  totalAmount: {
    color: "#650700",
    fontSize: 20,
    fontWeight: "900",
  },

  /* CUSTOMER */

  customerBox: {
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },

  customerName: {
    color: "#1c1917",
    fontSize: 15,
    fontWeight: "800",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
  },

  callText: {
    color: "#292524",
    fontSize: 10,
    fontWeight: "800",
  },

  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
  },

  whatsappText: {
    color: "#047857",
    fontSize: 10,
    fontWeight: "800",
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },

  addressText: {
    color: "#44403c",
    fontSize: 11,
    lineHeight: 18,
  },

  pincode: {
    fontFamily: "monospace",
    fontWeight: "800",
  },

  /* NOT FOUND */

  notFoundContainer: {
    flex: 1,
    backgroundColor: "#f8f6f3",
    justifyContent: "center",
    padding: 20,
  },

  notFoundCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    padding: 30,
    alignItems: "center",
  },

  notFoundTitle: {
    color: "#1c1917",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 14,
  },

  notFoundText: {
    color: "#78716c",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 7,
    marginBottom: 18,
  },

  returnButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#650700",
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 16,
  },

  returnButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 30,
    maxHeight: "75%",
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#d6d3d1",
    alignSelf: "center",
    marginBottom: 18,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sheetTitle: {
    color: "#1c1917",
    fontSize: 20,
    fontWeight: "900",
  },

  sheetSubtitle: {
    color: "#78716c",
    fontSize: 11,
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f4",
    alignItems: "center",
    justifyContent: "center",
  },

  sheetLabel: {
    color: "#44403c",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 9,
  },

  branchList: {
    marginBottom: 15,
  },

  branchOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    marginBottom: 8,
  },

  branchOptionSelected: {
    backgroundColor: "#fff7f5",
    borderColor: "#650700",
  },

  branchOptionText: {
    flex: 1,
    color: "#57534e",
    fontSize: 12,
    fontWeight: "700",
  },

  branchOptionTextSelected: {
    color: "#650700",
    fontWeight: "900",
  },

  routeConfirmButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "#650700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  routeConfirmText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  /* SCREENSHOT MODAL */

  imageModal: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 55,
    paddingHorizontal: 15,
    paddingBottom: 25,
  },

  imageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  imageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  imageCustomer: {
    color: "#a8a29e",
    fontSize: 10,
    marginTop: 3,
  },

  imageCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  paymentImage: {
    width: "100%",
    height: "85%",
  },

  imageUtrBox: {
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 12,
  },

  imageUtrLabel: {
    color: "#a8a29e",
    fontSize: 9,
    fontWeight: "700",
  },

  imageUtr: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "800",
    marginTop: 4,
  },
});