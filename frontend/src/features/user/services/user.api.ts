import api from '@/libs/axios';

export const fetchUserByUuid = (uuid: string) =>
  api.get(`/user/${uuid}/`).then(res => res.data);