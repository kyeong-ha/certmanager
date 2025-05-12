import { UserSearchForm } from '@/features/user/types/UserSearchForm.type';

interface UserTableProps {
  users: UserSearchForm[];
  onRowClick: (user: UserSearchForm) => void;
}

export default function UserTable({ users, onRowClick }: UserTableProps) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
        <thead className="bg-gray-100">
          <tr>
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
              <td colSpan={5} className="text-center py-6 text-gray-500">
                회원이 없습니다.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.uuid}
                onClick={() => onRowClick(user)}
                className="hover:bg-blue-50 cursor-pointer"
              >
                <td className="px-4 py-2">{user.user_name}</td>
                <td className="px-4 py-2">{user.birth_date}</td>
                <td className="px-4 py-2">{user.phone_number}</td>
                <td className="px-4 py-2">{user.address || '-'}</td>
                <td className="px-4 py-2">{user.user_id || '-'}</td>
                <td className="py-2 px-4 border">
                  {user.latest_education_session ? `${user.latest_education_session?.education_center.center_name ?? ''} ${user.latest_education_session.center_session ?? ''}` : '미지정'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
