import { User } from '@/types/User.type';
import { EducationCenter } from '@/types/EducationCenter.type';
import { ReissueLog } from '@/types/ReissueLog.type';
import { Certificate } from '@/types/Certificate.type';

export const createDefaultUser = (): User => ({
  uuid: '',
  user_name: '',
  birth_date: '',
  phone_number: '',
  user_id: null,
  postal_code: '',
  address: '',
  photo: '',
  pdf_url: '',
});

export const createDefaultEducationCenter = (): EducationCenter => ({
  uuid: '',
  edu_name: '',
  session: '',
});

export const createDefaultReissueLog = (): ReissueLog => ({
  uuid: '',
  certificate: {} as Certificate,
  reissue_date: '',
  reissue_cost: 0,
  delivery_type: '선불',
});

export const createDefaultCertificate = (): Certificate => ({
  uuid: '',
  user: createDefaultUser(),
  course_name: '',
  issue_number: '',
  issue_date: '',
  issue_type: '',
  note: '',
  education_center: null,
  reissue_logs: [],
});