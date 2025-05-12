import api from '../../../libs/axios';
import { Certificate } from '@/features/certificate/types/Certificate.type';

// 전체 자격증 조회 API
export const fetchAllCertificate = async (): Promise<Certificate[]> => {
  const response = await api.get('/cert/');
  return response.data;
};

// 단일 자격증 상세조회 API
export const fetchCertificateByUuid = async (uuid: string): Promise<Certificate[]> => {
  const response = await api.get(`/cert/${uuid}/`).then(res => res.data);
  return response.data;
}

// 자격증 조건검색 API
export const searchCertificates = async (params: { filter_type?: string; search_value?: string; edu_name?: string; session?: string; }): Promise<Certificate[]> => {
  const response = await api.get('/cert/search/', {
    params,
  });
  return response.data;
};

// 자격증 생성 API
export const createCertificates = (uuids: string[]) => {
  api.post('/cert/create/', { uuids }).then(res => res.data)
}

// 자격증 수정 API
export const updateCertificates = async (uuid: string, data: Partial<Certificate>): Promise<Certificate> => {
  const response = await api.patch<Certificate>(`/cert/${uuid}/`, data);
  return response.data;
};
