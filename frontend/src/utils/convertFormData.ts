import { Certificate } from '@/types/Certificate.type';
import { EducationCenter } from '@/types/EducationCenter.type';

export const convertCertificateToFormData = (data: Certificate): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'education_center') {
      if (value && (value as EducationCenter).id) {
        formData.append('education_center_id', (value as EducationCenter).id.toString());
      }
    } else if (key === 'image_file') {
      if (value instanceof File) {
        formData.append('image_url', value);
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  return formData;
};
