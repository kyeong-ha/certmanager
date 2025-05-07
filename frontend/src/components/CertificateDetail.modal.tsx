import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Certificate } from '@/types/Certificate.type';
import { fetchReissueLogsByUuid } from '@/services/logs.api';
import { updateCertificate } from '@/services/cert.api';
import { useEffect, useState } from 'react';
import type { ReissueLog } from '@/types/ReissueLog.type';
import PDFPreview from './PDFPreview';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Certificate) => void;
  targetCert: Certificate;
}

export default function CertificateDetailModal({ isOpen, onClose, onUpdate, targetCert }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [logs, setLogs] = useState<ReissueLog[]>([]);

  useEffect(() => {
    if (targetCert?.uuid) {
      fetchReissueLogsByUuid(targetCert.uuid).then(setLogs);
    }
  }, [targetCert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    (targetCert as any)[e.target.name] = e.target.value;
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (targetCert.user) {
      const updatedUser = { ...targetCert.user, [e.target.name]: e.target.value };
      targetCert.user = updatedUser;
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateCertificate(targetCert.uuid, targetCert);
      onUpdate(updated);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert('수정 실패');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>자격증 상세정보 - {targetCert.issue_number}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <label className="flex flex-col gap-1">
              <span>발급번호</span>
              <Input name="issue_number" defaultValue={targetCert.issue_number} onChange={handleChange} disabled={!editMode} />
            </label>
            <label className="flex flex-col gap-1">
              <span>발급일자</span>
              <Input type="date" name="issue_date" defaultValue={targetCert.issue_date} onChange={handleChange} disabled={!editMode} />
            </label>
            <label className="flex flex-col gap-1">
              <span>성명</span>
              <Input name="user_name" defaultValue={targetCert.user.user_name} onChange={handleUserChange} disabled={!editMode} />
            </label>
            <label className="flex flex-col gap-1">
              <span>생년월일</span>
              <Input name="birth_date" defaultValue={targetCert.user.birth_date} onChange={handleUserChange} disabled={!editMode} />
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>취소</Button>
                <Button onClick={handleSave}>저장</Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>편집</Button>
            )}
          </div>

          <h3 className="text-base font-semibold mt-8">재발급 이력</h3>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">재발급 이력이 없습니다.</p>
          ) : (
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
          {targetCert?.copy_file ? (
            <div className="border rounded-xl mt-6 p-4 space-y-4 bg-muted">
              <h3 className="text-lg font-semibold">자격증 미리보기</h3>

              <PDFPreview copy_file={targetCert.copy_file} />

              <div className="text-right">
                <a
                  href={targetCert.copy_file}
                  download={`자격증_${targetCert.user.user_name}_${targetCert.issue_number}.pdf`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90"
              >
                  PDF 다운로드
                </a>
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