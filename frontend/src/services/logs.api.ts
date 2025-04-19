import api from '@/lib/axios';

export const createReissueLog = (data: {
  issue_number: string;
  reissue_date: string;
  delivery_type: string;
  reissue_cost?: number | null;
}) => api.post('/reissue/', data);