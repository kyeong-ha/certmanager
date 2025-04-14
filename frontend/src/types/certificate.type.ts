import { EducationCenter } from "./EducationCenter.type";
import { ReissueLog } from "./ReissueLog.type";

export interface Certificate {
  user_id?: string;
  user_name: string;
  phone_number: string;
  birth_date: string;
  postal_code?: Number;
  address?: string;
  image_file?: File | string;
  note?: string;

  course_name: string;
  issue_number: string;
  issue_date: string;
  issue_type?: string;
  education_center?: EducationCenter | null;

  created_at?: Date;
  updated_at?: Date;
  
  reissue_logs?: ReissueLog[];
}