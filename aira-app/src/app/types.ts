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
  paymentVerified?: boolean;
  paymentScreenshotUrl?: string;
  utrNumber?: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}
