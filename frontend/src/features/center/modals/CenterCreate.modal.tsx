import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { createEducationCenter, fetchCenterByUuid, fetchEducationSessionByUuid } from '@/features/center/services/center.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AutoCompleteInput } from '@/components/ui/AutoCompleteInput';
import { useSelector } from 'react-redux';
import useAppDispatch from '@/hooks/useAppDispatch';
import { RootState } from '@/store';
import { fetchSessions } from '@/features/center/slices/educationCenterSlice';
import type { EducationCenterWriteForm } from '@/features/center/types/EducationCenter.type';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { CenterForm, centerSchema } from '@/validations/centerSchema';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { cn } from '@/libs/utils';


//----------------------------------------------------------------------//
interface CenterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (uuid: string) => void;
}

const centerFieldList: (keyof CenterForm)[] = [
  'center_tel', 'ceo_name', 'ceo_mobile',
  'manager_name', 'manager_mobile',
  'center_address', 'delivery_address',
  'unit_price',
];

const fieldLabels: Record<keyof CenterForm, string> = {
  center_name: '교육기관명',
  // center_session: '교육기수',
  center_tel: '교육기관 전화번호',
  ceo_name: '대표자 이름',
  ceo_mobile: '대표자 연락처',
  manager_name: '담당자 이름',
  manager_mobile: '담당자 연락처',
  center_address: '교육기관 주소',
  delivery_address: '배송 주소',
  unit_price: '단가',
  center_session: '교육기수',
};
//----------------------------------------------------------------------//


/* ----- Modal -------------------------------------------------------- */
export default function CenterCreateModal({ isOpen, onClose, onSuccess }: CenterCreateModalProps) {
  /* --- 1.states --- */
  const dispatch = useAppDispatch();
  const centersByName = useSelector((state: RootState) => state.educationCenter.centersByName);

  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedCenterSession, setSelectedCenterSession] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<CenterForm>({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      center_name: '',
      center_tel: '',
      ceo_name: '',
      ceo_mobile: '',
      manager_name: '',
      manager_mobile: '',
      center_address: '',
      delivery_address: '',
      unit_price: '',
      center_session: '',
    },
  });

  const nextSessionNumber = useMemo(() => {
    if (!selectedCenterName) return '1';  // 기본값
    const center = centersByName[selectedCenterName];
    if (!center || !center.center_session_list) return '1';

    const maxSession = center.center_session_list.reduce(
      (max, s) => (s.center_session > max ? s.center_session : max),
      0
    );
    const next = String(maxSession + 1);

    form.setValue('center_session', next);
    return next;
  }, [selectedCenterName, centersByName, form.setValue]);


  useEffect(() => {
    if (Object.keys(centersByName ?? {}).length === 0) {
      dispatch(fetchSessions());
    }
  }, [dispatch, centersByName]);

  /* --- 2.handlers --- */
  const handleSelectCenter = async (name: string) => {
    const matched = await fetchCenterByUuid(centersByName[name].uuid);
    if (matched) {
      const maxSession = matched.center_session_list?.reduce(
        (max, s) => (s.center_session > max ? s.center_session : max),
        0
      ) ?? 0;

      form.reset({
        center_name: matched.center_name,
        center_tel: matched.center_tel || '',
        ceo_name: matched.ceo_name || '',
        ceo_mobile: matched.ceo_mobile || '',
        manager_name: matched.manager_name || '',
        manager_mobile: matched.manager_mobile || '',
        center_address: matched.center_address || '',
        delivery_address:
          maxSession === 0 ? '' : matched.center_session_list[maxSession]?.delivery_address || '',
        unit_price:
          maxSession === 0 ? '' : String(matched.center_session_list[maxSession]?.unit_price) || '',
        center_session: String(maxSession + 1),
      });

      setSelectedCenterName(name);
      setSelectedCenterSession(null);
    }
  };

  const handleSubmit = async (values: CenterForm) => {
    try {
      setLoading(true);
      let finalForm: EducationCenterWriteForm = {
        uuid: '',
        center_name: values.center_name,
        center_tel: values.center_tel,
        ceo_name: values.ceo_name,
        ceo_mobile: values.ceo_mobile,
        manager_name: values.manager_name,
        manager_mobile: values.manager_mobile,
        center_address: values.center_address,
        delivery_address: values.delivery_address,
        center_session: values.center_session,
      };

      if (selectedCenterName && !selectedCenterSession) {
        const matched = await fetchCenterByUuid(selectedCenterName);
        const maxSession = matched.center_session_list?.reduce(
          (max, s) => (s.center_session > max ? s.center_session : max),
          0
        ) ?? 0;
        finalForm.center_session = String(maxSession + 1);
      }

      const res = await createEducationCenter(finalForm);
      dispatch(fetchSessions());
      onSuccess(res.uuid);
      onClose();
    } catch (err) {
      console.error('등록 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  /* --- 3.Render --- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>교육기관 등록</DialogTitle>
        </DialogHeader>

        {/* Form 시작 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* 1. 조회 영역 */}
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🔍 기존 교육기관/기수 선택</h3>

              <FormField
                control={form.control}
                name="center_name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2 mb-2">
                    <Label className="text-right">교육기관명</Label>
                    <div className="col-span-2">
                      <AutoCompleteInput
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                        onSelect={handleSelectCenter}
                        onCreateNew={(name) => {
                          if (Object.keys(centersByName).includes(name)) return;
                          
                          setSelectedCenterName(name);
                          form.setValue('center_name', name);
                          form.setValue('center_session', '1');
                          form.setValue('center_tel', '');
                          form.setValue('ceo_name', '');
                          form.setValue('ceo_mobile', '');
                          form.setValue('manager_name', '');
                          form.setValue('manager_mobile', '');
                          form.setValue('center_address', '');
                          form.setValue('delivery_address', '');
                          form.setValue('unit_price', '');
                        }}
                        options={Object.keys(centersByName)}
                        placeholder="교육기관명 입력 또는 선택"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* 2. 입력 영역 */}
            <div className="border rounded-md p-4 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">✍️ 새 교육기수 정보 입력</h3>
              
              {/* 교육기관명 + 교육기수 (read-only) */}
              <div
                className={cn(
                  'grid grid-cols-3 items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden',
                  selectedCenterName ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                )}
              >
                <Label className="text-right">등록될 교육기관</Label>
                <div className="col-span-2 text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded border">
                  {selectedCenterName}_{form.watch('center_session') || nextSessionNumber}기
                </div>
              </div>

            {centerFieldList.map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-2 mb-2">
                      <Label>{fieldLabels[fieldName]}</Label>
                      <div className="col-span-2">
                        <FormControl>
                          <Input id={fieldName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* 3. 버튼 */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '등록 중...' : '등록'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
