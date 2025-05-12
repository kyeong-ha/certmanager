import api from '@/libs/axios';
import { User } from '../types/User.type';

export const fetchAllUser = async (): Promise<User[]> => {
  const response = await api.get('/user/');
  return response.data;
}

export const fetchUserByUuid = async (uuid: string): Promise<User> => {
  const response = await api.get(`/user/${uuid}/`);
  return response.data;
}

export const updateUser = async (uuid: string, payload: Partial<User>): Promise<User> => {
  const response = await api.put(`/user/${uuid}/`, payload);
  return response.data;
};