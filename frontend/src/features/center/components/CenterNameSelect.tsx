import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Props {
  value: string;
  onChange: (centerName: string) => void;
  disabled?: boolean;
}

export default function CenterNameSelect({ value, onChange, disabled }: Props) {
  const centers = useSelector((state: RootState) => state.educationCenter.centers);
  const uniqueNames = Object.keys(centers);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded px-2 py-1" disabled={disabled}>
      <option value="">교육기관 선택</option>
      {uniqueNames.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}