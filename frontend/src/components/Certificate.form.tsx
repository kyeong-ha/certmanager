import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Certificate } from '@/types/Certificate.type';
import { EducationCenter } from '@/types/EducationCenter.type';
import { fetchCertificateById, createCertificate, updateCertificate } from '../services/certificate.api';
import { fetchEducationCenters, createEducationCenter } from '../services/educationCenter.api';
import { convertCertificateToFormData } from '../utils/convertFormData';
import AddEducationCenterModal from './AddEducationCenterModal';

interface Props {
  certificateId?: string;
}

const defaultForm: Certificate = {
  user_name: '',
  phone_number: '',
  birth_date: '',
  postal_code: undefined,
  address: '',
  note: '',
  course_name: '',
  issue_number: '',
  issue_date: '',
  issue_type: '',
  education_center: null,
  image_file: undefined,
  reissue_logs: [],
};

const CertificateForm = ({ certificateId }: Props) => {
  const [form, setForm] = useState<Certificate>(defaultForm);
  const [centers, setCenters] = useState<EducationCenter[]>([]);
  const [showAddCenterModal, setShowAddCenterModal] = useState(false);

  useEffect(() => {
    fetchEducationCenters().then(setCenters);
    if (certificateId) {
      fetchCertificateById(certificateId).then((res) => {
        setForm({
          ...res,
          education_center: res.education_center ?? null,
        });
      });
    }
  }, [certificateId]);

  const handleChange = (field: keyof Certificate, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      form.issue_type = form.issue_number.match('HS') ? 'HS' : 'HN';
      if(form.education_center==null || undefined){
      }  
      const formData = convertCertificateToFormData(form);
      await (certificateId
        ? updateCertificate(Number(certificateId), formData)
        : createCertificate(formData));
      alert('저장 완료');
    } catch (e) {
      console.error(e);
      alert('에러 발생');
    }
  };

  const handleNewCenter = async (center: EducationCenter, updatedList: EducationCenter[]) => {
    try {
      setCenters(updatedList);
      setForm(prev => ({ ...prev, education_center: center }));
      setShowAddCenterModal(false);
    } catch (err) {
      alert('교육기관 추가에 실패했습니다.');
    }
  };

  const educationOptions = centers.map((center) => ({
    value: center.id,
    label: `${center.name}${center.session? `_${center.session}` : ''}`,
  }));

  return (
    <form className="p-6 max-w-xl mx-auto space-y-4 bg-white shadow-md rounded-lg" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <h2 className="text-2xl font-bold mb-4 text-center">
        {certificateId ? '자격증 수정' : '자격증 등록'}
      </h2>

      <input className="w-full p-2 border rounded" value={form.user_name} onChange={(e) => handleChange('user_name', e.target.value)} placeholder="이름" required />
      <input className="w-full p-2 border rounded" value={form.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} placeholder="전화번호" required />

      <label htmlFor="birth-date" className="block font-semibold">생년월일</label>
      <input
        id="birth-date"
        type="date"
        className="w-full p-2 border rounded"
        value={form.birth_date}
        onChange={(e) => handleChange('birth_date', e.target.value)}
        required
      />

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
        placeholder="교육기관을 검색하고 선택하세요"
        value={
          form.education_center
          ? {
            value: form.education_center.id ?? 0,
            label: `${form.education_center.name}${form.education_center.session ? `_${form.education_center.session}` : ''}`,
          }
          : null
        }
        onChange={(selected) => {
          const selectedCenter = centers.find((c) => c.id === selected?.value) || 0;
          handleChange('education_center', selectedCenter);
        }}
      />

      <button
        type="button"
        className="text-blue-600 text-sm underline"
        onClick={() => setShowAddCenterModal(true)}
      >
        새 교육기관 등록</button>

      <input
        className="w-full p-2 border rounded"
        value={form.postal_code?.toString() ?? ''}
        onChange={(e) => handleChange('postal_code', Number(e.target.value))}
        placeholder="우편번호"
      />
      <input className="w-full p-2 border rounded" value={form.address ?? ''} onChange={e => handleChange('address', e.target.value)} placeholder="주소" />

      <label htmlFor="image-upload" className="block font-semibold">이미지 업로드</label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="w-full"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            handleChange('image_file', file);
          }
        }}
      />

      <input className="w-full p-2 border rounded" value={form.note ?? ''} onChange={e => handleChange('note', e.target.value)} placeholder="비고" />

      <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">
        저장
      </button>

      <AddEducationCenterModal
        open={showAddCenterModal}
        onClose={() => setShowAddCenterModal(false)}
        onSubmit={handleNewCenter}
      />
    </form>
  );
};

export default CertificateForm;
