// 교육기관 + 기수 선택 UI
import CenterNameSelect from './CenterNameSelect';
import CenterSessionSelect from './CenterSessionSelect';
import { Button } from '@/components/ui/button';
import { EducationCenterSessionSummary } from '../types/EducationCenterSession.type';

interface CenterSelectProps {
  editMode: boolean;
  selectedCenterName: string;
  setSelectedCenterName: (name: string) => void;
  selectedSession: EducationCenterSessionSummary | null;
  setSelectedSession: (session: EducationCenterSessionSummary | null) => void;
  sessionList: EducationCenterSessionSummary[];
  onOpenCreateModal: () => void;
}

export default function CenterSelect({
  editMode,
  selectedCenterName,
  setSelectedCenterName,
  selectedSession,
  setSelectedSession,
  sessionList,
  onOpenCreateModal,
}: CenterSelectProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      <CenterNameSelect
        value={selectedCenterName}
        onChange={(name) => {
          setSelectedCenterName(name);
          setSelectedSession(null);
        }}
        disabled={!editMode}
      />
      <CenterSessionSelect
        centerName={selectedCenterName}
        value={selectedSession?.uuid ?? ''}
        onChange={(uuid) => {
          const session = sessionList.find((s) => s.uuid === uuid && s.education_center.center_name === selectedCenterName);
          if (!session) return;
          setSelectedSession(session);
        }}
        disabled={!editMode}
      />
      {editMode && (
        <Button
          type="button"
          variant="outline"
          onClick={onOpenCreateModal}
          className="text-sm whitespace-nowrap"
        >
          ➕ 신규 등록
        </Button>
      )}
    </div>
  );
}
