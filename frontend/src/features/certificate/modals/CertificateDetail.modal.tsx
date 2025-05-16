import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Certificate } from '@/features/certificate/types/Certificate.type';
import { fetchReissueLogsByUuid } from '@/features/certificate/services/logs.api';
import { updateCertificates } from '@/features/certificate/services/cert.api';
import { useEffect, useState } from 'react';
import type { ReissueLog } from '@/features/certificate/types/ReissueLog.type';
import PrintPreviewProps from '@/components/PrintPreview';
import PrintButton from '@/components/PrintButton';
import InputBlock from '@/components/ui/InputBlock';
import CenterCreateModal from '@/features/center/modals/CenterCreate.modal';
import CenterNameSelect from '@/features/center/components/CenterNameSelect';
import CenterSessionSelect from '@/features/center/components/CenterSessionSelect';
import { EducationCenterSession } from '@/features/center/types/EducationCenterSession.type';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useAppDispatch from '@/hooks/useAppDispatch';
import { fetchSessions } from '@/features/center/slices/educationCenterSlice';

//----------------------------------------------------------------------//
interface CertificateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Certificate) => void;
  targetCert: Certificate;
}
//----------------------------------------------------------------------//


/* ----- Modal -------------------------------------------------------- */
export default function CertificateDetailModal({ isOpen, onClose, onUpdate, targetCert }: CertificateDetailModalProps) {
  /* --- 1.states --- */
  const [formData, setFormData] = useState<Certificate | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [logs, setLogs] = useState<ReissueLog[]>([]);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedSession, setSelectedSession] = useState<EducationCenterSession | null>(null);
  const sessions = useSelector((state: RootState) => state.educationCenter.sessions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      setFormData(structuredClone(targetCert));

      const session = sessions.find((s) => s.uuid === targetCert.education_session?.uuid);
      if (session) {
        setSelectedSession(session);
        setSelectedCenterName(session.education_center.center_name);
      } else {
        setSelectedSession(null);
        setSelectedCenterName('');
      }
    }
  }, [isOpen, targetCert, sessions]);

  useEffect(() => {
    if (targetCert?.uuid) {
      fetchReissueLogsByUuid(targetCert.uuid).then(setLogs);
    }
  }, [targetCert]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSessions());
    }
  }, [isOpen]);

  /* --- 2.handlers --- */
  // 2.1. EditMode 시작
  const handleEditStart = () => {
    setFormData(structuredClone(targetCert));
    setEditMode(true);
  };
  // 2.2. 자격증 정보 변경
  const handleChangeCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // 2.3. 사용자 정보 변경
  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData || !formData.user) return;
    const { name, value } = e.target;
    setFormData({ ...formData, user: { ...formData.user, [name]: value } });
  };
  // 2.4. 정보 저장
  const handleSave = async () => {
    if (!formData) return;
    try {
      const updated = await updateCertificates(formData.uuid, formData);
      onUpdate(updated);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert('수정 실패');
    }
  };

  /* --- 3.Render --- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl overflow-hidden" aria-describedby="dialog-description">
        
        {/* 3.1. 헤더: Title을 상단에 고정 */}
        <DialogHeader className="sticky top-0 z-10 bg-white p-3 border-b">
          <DialogTitle className="text-2xl font-semibold">
            ✅ 자격증 상세정보 - {targetCert.issue_number}
          </DialogTitle>
          <DialogDescription id="dialog-description" className="mt-2">
            {targetCert.user.user_name}님의 자격증 상세정보입니다.
          </DialogDescription>
        </DialogHeader>

        {/* 3.2. 본문: 내부 스크롤 가능 */}
        <div className="max-h-[83vh] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-150">


          <div className="border rounded-xl p-4 space-y-4 bg-muted shadow-sm rounded">
            {/* 3.2.1. 사용자 정보 */}
            
              <div className="border rounded-xl p-4 space-y-4 bg-muted shadow-sm">
                <h3 className="text-lg font-semibold">👤 사용자 정보</h3>
                <div className="grid grid-cols-2 gap-4 mt-4 p-2">
                  {formData ? (
                    <>
                      <InputBlock label="성명" name="user_name" value={formData.user.user_name} onChange={handleChangeUser} editable={editMode} />
                      <InputBlock label="생년월일" name="birth_date" value={formData.user.birth_date} onChange={handleChangeUser} editable={editMode} />
                      <InputBlock label="전화번호" name="phone_number" value={formData.user.phone_number} onChange={handleChangeUser} editable={editMode} />
                      <InputBlock label="주소" name="address" value={formData.user.address ?? ''} onChange={handleChangeUser} editable={editMode} />
                    </>
                    ) : (
                      <p className="text-sm text-muted-foreground">데이터를 불러오는 중입니다.</p>
                    )}
                  </div>
              </div>

            {/* 3.2.2. 자격증 정보 */}
            <div className="border rounded-xl p-4 space-y-4 bg-muted shadow-sm mt-6">
              <h3 className="text-lg font-semibold">🎖️ 자격증 정보</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 p-2">
                {formData ? (
                  <>
                    <InputBlock label="발급번호" name="issue_number" value={formData.issue_number} onChange={handleChangeCert} editable={editMode} />
                    <InputBlock label="발급일자" name="issue_date" value={formData.issue_date} onChange={handleChangeCert} editable={editMode} type="date" />
                    <InputBlock label="과정명" name="course_name" value={formData.course_name} onChange={handleChangeCert} editable={editMode} />
                  </>
                  ) : (
                    <p className="text-sm text-muted-foreground">데이터를 불러오는 중입니다.</p>
                  )}
              </div>
              {/* 3.2.3. 재발급 이력 */}
              <div className="border rounded-xl mt-6 p-4 space-y-4 bg-muted shadow-sm rounded">
                {/* 재발급 이력: Title */}
                <h3 className="text-lg font-semibold">🔄 재발급 이력</h3>
                {/* 재발급 이력: Content */}
                {logs.length === 0 ? (
                  // 데이터가 없는 경우
                  <p className="text-sm text-muted-foreground mt-2">재발급 이력이 없습니다.</p>
                ) : (
                  // 데이터가 있는 경우
                  <table className="min-w-full text-sm border mt-2">
                    <thead className="bg-gray-100">
                      <tr>
                        {['일자', '배송', '비용', '등록일'].map((h) => (
                          <th key={h} className="px-2 py-1 border">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((l) => (
                        <tr key={l.uuid}>
                          <td className="px-2 py-1 border">{l.reissue_date}</td>
                          <td className="px-2 py-1 border">{l.delivery_type}</td>
                          <td className="px-2 py-1 border">{l.reissue_cost ?? '-'}</td>
                          <td className="px-2 py-1 border">{l.created_at.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>


            {/* 3.2.4. 교육기관 정보 */}
            <div className="border rounded-xl p-4 space-y-4 bg-muted shadow-sm mt-6">
              <h3 className="text-lg font-semibold">🏫 교육기관 정보</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <CenterNameSelect value={selectedCenterName} onChange={(name) => {
                  setSelectedCenterName(name);
                  setSelectedSession(null);
                  setFormData((prev) => prev ? { ...prev, education_session: { uuid: '', center_session: '', education_center: { uuid: '', center_name: name }}} : prev);
                  }} 
                  disabled={!editMode}
                />

                <CenterSessionSelect
                  centerName={selectedCenterName}
                  value={selectedSession?.uuid ?? ''}
                  onChange={(uuid) => {
                    const session = selectedCenterName
                      ? sessions.find((s) => s.uuid === uuid && s.education_center.center_name === selectedCenterName)
                      : null;
                    if (!session) return;
                    setSelectedSession(session);
                    setFormData((prev) => prev ? { ...prev, education_session: session } : prev);
                  }}
                  disabled={!editMode}
                />
                  {editMode && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCenterModalOpen(true)}
                      className="text-sm whitespace-nowrap"
                    >
                      ➕ 신규 등록
                    </Button>
                  )}
              </div>
            </div>

            {/* 3.2.5. Edit Button */}
            <div className="flex justify-end gap-2 mt-6 rounded-xl bg-muted shadow-sm">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>취소</Button>
                  <Button onClick={handleSave}>저장</Button>
                </>
              ) : (
                <Button onClick={handleEditStart}>편집</Button>
              )}
            </div>
          </div>
          

          {/* 3.2.3. 자격증 미리보기 */}
          {targetCert?.copy_file ? (
            <div className="border rounded-xl mt-6 p-4 space-y-4 bg-muted shadow-sm rounded">
              {/* 자격증 미리보기: Title */}
              <h3 className="text-lg font-semibold">🖨️ 자격증 미리보기</h3>
              {/* 자격증 미리보기: Content */}
              <PrintPreviewProps copy_file={targetCert.copy_file} />
              {/* 자격증 미리보기: Print Button */}
              <div className="text-right mt-2">
                <PrintButton file={targetCert.copy_file} />
              </div>

            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground italic">
              미리보기 가능한 자격증 PDF가 없습니다.
            </div>
          )}
        </div>
      </DialogContent>
      {/* 교육기관 등록 모달 */}
      <CenterCreateModal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        onSuccess={(newUuid) => {
          setIsCenterModalOpen(false);
          const session = sessions.find((s) => s.uuid === newUuid);
          if (!session) return;
          setSelectedCenterName(session.education_center.center_name);
          setSelectedSession(session);
          setFormData((prev) => prev ? { ...prev, education_session: session } : prev);
        }}
      />
    </Dialog>

  );
}