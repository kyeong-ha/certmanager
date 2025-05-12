export interface ReissueLog {
    uuid: string;
    certificate_uuid: string;
    reissue_date: string;
    reissue_cost?: number | null;
    delivery_type: '선불' | '착불';

    created_at: string;
    updated_at: string;
}
  