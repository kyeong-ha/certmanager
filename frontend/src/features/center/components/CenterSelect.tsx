// DropDown 컴포넌트

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchSessions } from '@/features/center/slices/educationCenterSlice';
import { EducationCenterSession } from '@/features/center/types/EducationCenterSession.type';
import { fetchAllEducationSession } from '../services/center.api';
import { Button } from '@/components/ui/button';
import useAppDispatch from '@/hooks/useAppDispatch';

interface CenterSelectProps {
  value: string | null;
  onChange: (uuid: string) => void;
  onOpenCreateModal: () => void;
}

export default function CenterSelect({ value, onChange, onOpenCreateModal }: CenterSelectProps) {
  const dispatch = useAppDispatch();
  const { sessions, loading } = useSelector((state: RootState) => state.educationCenter);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  return (
    <div className="flex gap-2 items-center">
      <select
        className="border rounded px-3 py-2 w-full"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">교육기관을 선택하세요</option>
        {sessions.map((s: EducationCenterSession) => (
          <option key={s.uuid} value={s.uuid}>
            {s.education_center.center_name} / {s.center_session}
          </option>
        ))}
      </select>

      <Button variant="outline" onClick={onOpenCreateModal}>➕</Button>
    </div>
  );
}
