export interface EducationCenterSession {
  uuid: string;
  education_center: {
    uuid: string,
    center_name: string,
  }
  center_session: string | null;
}