import { ReissueLog } from '@/features/certificate/types/ReissueLog.type';

interface Props {
  logs: ReissueLog[];
}

export default function ReissueLogList({ logs }: Props) {
  if (logs.length === 0) {
    return <p className="text-sm text-gray-500">재발급 이력이 없습니다.</p>;
  }

  return (
    <div className="overflow-auto border rounded p-3 max-h-64">
      <table className="w-full text-sm border-separate border-spacing-y-1">
        <thead className="text-left text-gray-700">
          <tr>
            <th className="px-2 py-1">일자</th>
            <th className="px-2 py-1">배송 방식</th>
            <th className="px-2 py-1">비용</th>
            <th className="px-2 py-1">기록 생성</th>
            <th className="px-2 py-1">최근 수정</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="bg-white border border-gray-200 rounded shadow-sm">
              <td className="px-2 py-1">{new Date(log.reissue_date).toLocaleDateString()}</td>
              <td className="px-2 py-1">{log.delivery_type}</td>
              <td className="px-2 py-1">{log.reissue_cost ? `${log.reissue_cost.toLocaleString()}원` : '-'}</td>
              <td className="px-2 py-1">{new Date(log.created_at).toLocaleString()}</td>
              <td className="px-2 py-1">{new Date(log.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}