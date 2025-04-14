import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { createEducationCenter } from '../services/educationCenter.api';
import { EducationCenter } from '../types/EducationCenter.type';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, '교육기관명을 입력하세요'),
  session: z.string().min(1, '세션명을 입력하세요'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (center: EducationCenter, updatedList: EducationCenter[]) => void;
}

export default function AddEducationCenterModal({ open, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onValid = async (data: FormData) => {
    try {
      const newCenter = await createEducationCenter(data);
      const res = await fetch('/api/education-centers');
      const updated = await res.json();
      onSubmit(newCenter, updated);
      reset();
      onClose();
    } catch (e) {
      alert('교육기관 등록 실패');
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>새 교육기관 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-3">
          <div>
            <Input {...register('name')} placeholder="교육기관명" />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input {...register('session')} placeholder="세션 (예: 2024년 1차)" />
            {errors.session && <p className="text-sm text-red-500 mt-1">{errors.session.message}</p>}
          </div>
          <Button type="submit" className="w-full">등록</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
