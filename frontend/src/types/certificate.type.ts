export interface Certificate {
  id: number;
  issue_number: string;
  issue_date: string;
  name: string;
  birth_date: string;
  course_name: string;
  phone_number: string;
  education_center: string;
  postal_code?: string;
  address?: string;
  note?: string;
}