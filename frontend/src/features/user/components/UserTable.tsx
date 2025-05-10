import React from 'react';
import { User } from '../types/User.type';

interface UserTableProps {
  users: User[];
  onRowClick: (user: User) => void;
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
