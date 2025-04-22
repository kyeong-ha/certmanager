import api from '../lib/axios';

export const fetchUserByUuid = (uuid: string) =>
  api.get(`/user/${uuid}/`).then(res => res.data);