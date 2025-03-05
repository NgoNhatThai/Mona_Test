import { Cart } from "./cart";

export enum PaymentMethod {
  CASH = "CASH", 
  FIXED = "FIXED",   
}

export interface Order {
  customerName: string;
  phone: string;
  email: string;
  cart: Cart;
  paymentMethod: PaymentMethod;
  paidAmount?: number;
  totalAmount: number;
  discount?: number;
  changeAmount?: number;
}
