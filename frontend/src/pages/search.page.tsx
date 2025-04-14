import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCertificates } from '../services/certificate.api';
import { Certificate } from '../types/Certificate.type';
import CertificateTable from '../components/Certificate.table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

const SearchPage: React.FC = () => {
  const [filterType, setFilterType] = useState('user_name');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<Certificate[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetchCertificates({
        filter_type: filterType,
        search_value: searchValue,
      });
      setResults(response);
    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류 발생');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">상세 검색</h2>
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium mb-1">검색기준</label>
          <select
            id="search-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="user_name">이름</option>
            <option value="education_center">교육원명</option>
            <option value="phone_number">전화번호</option>
            <option value="issue_number">발급번호</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="search-input" className="block text-sm font-medium mb-1">검색어</label>
          <Input
            id="search-input"
            type="text"
            placeholder="검색어 입력"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-5">
          <Button variant="outline" onClick={handleSearch}>검색</Button>
        </div>
      </div>

      <CertificateTable results={results} />
    </div>
  );
};

export default SearchPage;
