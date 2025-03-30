import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/main.page';
import SearchPage from './pages/search.page';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};

export default App;
