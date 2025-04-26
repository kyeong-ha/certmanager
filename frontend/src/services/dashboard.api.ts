import api from '@/libs/axios';
import { Certificate } from '@/types/Certificate.type';

export interface MonthlyStat {
  month: string;
  count: number;
}

export interface CenterStat {
  edu_name: string;
  count: number;
}

export interface CertificateStats {
  total: number;
  monthly: MonthlyStat[];
  by_center: CenterStat[];
}

export const getCertificateStats = async (): Promise<CertificateStats> => {
  const res = await api.get('/dashboard/stats/');
  return res.data;
};

export const getRecentCertificates = async (): Promise<Certificate[]> => {
  const res = await api.get('/dashboard/recent/');
  return res.data;
};
