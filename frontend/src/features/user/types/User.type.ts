import { CertificateSummary } from '@/features/certificate/types/Certificate.type';
import { EducationCenterSummary } from '@/features/center/types/EducationCenter.type';

// 사용자 요약 정보 (리스트, 서브 참조용)
export interface UserSummary {
  uuid: string;
  user_name: string;
  birth_date: string;
  phone_number: string;
}

// 사용자 상세 정보
export interface UserDetail extends UserSummary {
  user_id: string | null;
  postal_code: string;
  address: string;
  photo: string | null;

  created_at: string;
  updated_at: string;

  // 교육기관+기수 리스트
  education_center_list: EducationCenterSummary[];
  certificates?: CertificateSummary[];
}

// 사용자 등록/수정 공통 폼
export interface UserWriteForm {
  user_id: string | null;
  user_name: string;
  birth_date: string;
  phone_number: string;
  postal_code: string;
  address: string;
  photo: string | null;
}