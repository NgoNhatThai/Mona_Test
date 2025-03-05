import { Card } from "antd";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { Product, Voucher } from "../../models";
import CartItem from "../CartItem";

interface CartContainerProps {
  data: Product[];
  onDelete: (productId: string) => void;
  handleUpdateProduct: (productId: string, newQuantity: number, newVoucher: Voucher | null, newPrice?: number) => void;
}

const CartContainer = ({ data, onDelete, handleUpdateProduct }: CartContainerProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-5">SẢN PHẨM ĐÃ CHỌN</h3>
      <AnimatePresence>
        {data.map((product) =>
          product ? (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }} 
              layout
            >
              <CartItem data={product} onDelete={onDelete} handleUpdateProduct={handleUpdateProduct} />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CartContainer;
