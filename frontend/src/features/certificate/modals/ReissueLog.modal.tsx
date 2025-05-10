import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createReissueLog } from '@/features/certificate/services/logs.api';
import { Certificate } from '@/features/certificate/types/Certificate.type';

interface ReissueProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
}

export default function ReissueModal({ isOpen, onClose, certificate }: ReissueProps) {
  const [form, setForm] = useState({reissue_date: new Date().toISOString().slice(0, 10), delivery_type: '선불', reissue_cost: 0, });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {await createReissueLog({certificate_uuid: certificate.uuid, ...form, });
    alert('재발급이 등록되었습니다.');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
      <div className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>재발급 등록 – {certificate.issue_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            <span>재발급일자</span>
            <Input type="date" name="reissue_date" value={form.reissue_date} onChange={handleChange} />
          </label>

          <label className="flex flex-col gap-1">
            <span>배송유형</span>
            <select
              name="delivery_type"
              value={form.delivery_type}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="선불">선불</option>
              <option value="착불">착불</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span>재발급 비용</span>
            <Input
              type="number"
              name="reissue_cost"
              value={form.reissue_cost}
              onChange={handleChange}
              min={0}
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSubmit}>등록</Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
