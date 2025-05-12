import { CertificateSearchForm } from '@/features/certificate/types/CertificateSearchForm.type';
import { EducationCenterSearchForm } from '@/features/center/types/EducationCenterSearchForm.type';

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
    education_center: EducationCenterSearchForm;
}