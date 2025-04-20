import { ReissueLog } from '@/types/ReissueLog.type';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: ReissueLog[];
  onChange: (logs: ReissueLog[]) => void;
}

export default function ReissueLogModal({ isOpen, onClose, logs, onChange }: Props) {
  const handleChange = (index: number, field: keyof ReissueLog, value: any) => {
    const updated = [...logs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addLog = () => {
    onChange([...logs, {
      uuid: crypto.randomUUID(),
      certificate: {} as any,
      reissue_date: '',
      reissue_cost: 0,
      delivery_type: '선불',
    }]);
  };

  const removeLog = (index: number) => {
    const updated = logs.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>재발급 내역</DialogTitle>
        </DialogHeader>

        {logs.map((log, index) => (
          <div key={log.uuid} className="space-y-1 border-b py-2">
            <Input type="date" value={log.reissue_date} onChange={e => handleChange(index, 'reissue_date', e.target.value)} />
            <Input type="number" value={log.reissue_cost} onChange={e => handleChange(index, 'reissue_cost', Number(e.target.value))} />
            <select
              aria-label="Delivery Type"
              className="w-full border rounded p-1"
              value={log.delivery_type}
              onChange={e => handleChange(index, 'delivery_type', e.target.value as '선불' | '착불')}
            >
              <option value="선불">선불</option>
              <option value="착불">착불</option>
            </select>
            <button className="text-red-500 text-xs underline" onClick={() => removeLog(index)}>삭제</button>
          </div>
        ))}

        <button className="text-blue-600 text-sm underline" onClick={addLog}>+ 새 재발급 추가</button>
      </DialogContent>
    </Dialog>
  );
}
