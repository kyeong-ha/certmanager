import api from '@/libs/axios';
import { EducationCenterSession } from '../types/EducationCenterSession.type';
import { EducationCenter } from '../types/EducationCenter.type';
import { EducationCenterCreateForm } from '../types/EducationCenterCreateForm.type';

// 전체 교육원+기수 조회 API
export const fetchAllEducationSession = (): Promise<EducationCenterSession[]> =>
  api.get('/center/session/').then(res => res.data);

// 단일 교육원+기수 조회 API
export const fetchEducationSessionByUuid = async (uuid: string): Promise<EducationCenterSession> => {
  const response = await api.get(`/center/session/${uuid}/`);
  return response.data;
}

// 전체 교육원 조회 API
export const fetchAllCenter = async (uuid: string): Promise<EducationCenterCreateForm> => {
  const res = await api.get(`/center/`);
  return res.data;
};

// 단일 교육원 조회 API
export const fetchCenterByUuid = async (uuid: string): Promise<EducationCenterCreateForm> => {
  const res = await api.get(`/center/${uuid}/`);
  return res.data;
};

export const createEducationCenter = async (data: EducationCenterCreateForm) => {
  const res = await api.post('/center/create/', data);
  return res.data;
};