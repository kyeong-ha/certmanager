import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePage from './pages/create.page';
import SearchPage from './pages/search.page';
import DashboardPage from './pages/dashboard.page';
import IssuePage from './pages/issue.page';

// API 작성규칙: CURD (Create, Read, Update, Delete) 에 맞춰서 작성
// Create : /create
// Read : /search
// Update : /:uuid/update
// Delete : /delete (not implemented yet)

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/update/:uuid" element={<CreatePage />} />
      <Route path="/issue" element={<IssuePage />} />
    </Routes>
  );
};

export default App;
