import api from '@/libs/axios';
import { CertificateSummary } from '../types/Certificate.type';

interface CertificatePaginationParams {
  page?: number;
  pageSize?: number;
  filters?: {
    filter_type?: string;
    search_value?: string;
    center_name?: string;
    center_session?: string;
  };
}

export const fetchCertificatesWithPagination = async (
  { page = 1, pageSize = 20, filters = {} }: CertificatePaginationParams
): Promise<{
  results: CertificateSummary[];
  count: number;
}> => {
  const offset = (page - 1) * pageSize;
  const res = await api.get('/cert/search', {
    params: {
      ...filters,
      limit: pageSize.toString(),
      offset: offset.toString(),
    },
  });
  return res.data;
};
