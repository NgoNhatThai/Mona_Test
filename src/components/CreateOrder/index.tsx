import { useState } from "react";
import { Form, Input, AutoComplete, Button } from "antd";
import { Order, Product, Voucher } from "../../models";
import { products } from "../../mocks/products";
import { formatCurrencyVND } from "../../untils/moneyFormatUntil";
import CartContainer from "../Cart";
import PaymentContainer from "../PaymentContainer";
import ConfirmOrder from "../ConfirmOrder";
import { toast } from "react-toastify";

export interface ProductItem extends Product {
  quantity: number;
  voucher: Voucher | null;
  total: number;
}

const CreateOrder = () => {
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProduct = (productId: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (!product) return;

    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === productId);
      if (existingProduct) {
        return prev.map((p) =>
          p.id === productId
            ? { ...p, quantity: (p.quantity || 1) + 1, total: (p.quantity + 1) * p.price }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1, voucher: null, total: product.price }];
    });

    setSearchValue("");
  };

  const handleUpdateProduct = (
    productId: string,
    newQuantity: number,
    newVoucher: Voucher | null,
    newPrice?: number
  ) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: newQuantity,
              voucher: newVoucher,
              price: newPrice !== undefined ? newPrice : p.price,
              total: (newPrice !== undefined ? newPrice : p.price) * newQuantity,
            }
          : p
      )
    );
    form.setFieldsValue({ selectedProducts });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onFinish = (values: Order) => {
    if (selectedProducts.length === 0) {
      return toast.error("Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng.");
    }

    if (!values.paymentMethod) {
      return toast.error("Vui lòng chọn phương thức thanh toán.");
    }

    form.setFieldsValue({ cart: selectedProducts });
    handleOpenModal();
  };

  const onFinishFailed = (errorInfo: any) => {
    if (errorInfo.errorFields.length > 0) {
      const firstErrorField = errorInfo.errorFields[0].name[0];
      form.scrollToField(firstErrorField, {
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4 text-red-500">TẠO ĐƠN HÀNG</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          validateTrigger="onSubmit"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại khách hàng"
          validateTrigger="onSubmit"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại khách hàng!" }]}
        >
          <Input placeholder="Nhập số điện thoại khách hàng" />
        </Form.Item>

        <Form.Item name="email" label="Email khách hàng">
          <Input placeholder="Nhập email khách hàng" />
        </Form.Item>

        <Form.Item label="Chọn sản phẩm">
          <AutoComplete
            options={products.map((product) => ({
              value: product.id,
              label: (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center w-2/3">
                    <img
                      src={product.image}
                      alt="product-img"
                      className="h-8 w-16 object-contain"
                    />
                    <span className="ml-2 text-left">{product.name}</span>
                  </div>
                  <span>{formatCurrencyVND(product.price)}</span>
                </div>
              ),
              name: product.name,
            }))}
            placeholder="Tìm kiếm sản phẩm"
            onSelect={handleSelectProduct}
            onSearch={setSearchValue}
            value={searchValue}
            filterOption={(input, option) => {
              if (option?.name) {
                return option.name.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
            maxTagCount={4}
          />
        </Form.Item>

        {selectedProducts.length > 0 && (
          <CartContainer
            data={selectedProducts}
            onDelete={handleRemoveProduct}
            handleUpdateProduct={handleUpdateProduct}
          />
        )}

        <Form.Item className="w-full">
          <PaymentContainer form={form} cart={selectedProducts} />
        </Form.Item>

        <div className="w-full flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="flex bg-amber-600 text-white p-4 text-xl"
          >
            Thanh toán
          </Button>
        </div>
      </Form>
      <ConfirmOrder
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={{ ...form.getFieldsValue(), cart: selectedProducts }}
      />
    </div>
  );
};

export default CreateOrder;