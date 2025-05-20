import api from '@/libs/axios';
import { UserSummary, UserDetail, UserWriteForm } from '../types/User.type';


// 전체 회원 조회 API
export const fetchAllUser = async (): Promise<UserSummary[]> => {
  const response = await api.get('/user/');
  return response.data;
};

// 단일 회원 조회 API
export const fetchUserByUuid = async (uuid: string): Promise<UserDetail> => {
  const response = await api.get(`/user/${uuid}/`);
  return response.data;
};

// 회원 조건 검색
export const searchUsers = async (params: { filter_type?: string; search_value?: string; }): Promise<UserSummary[]> => {
  const response = await api.get('/user/search/', { params });
  return response.data;
};

// 회원 등록 API
export const createUser = async (payload: UserWriteForm): Promise<UserDetail> => {
  const response = await api.post('/user/create/', payload);
  return response.data;
};

// 회원 수정 API
export const updateUser = async (uuid: string, payload: Partial<UserWriteForm>): Promise<UserWriteForm> => {
  const response = await api.put(`/user/${uuid}/`, payload);
  return response.data;
};

// 회원 삭제 API
export const deleteUser = async (uuid: string): Promise<void> => {
  await api.delete(`/api/user/${uuid}/`);
};