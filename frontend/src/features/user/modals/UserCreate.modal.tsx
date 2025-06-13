import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { createUser, fetchUserByPhone  } from '@/features/user/services/user.api';
import { AutoCompleteInput } from '@/components/ui/AutoCompleteInput';
import { useSelector } from 'react-redux';
import useAppDispatch from '@/hooks/useAppDispatch';
import { fetchSessions } from '@/features/center/slices/educationCenterSlice';
import { RootState } from '@/store';
import { fetchCenterByUuid } from '@/features/center/services/center.api';
import type { UserWriteForm } from '@/features/user/types/User.type';
import { cn } from '@/libs/utils';
import { useEffect, useState } from 'react';
import CenterSelect from '@/features/center/components/CenterSelect';
import CenterCreateModal from '@/features/center/modals/CenterCreate.modal';
import { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';
import BulkExcelImport from '@/components/BulkExcelImport';
import { fetchAllEducationSession, fetchAllCenter, createEducationCenter, createEducationSession } from '@/features/center/services/center.api';
import { EducationCenterSummary } from '@/features/center/types/EducationCenter.type';
import { normalizeDate } from '@/utils/normalizeDate';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const fieldLabels: Record<keyof UserWriteForm, string> = {
  user_id: '회원ID(선택)',
  user_name: '이름',
  birth_date: '생년월일',
  phone_number: '전화번호',
  postal_code: '우편번호(선택)',
  address: '주소(선택)',
  photo: '사진',
  education_session: '교육원명 (예시: 한국교육원_1기)',
};

export default function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
  const dispatch = useAppDispatch();

  // 센터·세션 리스트
  const [centers, setCenters]   = useState<EducationCenterSummary[]>([]);
  const [sessions, setSessions] = useState<EducationCenterSessionSummary[]>([]);


  // Bulk 모드 상태
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkData, setBulkData]     = useState<any[]>([]);

  // 개별 모드 상태
  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedSession, setSelectedSession] = useState<EducationCenterSessionSummary | null>(null);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);

  // react-hook-form 설정
  const form = useForm<UserWriteForm>({
    defaultValues: {
      user_id: '',
      user_name: '',
      birth_date: '',
      phone_number: '',
      postal_code: '',
      address: '',
      photo: null,
    },
  });

  // 초기 데이터 로드
  useEffect(() => {
    fetchAllCenter().then(setCenters);
    fetchAllEducationSession().then(setSessions);
    dispatch(fetchSessions());
  }, [dispatch]);

  // 일괄 등록 핸들러
  const handleBulkCreate = async () => {
    try {
      let successCount = 0;
      const failedRows: string[] = [];

      // 최신 센터/세션 재조회
      let currentCenters = await fetchAllCenter();
      let currentSessions = await fetchAllEducationSession();

      for (let i = 0; i < bulkData.length; i++) {
        const row = bulkData[i];
        
        try {
          // "교육원명" 파싱
          const full = row['교육원명 (예시: 한국교육원_1기)'];
          const [centerName, sessionLabel] = full.split('_');
          const sessionNum = parseInt(sessionLabel.replace('기',''), 10);

          // 2) 교육원 조회
          let center = centers.find(c => c.center_name === centerName);
          if (!center) {
            // 2-1) 교육원이 없으면 신규 생성
            center = await createEducationCenter({
              uuid: '',
              center_name: centerName,
              center_tel: '',
              ceo_name: '', ceo_mobile: '',
              manager_name: '', manager_mobile: '',
              center_address: '', delivery_address: '',
              center_session: String(sessionNum) // 생성 시 첫 기수로 설정
            });
            currentCenters = await fetchAllCenter();
            currentSessions = await fetchAllEducationSession();
          }

          // 3) 교육기수 조회
          let session = sessions.find(s =>
            s.education_center.center_name === centerName &&
            s.center_session === sessionNum
          );
          if (!session) {
            // 3-1) 교육기수가 없으면 신규 생성
            session = await createEducationSession({
              uuid: '',
              education_center_uuid: center.uuid,
              center_session: sessionNum,
              unit_price: 0,
              delivery_address: '',
            });
            currentSessions = await fetchAllEducationSession();
          }

          // 4) 사용자 확인/생성
          const phone = row['전화번호'];

          let user = await fetchUserByPhone(phone);
          if (!user) {
            const userPayload: UserWriteForm = {
              user_id: row['회원 ID(선택)'] || '',
              user_name: row['이름'],
              birth_date: normalizeDate(row['생년월일']) || '',
              phone_number: row['전화번호'],
              postal_code: row['우편번호(선택)']  || '',
              address: row['주소(선택)'] || '',
              photo: null,
              education_session: [session.uuid],
            };
            user = await createUser(userPayload as any);
            if (!user || !user.uuid) throw new Error('등록 응답 없음');
            successCount++;
          }
        } catch (innerErr) {
          failedRows.push(row['전화번호'] || row['이름'] || `Row ${i + 1}`);
        }
      }
      alert(`✅ 총 ${successCount}건 등록 완료\n❌ 실패한 건수: ${failedRows.length}\n${failedRows.join(', ')}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`일괄 등록 중 오류: ${err.message}`);
    }
  };

  // 개별 등록 핸들러
  const handleSubmit = async (values: UserWriteForm) => {
    try {
      if (!selectedSession) {
        alert('교육기관 및 기수를 선택해주세요.');
        return;
      }

      const fullPayload = {
        ...values,
        education_session: [selectedSession.uuid],
      };

      await createUser(fullPayload as any);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('회원 등록 실패:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="user-create-desc">
        <DialogHeader>
          <DialogTitle>회원 등록</DialogTitle>
          <DialogDescription id="user-create-desc">
            새 회원 정보를 입력하고, 교육기관 및 기수를 선택하세요.
          </DialogDescription>
        </DialogHeader>

        {/* 모드 토글 */}
        <div className="mb-4 flex space-x-6 px-4">
          <label className="flex items-center">
            <input type="radio" checked={!isBulkMode} onChange={() => setIsBulkMode(false)} />
            <span className="ml-2">개별 등록</span>
          </label>
          <label className="flex items-center">
            <input type="radio" checked={isBulkMode} onChange={() => setIsBulkMode(true)} />
            <span className="ml-2">엑셀 일괄 등록</span>
          </label>
        </div>

        {isBulkMode ? (
          <>
            {/* 템플릿 다운로드 */}
            <div className="flex justify-end mb-2 px-4">
              <a href="/templates/user-template.xlsx" download className="text-sm text-blue-600 hover:underline">
                ▶ 회원 템플릿 다운로드
              </a>
            </div>
            {/* 엑셀 업로드 & 그리드 */}
            <div className="px-4">
              <BulkExcelImport onDataLoaded={setBulkData} />
            </div>
            {/* 일괄 등록 버튼 */}
            <div className="px-4 mt-4">
              <Button onClick={handleBulkCreate} className="w-full">
                일괄 등록하기
              </Button>
            </div>
          </>
        ) : (
          /* 기존 개별 등록 폼 */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

              {/* 사용자 입력 필드 */}
              {(Object.keys(fieldLabels).filter((k) => k !== 'education_session') as (keyof UserWriteForm)[]).map((key) => {
                if (key === 'photo') {
                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={() => (
                        <FormItem className="grid grid-cols-3 items-center gap-2">
                          <Label className="text-right">{fieldLabels[key]}</Label>
                          <div className="col-span-2">
                            <FormControl>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => form.setValue('photo', e.target.files?.[0] || null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  );
                } else {
                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-2">
                          <Label className="text-right">{fieldLabels[key]}</Label>
                          <div className="col-span-2">
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  );
                }
              })}

              {/* 교육기관 선택 영역 */}
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">🏫 교육기관 정보</h3>
                <CenterSelect
                  editMode={true}
                  selectedCenterName={selectedCenterName}
                  setSelectedCenterName={setSelectedCenterName}
                  selectedSession={selectedSession}
                  setSelectedSession={setSelectedSession}
                  sessionList={sessions}
                  onOpenCreateModal={() => setIsCenterModalOpen(true)}
                />
              </div>
              <Button type="submit" className="w-full">
                등록
              </Button>
            </form>
          </Form>
        )}

        {/* 교육기관 등록 모달 */}
        <CenterCreateModal
          isOpen={isCenterModalOpen}
          onClose={() => setIsCenterModalOpen(false)}
          onSuccess={(newUuid) => {
            setIsCenterModalOpen(false);
            const session = sessions.find((s) => s.uuid === newUuid);
            if (!session) return;
            setSelectedCenterName(session.education_center.center_name);
            setSelectedSession(session);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}