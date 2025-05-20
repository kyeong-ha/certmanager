export interface EducationCenter {
  uuid: string;
  center_name: string;
  
  center_tel?: string;             // 교육원 전화번호
  center_address?: string;         // 사업자주소
  delivery_address?: string;       // 배송주소

  unit_price?: number;             // 발급 단가

  ceo_name?: string;               // 대표자명
  ceo_mobile?: string;             // 대표자 휴대폰

  manager_name?: string;           // 담당자명
  manager_mobile?: string;         // 담당자 핸드폰


  created_at: Date;
  updated_at: Date;
}