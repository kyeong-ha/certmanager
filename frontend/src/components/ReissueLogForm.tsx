import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createReissueLog } from '@/services/logs.api';

interface Props {
  issue_number: string;
  onCreated: () => void;
}

export default function ReissueLogForm({ issue_number, onCreated }: Props) {
  const [date, setDate] = useState('');
  const [deliveryType, setDeliveryType] = useState('선불');
  const [cost, setCost] = useState('');

  const handleSubmit = async () => {
    await createReissueLog({
      issue_number: issue_number,
      reissue_date: date,
      delivery_type: deliveryType,
      reissue_cost: cost ? parseInt(cost) : null,
    });
    onCreated();
    setDate('');
    setCost('');
  };

  return (
    <div className="space-y-2 mt-4">
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <label htmlFor="deliveryType" className="block text-sm font-medium text-gray-700">
        배송 유형
      </label>
      <select
        id="deliveryType"
        value={deliveryType}
        onChange={(e) => setDeliveryType(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="선불">선불</option>
        <option value="착불">착불</option>
      </select>
      <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="비용 (선택)" />
      <Button onClick={handleSubmit}>로그 추가</Button>
    </div>
  );
}
