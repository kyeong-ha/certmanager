import { EducationCenter } from "./EducationCenter.type";
import { ReissueLog } from "./ReissueLog.type";
import { User } from "./User.type";

export interface Certificate {
  uuid: string;
  course_name: string;
  issue_number: string;
  issue_date: string;
  issue_type?: string;
  note?: string;
  
  user: User;
  reissue_logs?: ReissueLog[];
  education_center?: EducationCenter | null;
}