import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Certificate } from '@/types/Certificate.type';
import { updateCertificate } from '@/services/cert.api';
import { convertCertificateToFormData } from '@/utils/convertFormData';
import ReissueLogList from '@/components/ReissueLogList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

export default function CertificateDetailModal({ isOpen, onClose, certificate }: Props) {
  const [form, setForm] = useState<Certificate | null>(certificate);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setForm(certificate);
  }, [certificate]);

  if (!certificate || !form) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>자격증 상세 정보</DialogTitle>
          </DialogHeader>
          <div>데이터를 불러올 수 없습니다.</div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleChange = (field: keyof Certificate, value: any) => {
    setForm((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const isModified = JSON.stringify(form) !== JSON.stringify(certificate);

  const handleSave = async () => {
    if (!form || !form.uuid || !isModified) return;
    try {
      const formData = convertCertificateToFormData(form);
      await updateCertificate(form.uuid, form);
      alert('수정이 완료되었습니다.');
      setEditMode(false);
      onClose();
    } catch (err) {
      console.error(err);
      alert('수정 중 오류 발생');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>자격증 상세 정보</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">기본 정보</TabsTrigger>
            <TabsTrigger value="log">수정 이력</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid gap-3">
              <Input
                disabled={!editMode}
                value={form.user.user_name}
                onChange={(e) =>
                  setForm((prev) => 
                    prev ? { ...prev, user: { ...prev.user, user_name: e.target.value } } : null
                  )
                }
                placeholder="이름"
              />
              <Input
                disabled={!editMode}
                value={form.user.birth_date}
                onChange={(e) =>
                  setForm((prev) => 
                    prev ? { ...prev, user: { ...prev.user, birth_date: e.target.value } } : null
                  )
                }
                placeholder="생년월일"
              />
              <Input
                disabled={!editMode}
                value={form.user.phone_number}
                onChange={(e) =>
                  setForm((prev) => 
                    prev ? { ...prev, user: { ...prev.user, birth_date: e.target.value } } : null
                  )
                }
                placeholder="전화번호"
              />
              <Input
                disabled={!editMode}
                value={form.course_name}
                onChange={(e) => handleChange('course_name', e.target.value)}
                placeholder="과정명"
              />
              <Input
                disabled={!editMode}
                value={form.issue_number}
                onChange={(e) => handleChange('issue_number', e.target.value)}
                placeholder="발급번호"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {editMode ? (
                <>
                  <Button onClick={handleSave} disabled={!isModified}>
                    저장
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    취소
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>수정</Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="log">
            <ReissueLogList logs={certificate.reissue_logs || []} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
