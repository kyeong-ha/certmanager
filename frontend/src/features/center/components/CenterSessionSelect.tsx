import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';

interface Props {
  centerName: string;
  value: string;
  onChange: (centerSessionUuid: string) => void;
  disabled?: boolean;
}

export default function CenterSessionSelect({ centerName, value, onChange, disabled }: Props) {
  const sessions = useSelector((state: RootState) => state.educationCenter.sessions);
  const filtered = sessions.filter((s) => s.education_center.center_name === centerName);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded px-2 py-1" disabled={disabled}>
      <option value="">기수를 선택하세요</option>
      {filtered.map((s: EducationCenterSessionSummary) => (
        <option key={s.uuid} value={s.uuid}>
          {s.center_session}기
        </option>
      ))}
    </select>
  );
}