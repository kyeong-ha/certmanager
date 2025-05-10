import React from 'react';
import { User } from '@/features/user/types/User.type';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const UserModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">회원정보 - {user.user_name}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
        </div>

        <p className="text-sm mb-4 text-gray-600">생년월일: {user.birth_date} / 연락처: {user.phone_number}</p>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 border">자격과정</th>
              <th className="py-2 border">발급번호</th>
              <th className="py-2 border">발급일자</th>
              <th className="py-2 border">교육기관</th>
            </tr>
          </thead>
          <tbody>
          {user.certificates.map(cert => (
              <tr key={cert.uuid}> 
                <td className="py-2 text-center border">{cert.course_name}</td>
                <td className="py-2 text-center border">{cert.issue_number}</td>
                <td className="py-2 text-center border">{cert.issue_date}</td>
                <td className="py-2 text-center border">{cert.education_center?.edu_name || null} {cert.education_center?.session || null}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
