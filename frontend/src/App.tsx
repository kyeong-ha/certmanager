import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CertificateFormPage from './pages/CertificateForm.page';
import MainPage from './pages/main.page';
import SearchPage from './pages/search.page';

// URL 작성규칙 : CURD (Create, Read, Update, Delete) 에 맞춰서 작성
// Create : /create
// Read : /search
// Update : /:uuid/update
// Delete : /delete (not implemented yet)

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/create" element={<CertificateFormPage />} />
      <Route path="/update/:uuid" element={<CertificateFormPage />} />
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      {/* <Route path="/reissue/:cert_uuid" element={<ReissuePage />} /> */}
    </Routes>
  );
};

export default App;
