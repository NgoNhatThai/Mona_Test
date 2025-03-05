import { Voucher, VoucherType } from "../models";

export const discountVouchers: Voucher[] = [
    {
      voucherCode: "DISCOUNT50K",
      voucherType: VoucherType.FIXED,
      value: 50000,
      desc: "Giảm ngay 50,000 VND trên giá sản phẩm",
    },
    {
      voucherCode: "SALE10",
      voucherType: VoucherType.PERCENT,
      value: 10,
      desc: "Giảm 10% trên giá sản phẩm",
    },
    {
      voucherCode: "DISCOUNT100K",
      voucherType: VoucherType.FIXED,
      value: 100000,
      desc: "Giảm ngay 100,000 VND trên giá sản phẩm",
    },
    {
      voucherCode: "SALE20",
      voucherType: VoucherType.PERCENT,
      value: 20,
      desc: "Giảm 20% trên giá sản phẩm",
    },
    {
      voucherCode: "DISCOUNT30K",
      voucherType: VoucherType.FIXED,
      value: 30000,
      desc: "Giảm ngay 30,000 VND trên giá sản phẩm",
    },
    {
      voucherCode: "DISCOUNT5K",
      voucherType: VoucherType.FIXED,
      value: 5000,
      desc: "Giảm ngay 5.000 VND trên giá sản phẩm",
    },
  ];
  