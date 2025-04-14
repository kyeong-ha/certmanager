import api from '../lib/axios';

export const fetchCertificateById = (id: string) =>
  api.get(`/cert/${id}/`).then(res => res.data);

export const fetchCertificates = (params: { filter_type: string; search_value: string }) =>
  api.get('/cert/', { params }).then(res => res.data);

export const createCertificate = (data: FormData) => {
  return api.post('/cert/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateCertificate = (id: number, data: FormData) => {
  return api.put(`/cert/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// export const getCertDetails = async (issueNumber: string): Promise<Certificate> => {
//   const response = await axios.get(`/certificate/${issueNumber}/`);
//   return response.data;
// };
