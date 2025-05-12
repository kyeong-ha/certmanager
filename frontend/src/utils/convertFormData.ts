import { Certificate } from '@/features/certificate/types/Certificate.type';

export const convertCertificateToFormData = (certificate: Certificate, photo?: File | null): FormData => {
  const formData = new FormData();

  formData.append('uuid', certificate.uuid);
  formData.append('course_name', certificate.course_name);
  formData.append('issue_number', certificate.issue_number);
  formData.append('issue_date', certificate.issue_date);
  formData.append('issue_type', certificate.issue_type || '');
  formData.append('note', certificate.note || '');

  formData.append('user[user_name]', certificate.user.user_name);
  formData.append('user[birth_date]', certificate.user.birth_date);
  formData.append('user[phone_number]', certificate.user.phone_number);
  formData.append('user[user_id]', certificate.user.user_id ?? '');
  formData.append('user[postal_code]', certificate.user.postal_code ?? '');
  formData.append('user[address]', certificate.user.address ?? '');

  if (certificate.education_center) {
    formData.append('education_center', certificate.education_center.uuid);
  }

  if (photo) {
    formData.append('photo', photo);
  }
  // 재발급 로그는 생략 or 별도 처리 필요 (리스트 전송 방식 논의 필요)
  return formData;
};