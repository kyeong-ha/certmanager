import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePage from './features/certificate/pages/CertificateCreate.page';
// import UserPage from 'features/user/User.page'
import SearchPage from '@/features/certificate/pages/CertificateSearch.page';
import HomePage from './features/Home.page';
import CertificateCreatePage from '@/features/certificate/pages/CertificateCreate.page';

/* 
  URL은 Feature-based 에 맞춰 작성한다
    /cert
    /cert/issue
    /cert/search
    /cert/update/:uuid
    ...
*/

const App: React.FC = () => {
  return (
    <Routes>
      {/* 메인 페이지 */}
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/cert" element={<CertificatePage />} /> */}
      <Route path="/cert/create" element={<CertificateCreatePage />} />
      <Route path="/cert/search" element={<SearchPage />} />
      <Route path="/cert/update/:uuid" element={<CreatePage />} />
      {/* <Route path="/user" element={<UserPage />} /> */}
    </Routes>
  );
};

export default App;
