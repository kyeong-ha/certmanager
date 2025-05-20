// 사용자 정보 생성/수정
import type { UserWriteForm } from '@/features/user/types/User.type';
import InputBlock from '@/components/ui/InputBlock';

interface UserWriteFormProps {
  user: UserWriteForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable: boolean;
}

export default function UserWriteForm({ user, onChange, editable }: UserWriteFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 p-2">
      <InputBlock label="성명" name="user_name" value={user.user_name} onChange={onChange} editable={editable} />
      <InputBlock label="생년월일" name="birth_date" value={user.birth_date} onChange={onChange} editable={editable} />
      <InputBlock label="전화번호" name="phone_number" value={user.phone_number} onChange={onChange} editable={editable} />
      <InputBlock label="우편번호" name="postal_code" value={user.postal_code} onChange={onChange} editable={editable} />
      <InputBlock label="주소" name="address" value={user.address} onChange={onChange} editable={editable} />
      <InputBlock label="회원 ID" name="user_id" value={user.user_id ?? ''} onChange={onChange} editable={editable} />
    </div>
  );
}
