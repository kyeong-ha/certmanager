import { useState, useEffect } from 'react';
import { UserDetail } from '@/features/user/types/User.type';
import { updateUser, deleteUser } from '@/features/user/services/user.api';
import { UserWriteForm } from '@/features/user/types/User.type';
import InputField from '@/components/ui/InputField';

//----------------------------------------------------------------------//
interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail;
}
//----------------------------------------------------------------------//


/* ----- Modal -------------------------------------------------------- */
const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
  const [form, setForm] = useState<UserWriteForm>({ user_id: '', user_name: '', birth_date: '', phone_number: '', postal_code: '', address: '', photo: '' });

  // User Data 가 바뀔 때마다 form 동기화
  useEffect(() => {
    if (user) {
      setForm({ user_id: user.user_id, user_name: user.user_name, birth_date: user.birth_date, phone_number: user.phone_number, postal_code: user.postal_code, address: user.address, photo: user.photo });
    }
  }, [user]);

  /* --- 1. Handlers --- */
  // 1.1. 모달 닫기
  if (!isOpen) return null;

  // 1.2. 회원정보 수정
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 1.3. 회원정보 저장
  const handleSave = async () => {
    await updateUser(user.uuid, form);
    alert('회원 정보가 수정되었습니다.');
    onClose();
  };

  // 1.4. 회원정보 삭제
  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      await deleteUser(user.uuid);
      alert('회원이 삭제되었습니다.');
      onClose();
    }
  };


  /* --- 2. Render --- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg">
        
        {/* 2.1. 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">회원정보 - {user.user_name}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
        </div>

        {/* 2.2. 회원 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InputField label="회원 ID" name="user_id" value={form.user_id || ''} onChange={handleChange} />
          <InputField label="이름" name="user_name" value={form.user_name} onChange={handleChange} />
          <InputField label="생년월일" name="birth_date" value={form.birth_date} onChange={handleChange} type="date" />
          <InputField label="전화번호" name="phone_number" value={form.phone_number} onChange={handleChange} />
          <InputField label="우편번호" name="postal_code" value={form.postal_code} onChange={handleChange} />
          <InputField label="주소" name="address" value={form.address} onChange={handleChange} />
        </div>

        {/* 2.3. 자격증 발급내역 */}
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
          {user.certificates && user.certificates.length > 0 ? (
              user.certificates.map((cert) => (
              <tr key={cert.uuid}> 
                <td className="py-2 text-center border">{cert.course_name}</td>
                <td className="py-2 text-center border">{cert.issue_number}</td>
                <td className="py-2 text-center border">{cert.issue_date}</td>
                <td className="py-2 text-center border">
                    {cert.center_name || ''} {cert.center_session || ''}
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">자격증 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* 2.4. 하단 버튼 영역 */}
        <div className="mt-6 flex justify-between items-center">
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            회원 삭제
          </button>
          <div>
            <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">
              닫기
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;