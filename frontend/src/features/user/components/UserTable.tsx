import { useEffect, useState, MouseEvent } from 'react';
import { UserSummary } from '@/features/user/types/User.type';
import ContextMenu from '@/components/ContextMenu';

interface UserTableProps {
  users: UserSummary[];
  onRowClick: (user: UserSummary) => void;
  onSelectChange?: (selectedUuids: string[]) => void;
  onContextSelect?: (action: string, user: UserSummary) => void;

}

export default function UserTable({ users, onRowClick, onSelectChange, onContextSelect }: UserTableProps) {
  /*--- 1. State ---*/
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: UserSummary | null;
  } | null>(null);

  /*--- 2. Handlers ---*/
  // 2.1. 선택 상태 변경 시 외부로 전달
  useEffect(() => {
    onSelectChange?.(selectedUuids);
  }, [selectedUuids, onSelectChange]);

  // 2.2. 선택 토글 함수
  const toggleSelection = (uuid: string) => {
    setSelectedUuids((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  // 2.3. 전체 선택/해제
  const toggleAll = () => {
    setSelectedUuids((prev) =>
      prev.length === users.length ? [] : users.map((u) => u.uuid)
    );
  };

  /*--- 3. Render ---*/
  return (
    <div className="relative overflow-x-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="w-8 px-2 py-2 border-b text-center">
              <input
                type="checkbox"
                checked={selectedUuids.length === users.length}
                onChange={toggleAll}
              />
            </th>
            <th className="px-4 py-2 text-left">이름</th>
            <th className="px-4 py-2 text-left">생년월일</th>
            <th className="px-4 py-2 text-left">전화번호</th>
            <th className="px-4 py-2 text-left">주소</th>
            <th className="px-4 py-2 text-left">회원 ID</th>
            <th className="py-2 px-4 border">교육원</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                회원이 없습니다.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.uuid}
                onClick={() => toggleSelection(user.uuid)} // 단일 클릭으로 선택
                onDoubleClick={() => onRowClick(user)} // 더블 클릭으로 상세
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, target: user }); // 우클릭 메뉴 열기
                }}
                className={`hover:bg-blue-50 cursor-pointer ${
                  selectedUuids.includes(user.uuid) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="text-center px-2 py-1 border">
                  <input
                    type="checkbox"
                    checked={selectedUuids.includes(user.uuid)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(user.uuid);
                    }}
                  />
                </td>
                <td className="px-4 py-2">{user.user_name}</td>
                <td className="px-4 py-2">{user.birth_date}</td>
                <td className="px-4 py-2">{user.phone_number}</td>
                <td className="px-4 py-2">{user.address || '-'}</td>
                <td className="px-4 py-2">{user.user_id || '-'}</td>
                <td className="py-2 px-4 border">
                  {user.latest_education_session
                    ? `${user.latest_education_session.education_center.center_name} ${user.latest_education_session.center_session}기`
                    : '미지정'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 컨텍스트 메뉴 렌더링 */}
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
