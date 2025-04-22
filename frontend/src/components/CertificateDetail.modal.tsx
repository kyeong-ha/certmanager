import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Certificate } from '@/types/Certificate.type';
import type { ReissueLog } from '@/types/ReissueLog.type';
import { updateCertificate } from '@/services/cert.api';
import { fetchReissueLogsByUuid } from '@/services/logs.api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Certificate) => void;
  certificate: Certificate;
}

export default function CertificateDetailModal({ isOpen, onClose, onUpdate, certificate }: Props) {
  /* ---------------- state ---------------- */
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Certificate>(certificate);
  const [logs, setLogs] = useState<ReissueLog[]>([]);

  /* --------- sync when certificate changes --------- */
  useEffect(() => {
    setForm(certificate);
    fetchReissueLogsByUuid(certificate.uuid).then(setLogs);
  }, [certificate]);

  /* ---------------- handlers ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (JSON.stringify(form) === JSON.stringify(certificate)) {
      setEditMode(false);
      return;
    }
    try {
      const updated = await updateCertificate(certificate.uuid, form);
      onUpdate(updated);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('수정에 실패했습니다.');
    }
  };

  /* ---------------- render ---------------- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
      <div className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            자격증 상세&nbsp;–&nbsp;{certificate.issue_number}
          </DialogTitle>
        </DialogHeader>
        

        {/* ---------- 기존 필드 레이아웃 그대로 ---------- */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <label className="flex flex-col gap-1">
            <span>발급번호</span>
            <Input
              name="issue_number"
              value={form.issue_number}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span>발급일자</span>
            <Input
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span>성명</span>
            <Input value={form.user.user_name} disabled />
          </label>

          <label className="flex flex-col gap-1">
            <span>생년월일</span>
            <Input value={form.user.birth_date} disabled />
          </label>

          {/* 필요하면 기존 추가 필드 그대로 유지 */}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(certificate);
                  setEditMode(false);
                }}
              >
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>편집</Button>
          )}
        </div>

        {/* ---------- 재발급 이력 섹션 ---------- */}
        <h3 className="text-base font-semibold mt-8">재발급 이력</h3> {/* ★ */}
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">
            재발급 이력이 없습니다.
          </p>
        ) : (
          <table className="min-w-full text-sm border mt-2">
            <thead className="bg-gray-100">
              <tr>
                {['일자', '배송', '비용', '등록일'].map((h) => (
                  <th key={h} className="px-2 py-1 border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.uuid}>
                  <td className="px-2 py-1 border">{l.reissue_date}</td>
                  <td className="px-2 py-1 border">{l.delivery_type}</td>
                  <td className="px-2 py-1 border">
                    {l.reissue_cost ?? '-'}
                  </td>
                  <td className="px-2 py-1 border">
                    {l.created_at.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};