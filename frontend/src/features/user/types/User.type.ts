import { CertificateSearchForm } from '@/features/certificate/types/CertificateSearchForm.type';

export interface User {
    uuid: string;
    user_id: string | null;
    user_name: string;
    birth_date: string;
    phone_number: string;
    postal_code: string;
    address: string;
    photo: string | null;

    created_at: string;
    updated_at: string;

    certificates: CertificateSearchForm[];
    latest_education_session?: {
        education_center: {
            center_name: string;
        }
        center_session: string | null;
  };
}