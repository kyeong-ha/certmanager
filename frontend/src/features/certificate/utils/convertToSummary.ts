import type { CertificateSummary, CertificateDetail } from '../types/Certificate.type';

export function convertToSummary(detail: CertificateDetail): CertificateSummary {
  return {
    uuid: detail.uuid,
    issue_number: detail.issue_number,
    issue_date: detail.issue_date,
    course_name: detail.course_name,
    user: {
      uuid: detail.user?.uuid ?? '',
      user_name: detail.user?.user_name ?? '',
      birth_date: detail.user?.birth_date ?? '',
      phone_number: detail.user?.phone_number ?? '',
    },
    center_name: detail.education_session?.education_center?.center_name ?? '',
    center_session: detail.education_session?.center_session ?? 0,
  };
}
