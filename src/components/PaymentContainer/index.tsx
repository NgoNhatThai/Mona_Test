import { Card, Form, Input, Radio } from "antd";
import { useEffect, useState } from "react";
import { ProductItem } from "../CreateOrder";
import { formatCurrencyVND } from "../../untils/moneyFormatUntil";

interface PaymentContainerProps {
  form: any;
  cart: ProductItem[];
}

const PaymentContainer = ({ form, cart }: PaymentContainerProps) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [method, setMethod] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    let newTotal = 0;
    let newDiscount = 0;

    cart.forEach((item) => {
      newTotal += item.price * item.quantity;

      if (item.voucher) {
        if (item.voucher.voucherType === "PERCENT") {
          newDiscount += (item.voucher.value / 100) * item.price * item.quantity;
        } else if (item.voucher.voucherType === "FIXED") {
          newDiscount += item.voucher.value * item.quantity;
        }
      }
    });

    const newFinalAmount = newTotal - newDiscount;

    setTotalAmount(newTotal);
    setDiscountAmount(newDiscount);
    setFinalAmount(newFinalAmount);
    form.setFieldsValue({ totalAmount: newTotal, discountAmount: newDiscount, finalAmount: newFinalAmount });
    console.log('dẫ');
    
    
  }, [cart, form, ]);

  useEffect(() => {
    setChangeAmount(Math.max(paidAmount - finalAmount, 0));
  }, [paidAmount, finalAmount]);

  const handlePaymentChange = (e: any) => {
    const method = e.target.value;
    form.setFieldsValue({ paymentMethod: method });
    setMethod(method)

    if (method === "CARD") {
      form.setFieldsValue({ paidAmount: 0 });
      setPaidAmount(0);
      setChangeAmount(0);
    }
  };

  return (
    <Card className="p-6 space-y-4 w-full border border-gray-300 shadow-sm rounded-lg bg-white">
      <Form.Item name="paymentMethod" label="Phương thức thanh toán" required>
        <Radio.Group id="paymentMethod" className="flex gap-4" onChange={handlePaymentChange} value={method}>
          <Radio value="CASH">Tiền mặt</Radio>
          <Radio value="CARD">Thẻ</Radio>
        </Radio.Group>
      </Form.Item>

      {form.getFieldValue("paymentMethod") === "CASH" && (
        <Form.Item name="paidAmount" label="Số tiền khách đưa">
          <Input
            type="number"
            placeholder="Nhập số tiền khách đưa"
            className="w-full"
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              form.setFieldsValue({ paidAmount: value });
              setPaidAmount(value);
            }}
            addonAfter='đ'
          />
        </Form.Item>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin thanh toán</h3>
        <div className="space-y-2">
          <p className="text-gray-700 text-left flex justify-between">
            Tổng tiền sản phẩm: <span className="font-bold text-red-500 ">{formatCurrencyVND(totalAmount)}</span>
          </p>
          {
            discountAmount > 0 &&
            <p className="text-gray-700 text-left flex justify-between">
            Tổng giảm giá: <span className="font-bold text-green-500"> -{formatCurrencyVND(discountAmount)} </span>
          </p>
          }
          <p className="text-gray-700 text-left flex justify-between">
            Số tiền cần thanh toán: <span className="font-bold text-orange-500">{finalAmount.toLocaleString()} ₫</span>
          </p>
          {
            method === 'CASH' && 
            <>
            <p className="text-gray-700 text-left flex justify-between">
            Tiền khách đưa: <span className="font-bold text-blue-500">{paidAmount.toLocaleString()} ₫</span>
          </p>
          <p className="text-gray-700 text-left flex justify-between">
            Tiền trả lại: <span className="text-green-500 font-semibold">{changeAmount.toLocaleString()} ₫</span>
          </p>
            </>
          }
        </div>
      </div>
    </Card>
  );
};

export default PaymentContainer;
