import { Customer } from './customer';

export interface Orders {
  id: number;
  product: string;
  quantity: number;
  price: number;
  file?: string;
  customer?: Customer;
}
