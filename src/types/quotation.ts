
export interface CustomerDetails {
  name: string;
  gstNumber: string;
  address: string;
  phone: string;
  email: string;
}

export interface QuotationItem {
  slNo: number;
  name: string;
  description: string;
  height: number;
  width: number;
  area: number;
  quantity: number;
  totalCost: number;
}
