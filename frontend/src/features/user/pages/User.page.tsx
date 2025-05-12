import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { User } from '../types/User.type';
import { fetchAllUser } from '../services/user.api';
import MainLayout from '@/layout/MainLayout';
import UserTable from '../components/UserTable';
import UserDetailModal from '../modals/UserDetail.modal';

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [targetUser, setTargetUser] = useState<User | null>(null);

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

  /* 2.Render */
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">회원관리</h1>

        {/* 2.1. 검색창 */}
        <Input
          placeholder="이름 또는 전화번호로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 max-w-md"
        />

        {/* 2.2. 검색결과 Table */}
        <UserTable users={filteredUsers} onRowClick={setTargetUser} />

        {/* 2.3. 회원 상세정보 Modal */}
        {targetUser && (
          <UserDetailModal isOpen={targetUser !== null} onClose={() => setTargetUser(null)} user={targetUser} />
        )}
      </div>
    </MainLayout>
  );
}