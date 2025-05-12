import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Certificate } from '@/features/certificate/types/Certificate.type';
import { fetchReissueLogsByUuid } from '@/features/certificate/services/logs.api';
import { updateCertificates } from '@/features/certificate/services/cert.api';
import { useEffect, useState } from 'react';
import type { ReissueLog } from '@/features/certificate/types/ReissueLog.type';
import PrintPreviewProps from '@/components/PrintPreview';
import PrintButton from '@/components/PrintButton';

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
  const [editMode, setEditMode] = useState(false);
  const [logs, setLogs] = useState<ReissueLog[]>([]);

  useEffect(() => {
    if (targetCert?.uuid) {
      fetchReissueLogsByUuid(targetCert.uuid).then(setLogs);
    }
  }, [targetCert]);

  /* --- 2.handlers --- */
  // 2.1. 자격증 정보 변경
  const handleChangeCert = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    (targetCert as any)[e.target.name] = e.target.value;
  };

  // 2.2. 사용자 정보 변경
  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (targetCert.user) {
      const updatedUser = { ...targetCert.user, [e.target.name]: e.target.value };
      targetCert.user = updatedUser;
    }
  };

  // 2.3. 정보 저장
  const handleSave = async () => {
    try {
      const updated = await updateCertificates(targetCert.uuid, targetCert);
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

          {/* 3.2.1. 자격증 정보 */}
          <div className="border rounded-xl p-4 space-y-4 bg-muted shadow-sm rounded">
            {/* 자격증 정보: Title */}
            <h3 className="text-lg font-semibold">
              🎖️ 자격증 정보
            </h3>
            {/* 자격증 정보: Content */}
            <div className="grid grid-cols-2 gap-4 mt-4 p-4">
              <label className="flex flex-col gap-1">
                <h3 className="text-l font-bold">발급번호</h3>
                <Input name="issue_number" defaultValue={targetCert.issue_number} onChange={handleChangeCert} disabled={!editMode} />
              </label>

              <label className="flex flex-col gap-1">
                <h3 className="text-l font-bold">발급일자</h3>
                <Input type="date" name="issue_date" defaultValue={targetCert.issue_date} onChange={handleChangeCert} disabled={!editMode} />
              </label>

              <label className="flex flex-col gap-1">
                <h3 className="text-l font-bold">성명</h3>
                <Input name="user_name" defaultValue={targetCert.user.user_name} onChange={handleChangeUser} disabled={!editMode} />
              </label>

              <label className="flex flex-col gap-1">
                <h3 className="text-l font-bold">생년월일</h3>
                <Input name="birth_date" defaultValue={targetCert.user.birth_date} onChange={handleChangeUser} disabled={!editMode} />
              </label>
            </div>
            {/* 자격증 정보: Edit Button */}
            <div className="flex justify-end gap-2 mt-6 rounded-xl bg-muted shadow-sm">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSave}>
                    저장
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>
                  편집
                </Button>
              )}
            </div>
          </div>
          
          {/* 3.2.2. 재발급 이력 */}
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
    </Dialog>
  );
}