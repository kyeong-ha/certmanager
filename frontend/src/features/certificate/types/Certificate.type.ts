import { EducationCenter } from "../../center/types/EducationCenter.type";
import { ReissueLog } from "./ReissueLog.type";
import { User } from "../../user/types/User.type";
export interface Certificate {
  uuid: string;
  issue_number: string;
  issue_date: string;
  issue_type: string;
  course_name: string;
  note?: string;
  copy_file?: string;

  created_at?: string;
  updated_at?: string;
  
  user: User;
  education_center: EducationCenter;
  reissue_logs?: ReissueLog[];
}

export interface CertificateSummary{
  uuid: string;
  issue_number: string;
  course_name: string;
  issue_date: string;
  education_center?: {
    edu_name: string;
    session: string;
  };
}