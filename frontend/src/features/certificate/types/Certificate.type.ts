import { UserDetail, UserSummary } from '@/features/user/types/User.type';
import { EducationCenterSummary } from '@/features/center/types/EducationCenter.type';
import { ReissueLog } from './ReissueLog.type';
import { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';

// 자격증 요약 정보
export interface CertificateSummary {
  uuid: string;
  issue_number: string;
  issue_date: string;
  course_name: string;

  user: UserSummary;
  center_name: string;
  center_session: number;
  // education_session: EducationCenterSessionDetail;
}

// 자격증 상세 정보
export interface CertificateDetail {
  uuid: string;
  issue_number: string;
  issue_date: string;
  course_name: string;
  note?: string;
  copy_file?: string;
  delivery_address?: string;
  tracking_number?: string;

  created_at?: string;
  updated_at?: string;

  
  user: UserDetail;

  education_session: {
    uuid: string;
    center_session: number;
    education_center: {
      uuid: string;
      center_name: string;
    };
  };
  
  reissue_logs?: ReissueLog[];
}

// 자격증 등록/수정 전송용 폼
export interface CertificateWriteForm {
  issue_number: string;
  issue_date: string;
  course_name: string;
  delivery_address?: string;
  tracking_number?: string;
  note?: string;

  user: string;                 // user UUID
  education_session: string;   // session UUID
}