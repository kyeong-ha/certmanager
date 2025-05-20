import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InputBlock from '@/components/ui/InputBlock';
import UserFormBlock from '@/features/user/components/UserFormBlock';
import CenterSelect from '@/features/center/components/CenterSelect';
import FileInputBlock from '@/components/FileInputBlock';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';
import { UserWriteForm } from '@/features/user/types/User.type';
import { createCertificate } from '@/features/certificate/services/cert.api';
import { CertificateSummary, CertificateDetail } from '../types/Certificate.type';
import CenterCreateModal from '@/features/center/modals/CenterCreate.modal';

interface CertificateCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cert: CertificateDetail) => void;
}

export default function CertificateCreateModal({ isOpen, onClose, onSuccess }: CertificateCreateModalProps) {
  const sessionList = useSelector((state: RootState) => state.educationCenter.sessions);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [writeData, setWriteData] = useState({
    issue_number: '',
    issue_date: '',
    course_name: '',
    delivery_address: '',
    tracking_number: '',
    copy_file: null,
    user: {
      user_id: '',
      user_name: '',
      birth_date: '',
      phone_number: '',
      postal_code: '',
      address: '',
      photo: null,
    } as UserWriteForm,
    education_session_uuid: ''
  });

  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedSession, setSelectedSession] = useState<EducationCenterSessionSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setWriteData((prev) => ({
      ...prev,
      education_session_uuid: selectedSession?.uuid || '',
    }));
  }, [selectedSession]);

  

  const handleChangeCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWriteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWriteData((prev) => ({ ...prev, user: { ...prev.user, [name]: value } }));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

  if (name === 'photo') {
      setWriteData((prev) => ({ ...prev, user: { ...prev.user, photo: files[0] } }));
    }
  };

  const handleSave = async () => {
    // 저장 전 유효성 검사
    if (!selectedSession) {
      alert('교육기관 기수를 선택해주세요.');
      return;
    }
    if (!writeData.issue_number || !writeData.issue_date || !writeData.course_name || !writeData.user.user_name) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();

      formDataObj.append('issue_number', writeData.issue_number);
      formDataObj.append('issue_date', writeData.issue_date);
      formDataObj.append('course_name', writeData.course_name);
      formDataObj.append('tracking_number', writeData.tracking_number ?? '');
      formDataObj.append('delivery_address', writeData.delivery_address ?? '');

      formDataObj.append('user', JSON.stringify(writeData.user));
      formDataObj.append('education_session', selectedSession.uuid);

      const res = await createCertificate(formDataObj);
      onSuccess(res);
      console.log('등록 성공', res);
      onClose();
    } catch (err) {
      alert('등록 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl overflow-hidden">
        <DialogHeader className="bg-white p-3 border-b">
          <DialogTitle className="text-xl font-semibold">자격증 등록</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">새로운 자격증 정보를 입력하세요.</DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">👤 사용자 정보</h3>
            <UserFormBlock user={writeData.user} onChange={handleChangeUser} editable={true} />
            <FileInputBlock label="프로필 사진 (JPG/PNG)" name="photo" accept="image/*" onChange={handleChangeFile} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">🎖️ 자격증 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputBlock label="발급번호" name="issue_number" value={writeData.issue_number} onChange={handleChangeCert} editable={true} />
              <InputBlock label="발급일자" name="issue_date" type="date" value={writeData.issue_date} onChange={handleChangeCert} editable={true} />
              <InputBlock label="자격과정" name="course_name" value={writeData.course_name} onChange={handleChangeCert} editable={true} />
              <InputBlock label="운송장번호" name="tracking_number" value={writeData.tracking_number} onChange={handleChangeCert} editable={true} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">🏫 교육기관 정보</h3>
            <CenterSelect
              editMode={true}
              selectedCenterName={selectedCenterName}
              setSelectedCenterName={setSelectedCenterName}
              selectedSession={selectedSession}
              setSelectedSession={setSelectedSession}
              sessionList={sessionList}
              onOpenCreateModal={() => {}}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSubmitting}>저장</Button>
          </div>
        </div>
      </DialogContent>

      {/* 교육기관 등록 모달 */}
      <CenterCreateModal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        onSuccess={(newUuid) => {
          setIsCenterModalOpen(false);
          const session = sessionList.find((s) => s.uuid === newUuid);
          if (!session) return;
          setSelectedCenterName(session.education_center.center_name);
          setSelectedSession(session);
        }}
      />
    </Dialog>
  );
}