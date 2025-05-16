import { EducationCenterSession } from '@/features/center/types/EducationCenterSession.type';
import { UserSearchForm } from "../../user/types/UserSearchForm.type";

export interface CertificateSearchForm{
  uuid: string;         // 고유식별번호
  course_name: string;  // 자격과정
  issue_number: string; // 발급번호
  issue_date: string;   // 발급일자

  // 회원 정보
  user: UserSearchForm;
  
  // 교육원 정보
  education_session: EducationCenterSession | null;
}