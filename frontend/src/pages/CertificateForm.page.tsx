import { useParams } from 'react-router-dom';
import CertificateForm from '../components/Certificate.form';

const CertificateFormPage = () => {
  const { issue_number } = useParams(); 
  return <CertificateForm issue_number={issue_number} />;
};

export default CertificateFormPage;