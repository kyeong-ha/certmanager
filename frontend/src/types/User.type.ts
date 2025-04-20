export interface User {
    uuid: string;
    user_name: string;
    birth_date: string;
    phone_number: string;
    user_id?: string | null;
    postal_code?: string;
    address?: string;
    photo?: string;
    pdf_url?: string;

    created_at: Date;
    updated_at: Date;
}