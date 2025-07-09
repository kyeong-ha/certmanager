import { CertificateSummary } from './Certificate.type';

export interface ReissueLog {
  uuid: string;
  certificate_uuid: Pick<CertificateSummary, 'uuid' | 'issue_number' | 'user_uuid'>;
  reissue_date: string;
  delivery_type: '선불' | '착불';
  reissue_cost?: number;
  created_at: string;
}
