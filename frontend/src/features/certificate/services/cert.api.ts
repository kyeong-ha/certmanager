import api from '@/libs/axios';
import { CertificateDetail, CertificateSummary, CertificateWriteForm,  } from '@/features/certificate/types/Certificate.type';

// 전체 자격증 조회 API
export const fetchAllCertificate = async (): Promise<CertificateSummary[]> => {
  const response = await api.get('/cert/');
  return response.data;
};

// 단일 자격증 상세조회 API
export const fetchCertificateByUuid = async (uuid: string): Promise<CertificateDetail> => {
  const response = await api.get(`/cert/${uuid}/`);
  return response.data;
};

// 자격증 조건검색 API
export const searchCertificates = async (params: { filter_type?: string; search_value?: string; center_name?: string; center_session?: string; }): Promise<CertificateSummary[]> => {
  const response = await api.get('/cert/search/', { params });
  return response.data;
};

// 자격증 단건 생성 API
export const createCertificate = async (data: CertificateWriteForm): Promise<CertificateDetail> => {
  const response = await api.post('/cert/create/', data);
  return response.data;
};

// 자격증 수정 API
export const updateCertificate = async (uuid: string, data: Partial<CertificateWriteForm>): Promise<CertificateDetail> => {
  const response = await api.patch(`/cert/${uuid}/`, data);
  return response.data;
};

// 자격증 삭제 API
export const deleteCertificate = async (uuid: string): Promise<void> => {
  await api.delete(`/cert/${uuid}/`);
};


// 자격증 PDF 생성 API
export const generateCertificatesPdf = async (uuids: string[]) => {
  const response = await api.post('/cert/create/', { uuids });
  return response.data;
};
