import { CertificateSummary } from './Certificate.type';

export interface ReissueLog {
  uuid: string;
  certificate: Pick<CertificateSummary, 'uuid' | 'issue_number' | 'user'>;
  reissue_date: string;
  delivery_type: '선불' | '착불';
  cost?: number;
  created_at: string;
}
