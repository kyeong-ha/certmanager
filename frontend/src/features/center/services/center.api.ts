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
  for (const uuid of ids) {
    try {
      // 해당 교육기관의 모든 교육기수 가져오기
      const sessions: EducationCenterSessionSummary[] = await fetchAllEducationSession();
      const relatedSessions = sessions.filter(session => session.education_center?.uuid === uuid);

      // 관련된 교육기수 먼저 삭제
      await Promise.all(
        relatedSessions.map(session => deleteEducationSession(session.uuid))
      );

      // 이후 교육기관 삭제
      await api.delete(`/center/${uuid}/delete`);
    } catch (err) {
      console.error(`교육기관(${uuid}) 삭제 중 오류 발생:`, err);
      throw err;
    }
  }
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
  await api.delete(`/center/session/${uuid}/delete`);
};