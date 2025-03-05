
export enum VoucherType {
  PERCENT = "PERCENT", 
  FIXED = "FIXED",    
}

export interface Voucher {
  voucherCode: string;
  voucherType: VoucherType; 
  value: number; 
  desc: string
}
