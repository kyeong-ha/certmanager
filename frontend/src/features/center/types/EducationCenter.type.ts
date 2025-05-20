import { EducationCenterSessionSummary, EducationCenterSessionDetail } from './EducationCenterSession.type';

// 교육기관 요약 정보
export interface EducationCenterSummary {
  uuid: string;
  center_name: string;
  center_session_list?: EducationCenterSessionSummary[];
}

// 교육기관 상세 정보
export interface EducationCenterDetail extends EducationCenterSummary {
  center_tel?: string;
  center_address?: string;
  unit_price?: number;

  ceo_name?: string;
  ceo_mobile?: string;

  manager_name?: string;
  manager_mobile?: string;

  created_at: string;
  updated_at: string;

  center_session_list: EducationCenterSessionDetail[];
}


// 교육기관 등록/수정 공통 폼
export interface EducationCenterWriteForm {
  uuid: string;
  center_name: string;
  center_tel?: string;
  ceo_name?: string;
  ceo_mobile?: string;
  manager_name?: string;
  manager_mobile?: string;
  center_address?: string;
  delivery_address?: string;
  unit_price?: string;
  center_session?: string;
}
