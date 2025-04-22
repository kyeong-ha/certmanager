import api from '@/lib/axios';

export const createReissueLog = (data: {
  certificate_uuid: string;
  reissue_date: string;
  delivery_type: string;
  reissue_cost?: number | null;
}) => api.post('/logs/', data);

export const fetchReissueLogsByUuid = (certificate_uuid: string) => 
  api.get('/logs/', {
    params: { certificate_uuid : certificate_uuid},
  }).then((res) => res.data)