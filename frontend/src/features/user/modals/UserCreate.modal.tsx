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

  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedCenterSession, setSelectedCenterSession] = useState<number | null>(null);

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
      const center = centersByName[selectedCenterName];
      const session =
        center && Array.isArray(center.center_session_list)
          ? center.center_session_list.find(
              (s) => s.center_session === selectedCenterSession
            )
          : undefined;

      const fullPayload = {
        ...values,
        education_session: session ? [session.uuid] : [],
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
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🔍 교육기관/기수 선택</h3>

              <FormItem className="grid grid-cols-3 items-center gap-2 mb-2">
                <Label className="text-right">교육기관명</Label>
                <div className="col-span-2">
                  <AutoCompleteInput
                    value={selectedCenterName}
                    onChange={setSelectedCenterName}
                    onSelect={(name) => {
                      setSelectedCenterName(name);
                      setSelectedCenterSession(null);
                    }}
                    onCreateNew={(value: string) => {
                      setSelectedCenterName(value);
                    }}
                    options={Object.keys(centersByName)}
                    placeholder="교육기관명 입력 또는 선택"
                  />
                </div>
              </FormItem>

              {selectedCenterName && (
                <FormItem className="grid grid-cols-3 items-center gap-2 mb-2">
                  <Label className="text-right">교육기수</Label>
                  <div className="col-span-2">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={selectedCenterSession ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCenterSession(val ? Number(val) : null);
                      }}
                    >
                      <option value="">기수 선택</option>
                      {Array.from(
                        new Map(
                          (centersByName[selectedCenterName]?.center_session_list || []).map((s) => [
                            s.center_session,
                            s
                          ])
                        ).values()
                      ).map((s) => (
                        <option key={s.uuid} value={s.center_session}>{s.center_session}기</option>
                      ))}
                    </select>
                  </div>
                </FormItem>
              )}
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