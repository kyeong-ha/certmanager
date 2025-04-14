export interface ReissueLog {
    reissue_date: string; //재발급신청일
    reissue_cost?: number | null; //재발급비용
    delivery_type: '선불' | '착불'; //배송방법

    created_at: Date;
    updated_at: Date;
}
  