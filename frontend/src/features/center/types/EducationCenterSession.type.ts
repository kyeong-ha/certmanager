import { EducationCenterSummary } from './EducationCenter.type';

// 요약용: 드롭다운 등 간단한 선택시 사용
export interface EducationCenterSessionSummary {
  uuid: string;
  center_session: number;
  unit_price?: number;
  education_center: EducationCenterSummary;
}

// 상세용: 등록/수정/상세조회/출력 등에서 사용
export interface EducationCenterSessionDetail extends EducationCenterSessionSummary {
  delivery_address?: string;
  tracking_numbers?: string[];
  created_at: string;
  updated_at: string;

  education_center: EducationCenterSummary;
}

// 교육기수 등록/수정 공통 폼
export interface EducationCenterSessionWriteForm {
  uuid?: string;
  education_center_uuid: string;        // 교육기관 UUID
  center_session: number;
  unit_price?: number;
  delivery_address?: string;
  tracking_numbers?: string[];
}
