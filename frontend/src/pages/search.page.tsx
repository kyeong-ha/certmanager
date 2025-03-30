import React, { useState } from 'react';
import axios from 'axios';
import { Certificate } from '../types/certificate.type';
import ResultsTable from '../components/ResultsTable';
import { useNavigate } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const [filterType, setFilterType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<Certificate[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="search-page">
      <h2>상세 검색</h2>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="search-filter">검색 기준: </label>
        <select id="search-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="name">이름</option>
          <option value="education_center">교육기관명</option>
          <option value="setPhoneNumber">전화번호</option>
          <option value="issue_number">발급번호</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>검색</button>
        <button onClick={handleBack} style={{ marginLeft: '10px' }}>뒤로가기</button>
      </div>
      <ResultsTable results={results} onSelect={() => {}} />
    </div>
  );
};

export default SearchPage;