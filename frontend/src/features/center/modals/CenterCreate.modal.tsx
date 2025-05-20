import { useEffect, useState } from 'react';
import { createEducationCenter } from '@/features/center/services/center.api';
import type { EducationCenterCreateForm } from '@/features/center/types/EducationCenterCreateForm.type';
import { fetchSessions } from '@/features/center/slices/educationCenterSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAppDispatch from '@/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AutoCompleteInput } from '@/components/ui/AutoCompleteInput';


//----------------------------------------------------------------------//
interface CenterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (uuid: string) => void;
}

const fieldOrder: (keyof EducationCenterCreateForm)[] = [
  'center_name', 'center_tel',
  'ceo_name', 'ceo_mobile',
  'manager_name', 'manager_mobile',
  'center_address', 'delivery_address',
  'unit_price', 'center_session',
];
//----------------------------------------------------------------------//


/* ----- Modal -------------------------------------------------------- */
export default function CenterCreateModal({ isOpen, onClose, onSuccess }: CenterCreateModalProps) {
  /* --- 1.states --- */
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<EducationCenterCreateForm>({
    uuid: '',
    center_name: '',
    center_tel: '',
    ceo_name: '',
    ceo_mobile: '',
    manager_name: '',
    manager_mobile: '',
    center_address: '',
    delivery_address: '',
    unit_price: '',
    center_session: '',
  });
  const centers = useSelector((state: RootState) => state.educationCenter.centerDetails);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (Object.keys(centers).length === 0) {
      dispatch(fetchSessions());
    }
  }, [dispatch, centers]);

  /* --- 2.handlers --- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'center_name') {
      const matched = Object.entries(centers).find(([key]) => key === value)?.[1];
      if (matched) {
        setForm({ ...matched, center_session: '' });
      }
    }
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);
    const res = await createEducationCenter(form);
    dispatch(fetchSessions());
    onSuccess(res.uuid);
    onClose();
  } catch (err) {
    console.error('등록 실패:', err);
  } finally {
    setLoading(false);
  }
};

  /* --- 3.Render --- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>교육기관 등록</DialogTitle>
        </DialogHeader>

        {/* 입력 필드 */}
        <AutoCompleteInput
          value={form.center_name}
          onChange={(val) => setForm((prev) => ({ ...prev, center_name: val }))}
          options={Object.keys(centers)}
          onSelect={(name) => {
            const matched = centers[name];
            if (matched) {
              setForm({ ...matched, center_session: '' });
            }
          }}
          onCreateNew={(name) => {
            setForm({
              uuid: '',
              center_name: name,
              center_tel: '',
              ceo_name: '',
              ceo_mobile: '',
              manager_name: '',
              manager_mobile: '',
              center_address: '',
              delivery_address: '',
              unit_price: '',
              center_session: '',
            });
          }}
          placeholder="교육기관명 입력 또는 선택"
        />

        {/* 나머지 입력 필드 */}
        {fieldOrder
          .filter((field) => field !== 'center_name')
          .map((field) => (
            <Input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.replace(/_/g, ' ')}
              className="mb-2"
            />
          ))}

        <Button onClick={handleSubmit} disabled={loading} className="w-full mt-2">
          {loading ? '등록 중...' : '등록'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}