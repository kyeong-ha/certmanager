import api from '../lib/axios';
import { EducationCenter } from '../types/EducationCenter.type';

export const fetchEducationCenters = (): Promise<EducationCenter[]> =>
  api.get('/edu/').then(res => res.data);

export const createEducationCenter = (data: { name: string; session: string }) =>
  api.post('/edu/', data).then(res => res.data);