import { EducationCenterSearchForm } from "@/features/center/types/EducationCenterSearchForm.type";

// User model 검색용 Form
export interface UserSearchForm {
  uuid: string;
  user_id: string | null;
  user_name: string;
  birth_date: string;
  phone_number: string;
  postal_code: string;
  address: string;
  photo: string | null;
  latest_education_session?: {
    education_center: {
      center_name: string;
    }
    center_session: string | null;
  };
}