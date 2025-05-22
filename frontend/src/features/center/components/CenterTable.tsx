
import { useEffect, useState, MouseEvent } from 'react';
import type { EducationCenterSummary } from '@/features/center/types/EducationCenter.type';
import ContextMenu from '@/components/ContextMenu'; 

interface CenterTableProps {
  centers: EducationCenterSummary[];
  onRowClick: (center: EducationCenterSummary) => void;
  onSelectChange?: (selectedUuids: string[]) => void;
  onContextSelect?: (action: string, target: EducationCenterSummary) => void;
}

export default function CenterTable({ centers, onRowClick, onSelectChange, onContextSelect }: CenterTableProps) {
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]); // 선택된 UUID 리스트
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: EducationCenterSummary | null;
  } | null>(null);

  // 선택된 UUID 리스트가 변경될 때마다 외부에 상태 전달
  useEffect(() => {
    onSelectChange?.(selectedUuids);
  }, [selectedUuids, onSelectChange]);

  // 선택된 UUID 리스트를 토글하는 함수
  const toggleSelection = (uuid: string) => {
    setSelectedUuids((prev) =>
      prev.includes(uuid)
        ? prev.filter((id) => id !== uuid)
        : [...prev, uuid]
    );
  };

  // 체크박스 전체 선택/해체
  const toggleAll = () => {
    setSelectedUuids((prev) =>
      prev.length === centers.length ? [] : centers.map((c) => c.uuid)
    );
  };

  return (
      <div className="relative overflow-x-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="w-8 px-2 py-2 border-b text-center">
              <input
                type="checkbox"
                checked={selectedUuids.length === centers.length}
                onChange={toggleAll}
              />
            </th>
            <th className="px-4 py-2 text-left">교육원명</th>
            <th className="px-4 py-2 text-left">대표번호</th>
            <th className="px-4 py-2 text-left">주소</th>
            <th className="px-4 py-2 text-left">대표자</th>
            <th className="px-4 py-2 text-left">전화번호</th>
          </tr>
        </thead>
        <tbody>
          {centers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                교육기관이 없습니다.
              </td>
            </tr>
          ) : (
            centers.map((center) => (
              <tr
                key={center.uuid}
                onClick={() => toggleSelection(center.uuid)} // 1. 단일 클릭 → 선택
                onDoubleClick={() => onRowClick(center)} // 2. 더블 클릭 → 상세 모달
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, target: center }); // 3. 우클릭 → 컨텍스트 메뉴
                }}
                className={`hover:bg-blue-50 cursor-pointer ${
                  selectedUuids.includes(center.uuid) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="text-center px-2 py-1 border">
                  <input
                    type="checkbox"
                    checked={selectedUuids.includes(center.uuid)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(center.uuid);
                    }}
                  />
                </td>
                <td className="px-4 py-2">{center.center_name}</td>
                <td className="px-4 py-2">{center.center_tel || '-'}</td>
                <td className="px-4 py-2">{center.center_address || '-'}</td>
                <td className="px-4 py-2">{center.ceo_name || ''}</td>
                <td className="px-4 py-2">{center.ceo_mobile || ''}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 컨텍스트 메뉴 */}
      {contextMenu && contextMenu.target && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={['상세보기', '삭제하기']}
          onSelect={(action) => {
            if (onContextSelect && contextMenu.target) {
              onContextSelect(action, contextMenu.target);
            }
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}