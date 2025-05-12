import { EducationCenterSession } from '@/features/center/types/EducationCenter.type';
import { ReissueLog } from "./ReissueLog.type";
import { User } from "../../user/types/User.type";
export interface Certificate {
  uuid: string;
  issue_number: string;
  issue_date: string;
  course_name: string;
  note?: string;
  copy_file?: string;

  created_at?: string;
  updated_at?: string;
  
  user: User;
  education_session: EducationCenterSession | null;
  reissue_logs?: ReissueLog[];
}