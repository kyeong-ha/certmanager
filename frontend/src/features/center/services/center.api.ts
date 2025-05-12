import api from '@/libs/axios';
import { EducationCenter } from '../types/EducationCenter.type';

export const fetchEducationCenters = (): Promise<EducationCenter[]> =>
  api.get('/center/').then(res => res.data);

export const createEducationCenter = (data: { center_name: string; center_session: string }) =>
  api.post('/center/', data).then(res => res.data);