import api from './axiosInstance';
import { Orders } from './types/order';

export const createOrder = async (data: Omit<Orders, 'id'>): Promise<Orders> => {
  const response = await api.post('/orders', data);
  return response.data;
};

