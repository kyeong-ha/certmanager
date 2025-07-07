import React, { useState, useEffect } from 'react';
import { searchCertificates } from '@/features/certificate/services/cert.api';
import { CertificateSummary } from '@/features/certificate/types/Certificate.type';
import CertificateTable from '../components/CertificateTable';
import SearchFilter from '../../../components/SearchFilter';
import MainLayout from '@/layout/MainLayout';
import { fetchCertificatesWithPagination } from '@/features/certificate/services/certPagination.api';
import ReactPaginate from 'react-paginate';

/* ----- Page ----------------------------------------------------- */
const CertificatePage: React.FC = () => {
  const [lastSearchParams, setLastSearchParams] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CertificateSummary[]>([]);
  const [searched, setSearched] = useState(false);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

  /*--- 1.Handlers ---*/
  // 페이지 로드시 기본 데이터 호출
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch({}, 1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  const handleSearch = async (params?: Record<string, string>, page = 1) => {
    const updatedFilters = params ?? filters;
    const result = await fetchCertificatesWithPagination({
      page,
      pageSize: 20,
      filters: updatedFilters,
    });

    setResults(result.results);
    setTotalCount(result.count);
    setCurrentPage(page);
    setFilters(updatedFilters);
    setSearched(true); 
  };

  // 페이지 버튼 클릭 핸들러
  const handlePageChange = (page: number) => {
    handleSearch(undefined, page);
  };

  /* --- 2.Render --- */
  return (
    <MainLayout>
      <div className="p-6 mx-auto">
        <h2 className="text-2xl font-bold mb-6">🔍 자격증 검색</h2>

        {/* 2.1.검색 기준 */}
        <div className="flex flex-col gap-4 mb-6">
            <SearchFilter
              onSearch={(params) => handleSearch(params, 1)}
              onReset={() => {
                setResults([]);
                setSearched(false);
                setFilters({});
                setCurrentPage(1);
                setTotalCount(0);
              }}
            />
        </div>

        {/* 2.2.검색 결과 */}
        <div className="mt-8">
          {searched && results.length === 0 ? ( 
            // 2.2.1.검색결과가 없는 경우
            <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
          ) : ( 
            // 2.2.2.검색결과가 있는 경우: SearchTable 출력
            <div>
              <CertificateTable searchResults={results} onRefresh={handleSearch}/>

              {/* 2.3.페이지네이션 */}
              <ReactPaginate
                pageCount={Math.ceil(totalCount / 20)}
                forcePage={currentPage - 1}
                onPageChange={({ selected }) => handlePageChange(selected + 1)}
                containerClassName="flex justify-center gap-2 mt-6"
                pageClassName="px-3 py-1 rounded border border-gray-300 text-sm"
                activeClassName="bg-blue-500 text-white"
                previousLabel="<"
                nextLabel=">"
                previousClassName="px-3 py-1 border rounded border-gray-300"
                nextClassName="px-3 py-1 border rounded border-gray-300"
                breakLabel="..."
                breakClassName="px-3 py-1"
              />
            </div>
          )}
        </div>
      </div>
      </MainLayout>
  );
};

export default CertificatePage;