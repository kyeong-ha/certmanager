export interface ReissueLog {
    uuid: string;
    certificate: string;
    reissue_date: string;
    reissue_cost?: number | null;
    delivery_type: '선불' | '착불';

    created_at: Date;
    updated_at: Date;
}
  