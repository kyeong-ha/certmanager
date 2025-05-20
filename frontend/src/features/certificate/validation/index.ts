import { z } from 'zod';

export const certificateWriteSchema = z.object({
  issue_number: z.string().min(1, '필수 입력'),
  issue_date: z.string().min(1, '필수 입력'),
  course_name: z.string().min(1, '필수 입력'),
  user_uuid: z.string().uuid('사용자 선택'),
  education_session_uuid: z.string().uuid('교육기관 세션 선택'),
  // copy_file 은 시스템 제어 → 스키마에서 제외
});
