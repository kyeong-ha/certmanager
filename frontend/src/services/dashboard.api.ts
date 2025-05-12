import api from '@/libs/axios';
import { Certificate } from '@/features/certificate/types/Certificate.type';

export interface MonthlyStat {
  month: string;
  count: number;
}

export interface CenterStat {
  center_name: string;
  count: number;
}

export interface CenterSessionStat {
  center_name: string;
  center_session: number;
  count: number;
}

export interface CourseStat {
  course_name: string;
  count: number;
}

export interface CertificateStats {
  total: number;
  monthly: MonthlyStat[];
  center: CenterStat[];
  center_session: CenterSessionStat[];
  course: CourseStat[];
}

export const getCertificateStats = async (): Promise<CertificateStats> => {
  const res = await api.get('/dashboard/stats/');
  return res.data;
};

export const getRecentCertificates = async (): Promise<Certificate[]> => {
  const res = await api.get('/dashboard/recent/');
  return res.data;
};
