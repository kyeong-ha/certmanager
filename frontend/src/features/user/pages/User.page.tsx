import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { UserDetail, UserSummary } from '@/features/user/types/User.type';
import { fetchAllUser, fetchUserByUuid, deleteUser } from '../services/user.api';
import MainLayout from '@/layout/MainLayout';
import UserTable from '../components/UserTable';
import UserDetailModal from '../modals/UserDetail.modal';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import UserCreateModal from '../modals/UserCreate.modal';

export default function UserPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [search, setSearch] = useState('');
  const [targetUser, setTargetUser] = useState<UserDetail | null>(null);
  const [selectedUserUuids, setSelectedUserUuids] = useState<string[]>([]); // 선택된 사용자 UUID
  const [isUserCreateModalOpen, setIsUserCreateModalOpen] = useState(false);

  /* 1.Handlers */
  // 1.1. 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchAllUser();
      setUsers(response);
    };
    fetchUsers();
  }, []);

  // 1.2. 필터링된 사용자 목록
  const filteredUsers = users.filter((user) =>
    user.user_name.toLowerCase().includes(search.toLowerCase()) ||
    user.phone_number?.includes(search)
  );

  const handleDeleteUsers = async () => {
    if (selectedUserUuids.length === 0) return;
    if (!confirm(`${selectedUserUuids.length}명의 사용자를 삭제하시겠습니까?`)) return;

    try {
      await deleteUser(selectedUserUuids);
      toast.success(`✅ ${selectedUserUuids.length}명 사용자 삭제 완료`);
      const updated = await fetchAllUser();
      setUsers(updated);
      setSelectedUserUuids([]);
    } catch (error) {
      toast.error('❌ 사용자 삭제 실패');
    }
  };


  /* 2.Render */
  return (
    <MainLayout>
      <div className="p-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🔍 회원검색</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsUserCreateModalOpen(true)}>+ 새 회원 추가</Button>
          </div>
        </div>


        {/* 2.1. 검색창 */}
        <Input
          placeholder="이름 또는 전화번호로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 max-w-md"
        />

        {/* 2.1.1. 선택된 사용자 삭제 버튼 */}
        {selectedUserUuids.length > 0 && (
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md border border-gray-300 mb-4">
            <span className="text-sm text-gray-700">
              ✅ <strong>{selectedUserUuids.length}</strong>명 선택됨
            </span>
            <Button
              onClick={handleDeleteUsers}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 size={16} />
              선택 삭제
            </Button>
          </div>
        )}

        {/* 2.2. 검색결과 Table */}
        <UserTable 
          users={filteredUsers}
          onSelectChange={setSelectedUserUuids}
          onRowClick={async (userSearch) => {
            // targetUser의 상세정보만 fetch 후 set
            const data = await fetchUserByUuid(userSearch.uuid);
            setTargetUser(data);
          }}
            onContextSelect={async (action, user) => {
              if (action === '상세보기') {
                const data = await fetchUserByUuid(user.uuid);
                setTargetUser(data);
              }
              if (action === '삭제하기') {
                const confirmed = confirm(`"${user.user_name}" 회원을 삭제하시겠습니까?`);
                if (!confirmed) return;
                await deleteUser([user.uuid]);
                toast.success(`"${user.user_name}" 삭제 완료 ✅`);
                const updated = await fetchAllUser();
                setUsers(updated);
                setSelectedUserUuids((prev) => prev.filter((uuid) => uuid !== user.uuid));
              }
            }}
          />

        {/* 2.3. 회원 상세정보 Modal */}
        {targetUser && (
          <UserDetailModal isOpen={targetUser !== null} onClose={() => setTargetUser(null)} user={targetUser} />
        )}

        <UserCreateModal
          isOpen={isUserCreateModalOpen}
          onClose={() => setIsUserCreateModalOpen(false)}
          onSuccess={async () => {
            const updated = await fetchAllUser();
            setUsers(updated);
          }}
        />
      </div>
    </MainLayout>
  );
}