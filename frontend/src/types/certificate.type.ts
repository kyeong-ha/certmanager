import { EducationCenter } from "./EducationCenter.type";
import { ReissueLog } from "./ReissueLog.type";
import { User } from "./User.type";
export interface Certificate {
  uuid: string;
  issue_number: string;
  issue_date: string;
  issue_type: string;
  course_name: string;
  note?: string;
  image_url?: string;
  pdf_url?: string;

  created_at?: Date;
  updated_at?: Date;
  
  user: User;
  education_center: EducationCenter;
  reissue_logs?: ReissueLog[];
}