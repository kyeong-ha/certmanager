import api from '@/libs/axios';
import { User } from '../types/User.type';
import { UserSearchForm } from '@/features/user/types/UserSearchForm.type';

// 전체 회원 조회 API
export const fetchAllUser = async (): Promise<UserSearchForm[]> => {
  const response = await api.get('/user/');
  return response.data;
}

// 단일 회원 조회 API
export const fetchUserByUuid = async (uuid: string): Promise<User> => {
  const response = await api.get(`/user/${uuid}/`);
  return response.data;
}

// 회원 삭제 API
export const updateUser = async (uuid: string, payload: Partial<User>): Promise<User> => {
  const response = await api.put(`/user/${uuid}/`, payload);
  return response.data;
};

// 회원 삭제 API
export const deleteUser = async (uuid: string): Promise<void> => {
  await api.delete(`/api/user/${uuid}/`);
};