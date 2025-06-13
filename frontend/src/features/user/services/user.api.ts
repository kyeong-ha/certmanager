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
  const data = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // 배열일 경우 각각 append
    if (Array.isArray(value)) {
      value.forEach((v) => data.append(`${key}`, v));
    } else {
      data.append(key, value as string | Blob);
    }
  });

  try {
    const response = await api.post('/user/create/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!response.data || !response.data.uuid) {
      throw new Error('사용자 응답이 유효하지 않습니다.');
    }
    return response.data;
  } catch (error: any) {
    console.error('❌ 사용자 생성 실패:', error);
    throw new Error(error?.response?.data?.detail || '사용자 생성 중 오류 발생');
  }
};

// 회원 수정 API
export const updateUser = async (uuid: string, payload: Partial<UserWriteForm>): Promise<UserWriteForm> => {
  const response = await api.put(`/user/${uuid}/`, payload);
  return response.data;
};

// 회원 삭제 API
export const deleteUser = async (uuids: string[] | string): Promise<void> => {
  const ids = Array.isArray(uuids) ? uuids : [uuids];
  // DELETE 요청을 순차적으로 처리
  await Promise.all(ids.map((uuid) => api.delete(`/user/${uuid}/delete/`)));
};

// 전화번호로 회원 조회 API
export async function fetchUserByPhone(phone: string) {
  const res = await api.get<UserDetail[]>(`/user/phone/`, {
    params: { phone_number: phone },
  });
  // 배열로 반환되면 첫 번째 요소를 쓰고, 없으면 null 반환
  return res.data.length > 0 ? res.data[0] : null;
}