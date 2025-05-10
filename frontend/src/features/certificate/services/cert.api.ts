import api from '../../../libs/axios';
import { Certificate } from '@/features/certificate/types/Certificate.type';

export const fetchCertificates = (params: any) => 
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

export const issueCertificates = (uuids: string[]) =>
  api.post('/cert/issue/', { uuids }).then(res => res.data);