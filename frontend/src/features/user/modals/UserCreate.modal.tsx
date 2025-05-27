import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { createUser } from '@/features/user/services/user.api';
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

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const fieldLabels: Record<keyof UserWriteForm, string> = {
  user_id: '회원 ID',
  user_name: '이름',
  birth_date: '생년월일',
  phone_number: '전화번호',
  postal_code: '우편번호',
  address: '주소',
  photo: '사진',
  education_session: '교육기수',
};

export default function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
  const dispatch = useAppDispatch();
  const centersByName = useSelector((state: RootState) => state.educationCenter.centersByName);
  const sessionList = useSelector((state: RootState) => state.educationCenter.sessions);

  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedSession, setSelectedSession] = useState<EducationCenterSessionSummary | null>(null);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);


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

  useEffect(() => {
    if (Object.keys(centersByName ?? {}).length === 0) {
      dispatch(fetchSessions());
    }
  }, [dispatch, centersByName]);

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
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">🏫 교육기관 정보</h3>
                <CenterSelect
                  editMode={true}
                  selectedCenterName={selectedCenterName}
                  setSelectedCenterName={setSelectedCenterName}
                  selectedSession={selectedSession}
                  setSelectedSession={setSelectedSession}
                  sessionList={useSelector((state: RootState) => state.educationCenter.sessions)}
                  onOpenCreateModal={() => setIsCenterModalOpen(true)}
                />
              </div>

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
            </div>
            <Button type="submit" className="w-full">
              등록
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}