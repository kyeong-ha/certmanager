import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import CreatePage from './features/certificate/pages/CertificateCreate.page';
import HomePage from './features/Home.page';
import CertificatePage from '@/features/certificate/pages/Certificate.page';
import CertificatePrintPage from '@/features/certificate/pages/CertificatePrint.page';
import UserPage from '@/features/user/pages/User.page'
import CenterPage from './features/center/Center.page';

/* 
  URL은 Feature-based 에 맞춰 작성한다
    /cert
    /cert/create
    /cert/update/:uuid
    ...
*/

const App: React.FC = () => {
  return (
    <Routes>
      {/* 메인 페이지 */}
      <Route path="/" element={<HomePage />} />

      {/* 자격증 관리 */}
      <Route path="/cert" element={<CertificatePage />} />
      <Route path="/cert/print" element={<CertificatePrintPage />} />

      {/* 회원 관리 */}
      <Route path="/user" element={<UserPage />} />

      {/* 교육원 관리 */}
      <Route path="/center" element={<CenterPage />} />

      {/* 배송 관리 */}
      {/* <Route path="/delivery" element={<DeliveryPage />} /> */}

      {/* 404 페이지 */}
    </Routes>
  );
};

export default App;
