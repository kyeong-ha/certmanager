import api from '../lib/axios';
import { Certificate } from '@/types/Certificate.type';

export const fetchCertificates = (params: { filter_type: string; search_value: string }) =>
  api.get('/cert/search/', { params }).then(res => res.data);

export const fetchCertificateById = (uuid: string) =>
  api.get(`/cert/${uuid}/`).then(res => res.data);

export const createCertificate = (data: FormData) => {
  return api.post('/cert/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateCertificate = (uuid: string, data: Certificate) => {
  return api.put(`/cert/${uuid}/`, data);
};