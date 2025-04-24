import api from '../libs/axios';
import { Certificate } from '@/types/Certificate.type';

export const fetchCertificates = (params: { filter_type: string; search_value: string }) =>
  api.get('/cert/search/', { params }).then(res => res.data);

export const fetchCertificateByUuid = (uuid: string) =>
  api.get(`/cert/${uuid}/`).then(res => res.data);

export const createCertificate = (data: FormData) => {
  return api.post('/cert/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateCertificate = async (uuid: string, data: Partial<Certificate>): Promise<Certificate> => {
  const response = await api.patch<Certificate>(`/cert/${uuid}/`, data);
  return response.data;
};