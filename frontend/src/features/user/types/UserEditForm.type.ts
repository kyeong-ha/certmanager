// User model 수정용 Form
export interface UserEditForm {
  user_id: string | null;
  user_name: string;
  birth_date: string;
  phone_number: string;
  postal_code: string;
  address: string;
  photo: string | null;
}