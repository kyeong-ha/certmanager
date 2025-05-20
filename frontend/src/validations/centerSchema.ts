// src/features/center/validations/centerSchema.ts
import { z } from 'zod';

export const centerSchema = z.object({
  center_name: z.string().min(1, '교육기관명을 입력하세요'),
  center_tel: z.string().min(1, '전화번호를 입력하세요'),
  ceo_name: z.string().min(1, '대표자명을 입력하세요'),
  ceo_mobile: z.string().optional(),
  manager_name: z.string().optional(),
  manager_mobile: z.string().optional(),
  center_address: z.string().optional(),
  delivery_address: z.string().optional(),
  unit_price: z.string().min(1, '단가를 입력하세요'),
  center_session: z.string().optional(),
});

export type CenterForm = z.infer<typeof centerSchema>;