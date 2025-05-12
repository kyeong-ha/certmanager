import { EducationCenterSearchForm } from "./EducationCenterSearchForm.type";

export interface EducationCenter {
  uuid: string;
  center_name: string;
  //TODO: 대표자명, 대표번호, 대표자핸드폰번호, 담당자명, 담당자핸드폰번호, 사업자주소, 배송지 등

  created_at: Date;
  updated_at: Date;
}

export interface EducationCenterSession {
  uuid: string;
  education_center: EducationCenter;
  center_session: string | null;
}