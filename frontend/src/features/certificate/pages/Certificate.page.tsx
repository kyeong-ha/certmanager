import React, { useState } from 'react';
import { searchCertificates } from '@/features/certificate/services/cert.api';
import { Certificate } from '@/features/certificate/types/Certificate.type';
import CertificateTable from '../components/CertificateTable';
import SearchFilter from '../../../components/SearchFilter';
import MainLayout from '@/layout/MainLayout';

/* ----- Page ----------------------------------------------------- */
const CertificatePage: React.FC = () => {
  const [results, setResults] = useState<Certificate[]>([]);
  const [searched, setSearched] = useState(false);

  /* --- 1.Render --- */
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">🔍 자격증 검색</h2>

        {/* 1.1.검색 기준 */}
        <div className="flex flex-col gap-4 mb-6">
          <SearchFilter onSearch={(params) => {searchCertificates(params).then(setResults); setSearched(true);}} onReset={() => {setResults([]); setSearched(false);}}/>
        </div>

        {/* 1.2.검색 결과 */}
        <div className="mt-8">
          {searched && results.length === 0 ? ( 
            // 1.2.1.검색결과가 없는 경우
            <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
          ) : ( 
            // 1.2.2.검색결과가 있는 경우: SearchTable 출력
            <div>
              <CertificateTable searchResults={results} />
            </div>
          )}
        </div>
      </div>
      </MainLayout>
  );
};

export default CertificatePage;