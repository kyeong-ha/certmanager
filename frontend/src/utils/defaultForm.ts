import { User } from '@/features/user/types/User.type';
import { EducationCenter } from '@/features/center/types/EducationCenter.type';
import { ReissueLog } from '@/features/certificate/types/ReissueLog.type';
import { Certificate } from '@/features/certificate/types/Certificate.type';

export const createDefaultUser = (): User => ({
  uuid: '',
  user_name: '',
  birth_date: '',
  phone_number: '',
  user_id: null,
  postal_code: '',
  address: '',
  photo: '',
  created_at: '',
  updated_at: '',
  certificates: [],
});

export const createDefaultEducationCenter = (): EducationCenter => ({
  uuid: '',
  edu_name: '',
  session: '',
});

export const createDefaultReissueLog = (): ReissueLog => ({
  uuid: '',
  certificate_uuid: '',
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