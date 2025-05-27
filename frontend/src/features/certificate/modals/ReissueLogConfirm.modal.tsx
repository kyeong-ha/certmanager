import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useReissueLogConfig } from '@/context/ReissueLogConfigContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reissue_date: string;
    delivery_type: '선불' | '착불';
    reissue_cost: number;
  }) => void;
}

export default function ReissueLogConfirmModal({ isOpen, onClose, onConfirm }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const { defaultDeliveryType, defaultReissueCost } = useReissueLogConfig();

  const [form, setForm] = useState({
    reissue_date: today,
    delivery_type: defaultDeliveryType,
    reissue_cost: defaultReissueCost,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>재발급 로그 입력</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 재발급일 */}
          <div>
            <label className="block text-sm font-medium">재발급일</label>
            <input
              type="date"
              value={form.reissue_date}
              onChange={(e) => setForm({ ...form, reissue_date: e.target.value })}
              className="input"
            />
          </div>

          {/* 배송방식 */}
          <div>
            <label className="block text-sm font-medium">배송방식</label>
            <select
              value={form.delivery_type}
              onChange={(e) => setForm({ ...form, delivery_type: e.target.value as '선불' | '착불' })}
              className="input"
            >
              <option value="선불">선불</option>
              <option value="착불">착불</option>
            </select>
          </div>

          {/* 재발급 비용 */}
          <div>
            <label className="block text-sm font-medium">재발급 비용 (₩)</label>
            <input
              type="number"
              value={form.reissue_cost}
              onChange={(e) => setForm({ ...form, reissue_cost: Number(e.target.value) })}
              className="input"
              min={0}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button onClick={onClose} className="btn-secondary">취소</button>
            <button
              onClick={() => onConfirm(form)}
              className="btn-primary"
            >
              로그 저장 및 출력
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


