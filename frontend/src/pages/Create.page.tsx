import { useParams } from 'react-router-dom';
import CertificateForm from '@/components/Certificate.form';
import AdminLayout from '@/layout/AdminLayout';

export default function CreatePage() {
  const { issue_number } = useParams(); 

  return (
    <AdminLayout>
      <CertificateForm issue_number={issue_number} />
    </AdminLayout>
  );
}
