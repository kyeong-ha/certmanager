import { UserSummary } from '@/features/user/types/User.type';
import { EducationCenterSummary } from './EducationCenter.type';
import { ReissueLog } from '@/features/certificate/types/ReissueLog.type';

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
  issue_date?: string;
  issue_count: number;
  issue_status: 'DRAFT' | 'ISSUED' | 'DELIVERED';
  delivery_date?: string;

  users: UserSummary[];
  logs: ReissueLog[];

  created_at: string;
  updated_at: string;

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
