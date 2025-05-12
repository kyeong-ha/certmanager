import api from '@/libs/axios';
import { EducationCenter } from '../types/EducationCenter.type';

export const fetchEducationCenters = (): Promise<EducationCenter[]> =>
  api.get('/edu/').then(res => res.data);

export const createEducationCenter = (data: { edu_name: string; session: string }) =>
  api.post('/edu/', data).then(res => res.data);