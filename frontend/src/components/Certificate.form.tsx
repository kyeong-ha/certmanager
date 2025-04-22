import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Certificate } from '@/types/Certificate.type';
import { EducationCenter } from '@/types/EducationCenter.type';
import { fetchCertificateByUuid, createCertificate, updateCertificate } from '../services/cert.api';
import { fetchEducationCenters } from '../services/edu.api';
import { convertCertificateToFormData } from '../utils/convertFormData';
import AddEducationCenterModal from './AddEducationCenterModal';
import UserFormModal from './UserForm.model';
import ReissueLogModal from './Reissue.modal';
import { createDefaultCertificate } from '@/utils/defaultForm';

interface Props {
  issue_number?: string;
}

const CertificateForm = ({ issue_number }: Props) => {
  const [form, setForm] = useState<Certificate>(createDefaultCertificate());
  const [centers, setCenters] = useState<EducationCenter[]>([]);
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [showAddCenterModal, setShowAddCenterModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showReissueModal, setShowReissueModal] = useState(false);

  useEffect(() => {
    fetchEducationCenters().then(setCenters);
    if (issue_number) {
      fetchCertificateByUuid(issue_number).then((res) => {
        setForm({ ...res, education_center: res.education_center ?? null });
      });
    }
  }, [issue_number]);

  const handleChange = (field: keyof Certificate, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUserChange = (field: keyof Certificate['user'], value: any) => {
    setForm(prev => ({
      ...prev,
      user: { ...prev.user, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = convertCertificateToFormData(form, imageUrl);
      await (issue_number
        ? updateCertificate(form.issue_number, form)
        : createCertificate(formData));
      alert('저장 완료');
    } catch (e) {
      console.error(e);
      alert('에러 발생');
    }
  };

  const educationOptions = centers.map((center) => ({
    value: center.uuid,
    label: `${center.edu_name}${center.session ? `_${center.session}` : ''}`,
  }));

  return (
    <form className="p-6 max-w-xl mx-auto space-y-4 bg-white shadow-md rounded-lg" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <h2 className="text-2xl font-bold mb-4 text-center">
        {issue_number ? '자격증 수정' : '자격증 등록'}
      </h2>

      <input className="w-full p-2 border rounded" value={form.user.user_name} onChange={(e) => handleUserChange('user_name', e.target.value)} placeholder="이름" required />
      <input className="w-full p-2 border rounded" value={form.user.phone_number} onChange={(e) => handleUserChange('phone_number', e.target.value)} placeholder="전화번호" required />

      <label htmlFor="birth-date" className="block font-semibold">생년월일</label>
      <input
        id="birth-date"
        type="date"
        className="w-full p-2 border rounded"
        value={form.user.birth_date}
        onChange={(e) => handleUserChange('birth_date', e.target.value)}
        required
      />

      <button type="button" className="text-blue-600 text-sm underline" onClick={() => setShowUserModal(true)}>
        회원 정보 상세 수정
      </button>

      <input className="w-full p-2 border rounded" value={form.course_name} onChange={(e) => handleChange('course_name', e.target.value)} placeholder="자격과정" required />
      <input className="w-full p-2 border rounded" value={form.issue_number} onChange={(e) => handleChange('issue_number', e.target.value)} placeholder="발급번호" required />

      <label htmlFor="issue-date" className="block font-semibold">발급일자</label>
      <input
        id="issue-date"
        type="date"
        className="w-full p-2 border rounded"
        value={form.issue_date}
        onChange={(e) => handleChange('issue_date', e.target.value)}
        required
      />

      <label htmlFor="education-center-select" className="block font-semibold">교육기관</label>
      <Select
        inputId="education-center-select"
        options={educationOptions}
        isClearable
        placeholder="교육기관 선택"
        value={
          form.education_center
            ? {
                value: form.education_center.uuid,
                label: `${form.education_center.edu_name}${form.education_center.session ? `_${form.education_center.session}` : ''}`
              }
            : null
        }
        onChange={(selected) => {
          const selectedCenter = centers.find(c => c.uuid === selected?.value) || null;
          handleChange('education_center', selectedCenter);
        }}
      />

      <button type="button" className="text-blue-600 text-sm underline" onClick={() => setShowAddCenterModal(true)}>
        새 교육기관 등록
      </button>

      <label htmlFor="image-upload" className="block font-semibold">이미지 업로드</label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="w-full"
        onChange={e => setImageUrl(e.target.files?.[0] || null)}
      />

      <button type="button" className="text-blue-600 text-sm underline" onClick={() => setShowReissueModal(true)}>
        재발급 내역 수정
      </button>

      <input className="w-full p-2 border rounded" value={form.note ?? ''} onChange={(e) => handleChange('note', e.target.value)} placeholder="비고" />

      <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">
        저장
      </button>

      <AddEducationCenterModal
        open={showAddCenterModal}
        onClose={() => setShowAddCenterModal(false)}
        onSubmit={(center, list) => {
          setForm(prev => ({ ...prev, education_center: center }));
          setCenters(list);
        }}
      />

      <UserFormModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={form.user}
        onChange={(updatedUser) => setForm(prev => ({ ...prev, user: updatedUser }))}
      />

      <ReissueLogModal
        isOpen={showReissueModal}
        onClose={() => setShowReissueModal(false)}
        certificate={form}
      />
    </form>
  );
};

export default CertificateForm;
