export interface CertificateSearchForm{
  uuid: string;         // 고유식별번호
  course_name: string;  // 자격과정
  issue_number: string; // 발급번호
  issue_date: string;   // 발급일자
  education_center?: {  // 교육원 정보
    center_name: string;
    center_session: string;
  };
}