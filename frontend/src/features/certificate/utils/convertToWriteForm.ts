// CertificateDetail.type → CertificateWriteForm.type 변환 함수
import { CertificateDetail, CertificateWriteForm } from '@/features/certificate/types/Certificate.type';

export function convertToWriteForm(detail: CertificateDetail): CertificateWriteForm {
  return {
    issue_number: detail.issue_number,
    issue_date: detail.issue_date,
    course_name: detail.course_name,
    note: detail.note,
    delivery_address: detail.delivery_address,
    tracking_number: detail.tracking_number,
    user: detail.user.uuid,
    education_session: detail.education_session.uuid,
  };
}
