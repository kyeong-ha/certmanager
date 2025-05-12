import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import CreatePage from './features/certificate/pages/CertificateCreate.page';
import HomePage from './features/Home.page';
import CertificatePage from '@/features/certificate/pages/Certificate.page';
import CertificateCreatePage from '@/features/certificate/pages/CertificateCreate.page';
import UserPage from '@/features/user/pages/User.page'

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
      <Route path="/cert" element={<CertificatePage />} />
      <Route path="/cert/create" element={<CertificateCreatePage />} />
      {/* <Route path="/cert/update/:uuid" element={<CreatePage />} /> */}
      <Route path="/user" element={<UserPage />} />

    </Routes>
  );
};

export default App;
