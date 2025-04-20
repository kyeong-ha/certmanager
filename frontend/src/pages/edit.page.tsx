import { useParams } from 'react-router-dom';
import CertificateForm from '@/components/Certificate.form';

export default function EditPage() {
  const { uuid } = useParams();
  return <CertificateForm uuid={uuid} />;
}