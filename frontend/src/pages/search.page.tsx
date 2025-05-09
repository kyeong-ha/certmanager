import React, { useState } from 'react';
import { fetchCertificates } from '../services/cert.api';
import { Certificate } from '../types/Certificate.type';
import CertificateTable from '../components/Certificate.table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import AdminLayout from '@/layout/AdminLayout';

const SearchPage: React.FC = () => {
  const [filterType, setFilterType] = useState('user_name');
  const [searchValue, setSearchValue] = useState('');
  const [session, setSession] = useState('');
  const [results, setResults] = useState<Certificate[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    try {
      if (filterType === 'education_center') {
        const params: { edu_name: string; session?: string } = { edu_name: searchValue };
        if (session.trim()) {
          params.session = session;
        }
        const response = await fetchCertificates(params);
        setResults(response);
      } else {
        const response = await fetchCertificates({
          filter_type: filterType,
          search_value: searchValue,
        });
        setResults(response);
      }
      setSearched(true);
    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleReset = () => {
    setFilterType('user_name');
    setSearchValue('');
    setSession('');
    setResults([]);
    setSearched(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">자격증 검색</h2>

        <div className="flex flex-col gap-4 mb-6">
          {/* 드롭박스 */}
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium mb-1">검색 기준</label>
            <select
              id="search-filter"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSearchValue('');
                setSession('');
              }}
              className="border rounded p-2 w-full"
            >
              <option value="user_name">이름</option>
              <option value="phone_number">전화번호</option>
              <option value="issue_number">발급번호</option>
              <option value="education_center">교육원명</option>
            </select>
          </div>

          {/* 입력란 */}
          <div>
            <label htmlFor="search-value" className="block text-sm font-medium mb-1">
              {filterType === 'education_center' ? '교육원명' : '검색어'}
            </label>
            <Input
              id="search-value"
              type="text"
              placeholder={filterType === 'education_center' ? '교육원명을 입력하세요' : '검색어 입력'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {filterType === 'education_center' && (
            <div>
              <label htmlFor="session" className="block text-sm font-medium mb-1">기수 (선택)</label>
              <Input
                id="session"
                type="text"
                placeholder="예: 1기"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </div>
          )}

          {/* 버튼들 */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleSearch}>검색</Button>
            <Button variant="ghost" onClick={handleReset}>초기화</Button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="mt-8">
          {searched && results.length === 0 ? (
            <div className="text-center text-gray-500">검색 결과가 없습니다.</div> 
          ) : (
            <CertificateTable searchResults={results} />
          )}
        </div>
      </div>
      </AdminLayout>
  );
};

export default SearchPage;