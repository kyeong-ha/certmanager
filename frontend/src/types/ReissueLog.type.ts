import { Certificate } from "./Certificate.type";

export interface ReissueLog {
    uuid: string;
    certificate: Certificate;
    reissue_date: string;
    reissue_cost: number;
    delivery_type: '선불' | '착불';
}