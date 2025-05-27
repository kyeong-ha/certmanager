import api from '@/libs/axios';
import { EducationCenterSummary, EducationCenterDetail, EducationCenterWriteForm } from '../types/EducationCenter.type';
import { EducationCenterSessionSummary, EducationCenterSessionDetail, EducationCenterSessionWriteForm } from '../types/EducationCenterSession.type';

// 전체 교육기관 조회 API
export const fetchAllCenter = async (): Promise<EducationCenterSummary[]> => {
  const res = await api.get('/center/');
  return res.data;
};

// 특정 교육기관 상세조회 API
export const fetchCenterByUuid = async (uuid: string): Promise<EducationCenterDetail> => {
  const res = await api.get(`/center/${uuid}/`);
  return res.data;
};

// 교육기관 생성 API
export const createEducationCenter = async ( data: EducationCenterWriteForm ): Promise<EducationCenterDetail> => {
  const res = await api.post('/center/create/', data);
  return res.data;
};

// 교육기관 수정 API
export const updateEducationCenter = async ( uuid: string, data: Partial<EducationCenterWriteForm> ): Promise<EducationCenterDetail> => {
  const res = await api.put(`/center/${uuid}/`, data);
  return res.data;
};

// 교육기관 삭제 API
export const deleteEducationCenters = async (uuids: string[] | string): Promise<void> => {
  const ids = Array.isArray(uuids) ? uuids : [uuids];
  // DELETE 요청을 순차적으로 처리
  await Promise.all(ids.map((uuid) => api.delete(`/center/${uuid}/`)));
};

// 특정 교육기관의 교육기수 조회 API
export const fetchAllEducationSession = async (): Promise<EducationCenterSessionSummary[]> => {
  const res = await api.get('/center/session/');
  return res.data;
};

// 특정 교육기관의 교육기수 정보 상세조회 API
export const fetchEducationSessionByUuid = async ( uuid: string ): Promise<EducationCenterSessionDetail> => {
  const response = await api.get(`/center/session/${uuid}/`);
  return response.data;
}

// 특정 교육기관의 교육기수 생성 API
export const createEducationSession = async ( data: EducationCenterSessionWriteForm ): Promise<EducationCenterSessionDetail> => {
  const response = await api.post('/center/session/create/', data);
  return response.data;
};

// 특정 교육기관의 교육기수 수정 API
export const updateEducationSession = async ( uuid: string, data: Partial<EducationCenterSessionWriteForm> ): Promise<EducationCenterSessionDetail> => {
  const res = await api.put(`/center/session/${uuid}/`, data);
  return res.data;
};

// 특정 교육기관의 교육기수 삭제 API
export const deleteEducationSession = async (uuid: string): Promise<void> => {
  await api.delete(`/center/session/${uuid}/`);
};