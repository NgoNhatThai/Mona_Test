import { Voucher } from "./voucher";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  voucher: Voucher | null;
}

export interface Cart {
  items: CartItem[];
}
