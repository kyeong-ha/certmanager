import { EducationCenterSession } from '@/features/center/types/EducationCenterSession.type';
import { ReissueLog } from "./ReissueLog.type";
import { UserSearchForm } from "../../user/types/UserSearchForm.type";

export interface Certificate {
  uuid: string;
  issue_number: string;
  issue_date: string;
  course_name: string;
  note?: string;
  copy_file?: string;

  created_at?: string;
  updated_at?: string;
  
  user: UserSearchForm;
  education_session: EducationCenterSession | null;
  reissue_logs?: ReissueLog[];
}