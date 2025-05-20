import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useAppDispatch from '@/hooks/useAppDispatch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PrintButton from '@/components/PrintButton';
import InputBlock from '@/components/ui/InputBlock';

import type { CertificateDetail, CertificateWriteForm } from '@/features/certificate/types/Certificate.type';
import type { ReissueLog } from '@/features/certificate/types/ReissueLog.type';
import type { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';

import { fetchSessions } from '@/features/center/slices/educationCenterSlice';
import { fetchReissueLogsByUuid } from '@/features/certificate/services/logs.api';
import { updateCertificate } from '@/features/certificate/services/cert.api';

import PrintPreviewProps from '@/components/PrintPreview';
import CenterSelect from '@/features/center/components/CenterSelect';
import UserFormBlock from '@/features/user/components/UserFormBlock';
import CenterSessionSelect from '@/features/center/components/CenterSessionSelect';
import { convertToWriteForm } from '@/features/certificate/utils/convertToWriteForm';
import CenterCreateModal from '@/features/center/modals/CenterCreate.modal';

//----------------------------------------------------------------------//
interface CertificateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: CertificateDetail) => void;
  targetCert: CertificateDetail;
}
//----------------------------------------------------------------------//


/* ----- Modal -------------------------------------------------------- */
export default function CertificateDetailModal({ isOpen, onClose, onUpdate, targetCert }: CertificateDetailModalProps) {
  /* --- 1.states --- */
  const [detailData, setDetailData] = useState<CertificateDetail | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [logs, setLogs] = useState<ReissueLog[]>([]);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedSession, setSelectedSession] = useState<EducationCenterSessionSummary | null>(null);
  
  const sessionList = useSelector((state: RootState) => state.educationCenter.sessions);

  useEffect(() => {
    if (isOpen) {
      setDetailData(structuredClone(targetCert));

      // 1) center_name → selectedCenterName
      setSelectedCenterName(targetCert.education_session.education_center.center_name);

      // 2) center_session → sessionList에서 매칭
      const matched = sessionList.find(
        (s) =>
          s.center_session === targetCert.education_session.center_session &&
          s.education_center.center_name === targetCert.education_session.education_center.center_name
      );
      setSelectedSession(matched ?? null);
    }
  }, [isOpen, targetCert, sessionList]);


  useEffect(() => {
    if (targetCert?.uuid) {
      fetchReissueLogsByUuid(targetCert.uuid).then(setLogs);
    }
  }, [targetCert]);

  useEffect(() => {
    if (isOpen) {
      
    }
  }, [isOpen]);

  /* --- 2.handlers --- */
  // 2.1. EditMode 시작
  const handleEditStart = () => {
    setDetailData(structuredClone(targetCert));
    setEditMode(true);
  };
  // 2.2. 자격증 정보 변경
  const handleChangeCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!detailData) return;
    const { name, value } = e.target;
    setDetailData({ ...detailData, [name]: value });
  };
  // 2.3. 사용자 정보 변경
  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!detailData || !detailData.user) return;
    const { name, value } = e.target;
    setDetailData({ ...detailData, user: { ...detailData.user, [name]: value } });
  };
  // 2.4. 정보 저장
const handleSave = async () => {
  if (!detailData || !selectedSession) return;

  const isUnchanged =
    detailData.issue_number === targetCert.issue_number &&
    detailData.issue_date === targetCert.issue_date &&
    detailData.course_name === targetCert.course_name &&
    detailData.note === targetCert.note &&
    detailData.delivery_address === targetCert.delivery_address &&
    detailData.tracking_number === targetCert.tracking_number &&
    detailData.user.user_name === targetCert.user.user_name &&
    detailData.user.birth_date === targetCert.user.birth_date &&
    detailData.user.phone_number === targetCert.user.phone_number &&
    detailData.user.address === targetCert.user.address &&
    detailData.education_session.uuid === targetCert.education_session.uuid;

  if (isUnchanged) {
    setEditMode(false);
    return;
  }

  try {
    const writeData = {
      ...convertToWriteForm(detailData),
      user_data: {
        user_name: detailData.user.user_name,
        birth_date: detailData.user.birth_date,
        phone_number: detailData.user.phone_number,
        address: detailData.user.address ?? '',
      },
    };

    const updated = await updateCertificate(detailData.uuid, writeData);
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
                {detailData && (
                  <UserFormBlock
                    user={detailData.user}
                    onChange={handleChangeUser}
                    editable={editMode}
                  />
                )}
              </div>

            {/* 3.2.2. 자격증 정보 */}
            <div className="border rounded-xl p-4 space-y-4 bg-muted shadow-sm mt-6">
              <h3 className="text-lg font-semibold">🎖️ 자격증 정보</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 p-2">
                {detailData ? (
                  <>
                    <InputBlock label="발급번호" name="issue_number" value={detailData.issue_number} onChange={handleChangeCert} editable={editMode} />
                    <InputBlock label="발급일자" name="issue_date" value={detailData.issue_date} onChange={handleChangeCert} editable={editMode} type="date" />
                    <InputBlock label="과정명" name="course_name" value={detailData.course_name} onChange={handleChangeCert} editable={editMode} />
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
              <CenterSelect
                  editMode={editMode}
                  selectedCenterName={selectedCenterName}
                  setSelectedCenterName={setSelectedCenterName}
                  selectedSession={selectedSession}
                  setSelectedSession={setSelectedSession}
                  sessionList={sessionList}
                  onOpenCreateModal={() => setIsCenterModalOpen(true)}
                />
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
          const session = sessionList.find((s) => s.uuid === newUuid);
          if (!session) return;
          setSelectedCenterName(session.education_center.center_name);
          setSelectedSession(session);
          setDetailData((prev) => prev ? { ...prev, education_session: session } : prev);
        }}
      />
    </Dialog>

  );
}