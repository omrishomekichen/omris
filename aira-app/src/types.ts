export interface OrderItem {
  name: string;
  image: string;
  variant?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  branch?: string;
  assignedAdminId?: string;
  assignedAdminName?: string;
  customerName: string;
  customerPhone?: string;
  createdAt: string;
  paymentMethod?: string;
  paymentVerified?: boolean;
  paymentScreenshotUrl?: string;
  utrNumber?: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

export type Category =
  | "veg"
  | "nonVeg"
  | "spicedPowder"
  | "combo"
  | "offer";

export type ShelfLifeUnit =
  | "days"
  | "weeks"
  | "months"
  | "years";

export type PriceUnit = "g" | "kg" | "ml" | "l" | "piece";

export interface PriceOption {
  quantity: number;
  unit: PriceUnit;
  price: number;
}

export interface ComboItem {
  itemName: string;
  quantity: number;
  unit: PriceUnit;
}

export interface Offer {
  enabled: boolean;
  title?: string;
  description?: string;
  price?: number;
}

export interface Storage {
  instructions?: string;
  shelfLife?: {
    value?: number;
    unit?: ShelfLifeUnit;
  };
}

export interface MenuItem {
  _id?: string;
  menuId: string;
  name: string;
  category: Category;
  description: string;
  ingredients: string[];
  storage: Storage;
  image: string | null;
  priceOptions: PriceOption[];
  comboItems: ComboItem[];
  offer: Offer;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}

export interface ProductFormModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

export interface InputLabelProps {
  text: string;
}

export interface FormSectionTitleProps {
  icon: React.ReactNode;
  title: string;
  buttonText?: string;
  onPress?: () => void;
}

export interface UnitSelectorProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export interface DashboardScreenProps {
  onNavigateTab?: (tab: string) => void;
  onSelectOrder?: (orderId: string) => void;
}

export interface DashboardReview {
  userName?: string;
  productName?: string;
  rating?: number;
  comment?: string;
}

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
  alert?: boolean;
  onPress?: () => void;
}

export interface OrderDetailScreenProps {
  orderId: string;
  onBack: () => void;
}

export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export interface StatusStepperProps {
  order: Order;
}

export interface ForwardOrderSheetProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export interface ScreenshotViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  utrNumber?: string;
  customerName: string;
}

export interface OrdersScreenProps {
  onSelectOrder?: (orderId: string) => void;
  selectedOrderId?: string | null;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt?: string;
  customerName: string;
  customerPhone: string;
  city: string;
  pincode: string;
  branch: string;
  items: number;
  itemName: string;
  totalAmount: number;
  status:
    | "pending"
    | "payment_verification"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  assigned: boolean;
}

export interface FilterTab {
  id: string;
  label: string;
  count: number;
  badge?: boolean;
}

export interface OrderCardProps {
  order: AdminOrder;
  selected: boolean;
  onPress: () => void;
}

export interface Review {
  id: string;
  customerName: string;
  menuItemName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
}

export interface ReviewCardProps {
  review: Review;
  onDelete?: (review: Review) => void;
  isDeleting?: boolean;
}

export interface NativeMobileHeaderProps {
  activeTab?: string;
  isOrderDetail?: boolean;
  onBackFromOrder?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isInline?: boolean;
}

export interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface SplashScreenProps {
  onFinish?: () => void;
  autoDismiss?: boolean;
  dismissDelayMs?: number;
}
