import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ResultsTable from '../components/ResultsTable';
import PrintPreview from '../components/PrintPreview';
import UpdateForm from '../components/UpdateForm';
import axios from 'axios';
import { Certificate } from '../types/certificate.type';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const [results, setResults] = useState<Certificate[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Certificate | null>(null);
  const [printData, setPrintData] = useState<Certificate[] | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (filterType: string, searchValue: string) => {
    try {
      const response = await axios.get<Certificate[]>(`/api/search/`, {
        params: {
          filter_type: filterType,
          search_value: searchValue
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error("검색 오류:", error);
      alert("검색 중 오류 발생");
    }
  };

  const handleUpdate = async (filter: object, updateData: object) => {
    try {
      const response = await axios.put(`/api/update/`, { filter, update_data: updateData });
      alert(response.data.message);
    } catch (error) {
      console.error("업데이트 오류:", error);
      alert("업데이트 중 오류 발생");
    }
  };

  const handlePrintPreview = () => {
    setPrintData(results);
  };

  const goToSearchPage = () => {
    navigate('/search');
  };

  return (
    <div className="app-container">
      <h1>자격증 관리 시스템</h1>
      <SearchBar onSearch={handleSearch} />
      <ResultsTable results={results} onSelect={setSelectedRecord} />
      <UpdateForm selectedRecord={selectedRecord} onUpdate={handleUpdate} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrintPreview}>인쇄 미리보기</button>
        <button onClick={goToSearchPage} style={{ marginLeft: '10px' }}>상세 검색</button>
      </div>
      {printData && <PrintPreview data={printData} />}
    </div>
  );
};

export default MainPage;