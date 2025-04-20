import { User } from '@/types/User.type';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onChange: (updated: User) => void;
}

export default function UserFormModal({ isOpen, onClose, user, onChange }: Props) {
  const handleChange = (field: keyof User, value: string) => {
    onChange({ ...user, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원 정보 수정</DialogTitle>
        </DialogHeader>

        <Input value={user.user_name} onChange={e => handleChange('user_name', e.target.value)} placeholder="이름" />
        <Input value={user.phone_number} onChange={e => handleChange('phone_number', e.target.value)} placeholder="전화번호" />
        <Input type="date" value={user.birth_date} onChange={e => handleChange('birth_date', e.target.value)} placeholder="생년월일" />
        <Input value={user.postal_code ?? ''} onChange={e => handleChange('postal_code', e.target.value)} placeholder="우편번호" />
        <Input value={user.address ?? ''} onChange={e => handleChange('address', e.target.value)} placeholder="주소" />
      </DialogContent>
    </Dialog>
  );
}