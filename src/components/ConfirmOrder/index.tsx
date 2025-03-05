import { formatCurrencyVND } from "../../untils/moneyFormatUntil";
import { Button, Modal } from "antd";
import { UserOutlined, DollarCircleOutlined, ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { ProductItem } from "../CreateOrder";

interface CartItemProps {
  data: ProductItem;
}

const CartItem = ({ data }: CartItemProps) => {
  const totalPrice = data.price * data.quantity;
  const discount = data?.voucher
    ? data?.voucher.voucherType === "PERCENT"
      ? (totalPrice * data.voucher.value) / 100
      : data.voucher.value * data.quantity
    : 0;

  const finalPrice = Math.max(0, totalPrice - discount);

  return (
    <div className="flex flex-col border-b py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4 w-1/2">
          <img src={data.image} alt="product-img" className="h-10 w-16 object-contain" />
          <div>
            <p className="font-medium">{data.name}</p>
            {data.voucher && (
              <p className="text-sm text-left flex items-center bg-green-100 rounded-md p-1">
                <CheckCircleOutlined className="text-green-500 mr-1" />
                <span className="text-gray-500">{data.voucher.voucherCode}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p>{data.quantity}</p>
        </div>
        <div className="flex items-center flex-col">
          {discount > 0 && (
            <p className="text-gray-500 line-through">
              {formatCurrencyVND(totalPrice)}
            </p>
          )}
          <p className="text-red-600">{formatCurrencyVND(finalPrice)}</p>
        </div>
      </div>
    </div>
  );
};

interface ConfirmOrderProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const ConfirmOrder = ({ isOpen, onClose, data }: ConfirmOrderProps) => {
  if (!data) return null;

  const totalAmount = data.cart.reduce(
    (sum: number, item: any) => sum + item.total,
    0
  );
  const totalDiscount = data.cart.reduce((sum: number, item: any) => {
    if (item.voucher) {
      return item.voucher.voucherType === "PERCENT"
        ? sum + (item.total * item.voucher.value) / 100 * item.quantity
        : sum + item.voucher.value * item.quantity;
    }
    return sum;
  }, 0);
  const finalAmount = totalAmount - totalDiscount;
  const changeAmount = data.paymentMethod === "CASH"
    ? data.paidAmount - finalAmount
    : 0;

  return (
    <Modal
      title="XÁC NHẬN ĐƠN HÀNG"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={() => alert('Đã xác nhận đơn hàng!')}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <div className="flex justify-start mb-4 mt-4 bg-amber-200 p-4 rounded-md">
        <div className="flex items-center space-x-3">
          <UserOutlined className="text-lg" />
          <div className="flex justify-start">
            <p className="text-sm font-medium">
              {data.customerName} - {data.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-b py-2">
        <div className="flex items-center justify-between mb-2">
          <ShoppingCartOutlined className="text-lg" />
          <p className="font-medium">Chi tiết đơn hàng</p>
        </div>
        {data.cart.map((item: any) => (
          <CartItem key={item.id} data={item} />
        ))}
      </div>

      <div className="mt-4 bg-slate-100 p-2 rounded-md">
        <div className="flex items-center justify-start mb-2">
          <DollarCircleOutlined className="text-lg mr-1" />
          <p className="font-medium">Thông tin thanh toán</p>
        </div>
        <div className="flex flex-col mt-4"> {/* Thay đổi từ flex justify-between thành flex flex-col */}
          <div className="text-left space-y-2">
            <p className="text-sm">
              <span>Tổng tiền:</span>
              <span className="text-red-600 font-semibold ml-1">
                {formatCurrencyVND(totalAmount)}
              </span>
            </p>
            <p className="text-sm">
              <span>Giảm giá:</span>
              <span className="text-green-500 font-semibold ml-1">
                {formatCurrencyVND(totalDiscount)}
              </span>
            </p>
            <p className="text-md">
              <span>Thành tiền:</span>
              <span className="text-orange-500 font-semibold ml-1">
                {formatCurrencyVND(finalAmount)}
              </span>
            </p>
          </div>
          <div className="flex justify-start flex-col mt-2 space-y-2"> 
            <p className="text-sm text-left flex items-center">
              <span className="mr-1">Phương thức:</span>
              <p className="text-md font-semibold">
                {data.paymentMethod === 'CASH' ? 'TIỀN MẶT' : 'THẺ'}
              </p>
            </p>
            {data.paymentMethod === "CASH" && (
              <>
                <p className="text-sm text-left flex items-center">
                  <span className="mr-1">Số tiền khách đưa:</span>
                  <p className="text-md font-semibold text-blue-500">
                    {formatCurrencyVND(data.paidAmount)}
                  </p>
                </p>
                <p className="text-sm text-left flex items-center">
                  <span className="mr-1">Tiền trả lại:</span>
                  <p className="text-md font-semibold text-green-500">
                    {formatCurrencyVND(changeAmount)}
                  </p>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmOrder;