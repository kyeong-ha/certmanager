import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CertificateFormPage from './pages/CertificateForm.page';
import MainPage from './pages/main.page';
import SearchPage from './pages/search.page';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/new" element={<CertificateFormPage />} />
      <Route path="/:id/edit" element={<CertificateFormPage />} />
      
    </Routes>
  );
};

export default App;
