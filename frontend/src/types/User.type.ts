import { Certificate } from '@/types/Certificate.type';
export interface User {
    uuid: string;
    user_id: string | null;
    user_name: string;
    birth_date: string;
    phone_number: string;
    postal_code: string;
    address: string;
    image_url: string | null;
    pdf_url: string | null;

    created_at: Date;
    updated_at: Date;

    certificates: Certificate[];
}