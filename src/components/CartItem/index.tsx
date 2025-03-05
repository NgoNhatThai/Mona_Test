import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { discountVouchers } from "../../mocks/vouchers";
import { Product, Voucher } from "../../models";
import { formatCurrencyVND } from "../../untils/moneyFormatUntil";
import { Button, Input } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";

interface CartItemProps {
  data: Product;
  onDelete: (productId: string) => void;
  handleUpdateProduct: (productId: string, newQuantity: number, newVoucher: Voucher | null, newPrice?: number) => void;
}

const CartItem = ({ data, onDelete, handleUpdateProduct }: CartItemProps) => {
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENT" | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSelectedVoucher, setIsSelectedVoucher] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");
  const [filteredVouchers, setFilteredVouchers] = useState(discountVouchers);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(data.price);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    handleUpdateProduct(data.id, newQuantity, isSelectedVoucher ? getSelectedVoucher() : null);
  };

  const handleVoucherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVoucherInput(value);
    setFilteredVouchers(
      discountVouchers.filter((voucher) => voucher.voucherCode.toLowerCase().includes(value.toLowerCase()))
    );
    setShowDropdown(true);
  };

  const getSelectedVoucher = (): Voucher | null => {
    return discountVouchers.find((voucher) => voucher.voucherCode === voucherInput) || null;
  };

  const handleDelete = () => {
    setTimeout(() => {
      onDelete(data.id); 
    }, 300); 
  };

  const handleSelectVoucher = (voucherCode: string) => {
    const selectedVoucher = discountVouchers.find((voucher) => voucher.voucherCode === voucherCode);
    if (selectedVoucher) {
      setVoucherInput(voucherCode);
      setDiscount(selectedVoucher.value);
      setDiscountType(selectedVoucher.voucherType);
      setShowDropdown(false);
      setIsSelectedVoucher(true);
      handleUpdateProduct(data.id, quantity, selectedVoucher);
    }
  };

  const deleteVoucher = () => {
    setVoucherInput("");
    setDiscount(0);
    setDiscountType(null);
    setIsSelectedVoucher(false);
    handleUpdateProduct(data.id, quantity, null);
  };

  const handleUpdatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value) || 0;
    setPrice(newPrice);
    handleUpdateProduct(data.id, quantity, isSelectedVoucher ? getSelectedVoucher() : null, newPrice);
  };

  const totalPrice = price * quantity;
  let finalPrice =
    discountType === "FIXED"
      ? Math.max(0, totalPrice - discount * quantity)
      : discountType === "PERCENT"
      ? Math.max(0, totalPrice - (totalPrice * discount) / 100)
      : totalPrice;

  return (
    <motion.div
      className="flex flex-wrap items-center justify-between border-b py-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
      layout
    >
      <div className="flex items-center space-x-4 relative w-2/5">
        <img src={data.image} alt="product-img" className="h-10 w-16 object-contain rounded-md" />

        <div className="flex-1 flex justify-between items-start">
          <p className="font-medium text-sm text-left">{data.name}</p>

          <div className="w-28 flex-shrink-0 ml-2 justify-center">
            <Input value={price} onChange={handleUpdatePrice} className="w-full" addonAfter="đ" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>

      <div className="relative w-1/4" ref={dropdownRef}>
        {isSelectedVoucher ? (
          <div className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-md">
            <span className="flex items-center">
              <CheckCircleOutlined className="mr-2 text-green-500" />
              {voucherInput}
            </span>
            <Button type="text" danger onClick={deleteVoucher}>
              Xóa
            </Button>
          </div>
        ) : (
          <Input
            placeholder="Nhập mã giảm giá"
            value={voucherInput}
            onChange={handleVoucherInputChange}
            onFocus={() => setShowDropdown(true)}
          />
        )}

        {showDropdown && filteredVouchers.length > 0 && (
          <div className="absolute left-0 w-full bg-white border shadow-md mt-1 max-h-40 z-10">
            {filteredVouchers.slice(0, 4).map((voucher) => (
              <div
                key={voucher.voucherCode}
                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                onClick={() => handleSelectVoucher(voucher.voucherCode)}
              >
                <span>{voucher.voucherCode}</span>
                <span>{voucher.voucherType === "FIXED" ? formatCurrencyVND(voucher.value) : voucher.value + "%"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-right">
        {isSelectedVoucher ? (
          <>
            <p className="text-gray-500 line-through">{formatCurrencyVND(totalPrice)}</p>
            <p className="text-red-600 font-semibold">{formatCurrencyVND(finalPrice)}</p>
          </>
        ) : (
          <p className="font-semibold">{formatCurrencyVND(totalPrice)}</p>
        )}
      </div>

      <button
        onClick={() => {
          handleDelete();
          onDelete(data.id);
        }}
        type="button"
        className="ml-2 p-2 text-red-600 hover:text-red-800"
      >
        <DeleteOutlined className="text-xl" />
      </button>
    </motion.div>
  );
};

export default CartItem;
