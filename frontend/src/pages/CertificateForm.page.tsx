import { useParams } from 'react-router-dom';
import CertificateForm from '../components/Certificate.form';

const CertificateFormPage = () => {
  const { id } = useParams();  // /new 일 땐 undefined, /:id/edit 일 땐 존재
  return <CertificateForm certificateId={id} />;
};

export default CertificateFormPage;