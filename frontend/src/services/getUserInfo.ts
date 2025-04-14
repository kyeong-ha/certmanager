import axios from 'axios';
import { Certificate } from '../types/Certificate.type';

export const getUserInfo = async (
  user_name: string,
  birth_date: string,
  phone_number: string
): Promise<Certificate[]> => {
  const response = await axios.get('/api/user/', {
    params: { user_name, birth_date, phone_number },
  });
  
  return response.data;
};