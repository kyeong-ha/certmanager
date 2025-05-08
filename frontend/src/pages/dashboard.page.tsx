import { useEffect, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Certificate } from '@/types/Certificate.type';
import { getCertificateStats, getRecentCertificates } from '@/services/dashboard.api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type SortState = {
  key: string;
  order: 'asc' | 'desc';
};

export default function DashboardPage() {
  const [totalCount, setTotalCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; count: number }[]>([]);
  const [centerData, setCenterData] = useState<{ edu_name: string; count: number }[]>([]);
  const [centerSessionData, setCenterSessionData] = useState<{ edu_name: string; session: number; count: number }[]>([]);
  const [courseData, setCourseData] = useState<{ course_name: string; count: number }[]>([]);
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({ monthly: false, edu: false, course: false, eduSession: false, });
  const [sortState, setSortState] = useState<SortState>({ key: '', order: 'asc' });

  const navigate = useNavigate();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSort = (key: string) => {
    const newOrder = sortState.key === key && sortState.order === 'asc' ? 'desc' : 'asc';
    setSortState({ key, order: newOrder });

    if (key === 'month') {
      setMonthlyData(prev =>
        [...prev].sort((a, b) =>
          newOrder === 'asc' ? a.month.localeCompare(b.month) : b.month.localeCompare(a.month)
        )
      );
    } else if (key === 'center') {
      setCenterData(prev =>
        [...prev].sort((a, b) =>
          newOrder === 'asc' ? a.edu_name.localeCompare(b.edu_name) : b.edu_name.localeCompare(a.edu_name)
        )
      );
    } else if (key === 'course_name') {
      setCourseData(prev =>
        [...prev].sort((a, b) =>
          newOrder === 'asc' ? a.course_name.localeCompare(b.course_name) : b.course_name.localeCompare(a.course_name)
        )
      );
    } else if (key === 'center_sseion') {
      setCenterSessionData(prev =>
        [...prev].sort((a, b) => {
          if (a.edu_name === b.edu_name) {
            return newOrder === 'asc' ? a.session - b.session : b.session - a.session;
          }
          return newOrder === 'asc'
            ? a.edu_name.localeCompare(b.edu_name)
            : b.edu_name.localeCompare(a.edu_name);
        })
      );
    }
  };

  const sortIcon = (key: string) =>
    sortState.key === key ? (sortState.order === 'asc' ? '▲' : '▼') : '';

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getCertificateStats();
      setTotalCount(stats.total);
      setMonthlyData(stats.monthly);
      setCenterData(stats.center);
      setCenterSessionData(stats.center_session);
      setCourseData(stats.course);
    };
    const fetchRecent = async () => {
      const list = await getRecentCertificates();
      setRecentCertificates(list);
    };

    fetchStats();
    fetchRecent();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 자격증 발급 대시보드</h1>

      {/* 주요 액션 버튼 */}
      <div className="flex flex-wrap gap-4 mt-2">
        <button
          onClick={() => navigate("/issue")}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          자격증 발급하기
        </button>

        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          <Search size={18} />
          자격증 검색하기
        </button>
      </div>

      {/* 전체 발급개수 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold">전체 발급개수</h2>
        <p className="text-3xl font-bold mt-2">{totalCount.toLocaleString()}개</p>
      </div>

      {/* 월별 발급개수 표 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">월별 발급개수</h2>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => handleSort('month')} className="px-2 py-1 border cursor-pointer select-none">
                월 {sortIcon('month')}
              </th>
              <th className="px-2 py-1 border">발급개수</th>
            </tr>
          </thead>
          <tbody>
            {(expandedSections.monthly ? monthlyData : monthlyData.slice(0, 5)).map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1 border">{item.month}</td>
                <td className="px-2 py-1 border">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {monthlyData.length > 5 && (
          <button onClick={() => toggleSection('monthly')} className="mt-2 text-blue-600 hover:underline text-sm">
            {expandedSections.monthly ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* 교육기관 + 기수별 발급 통계 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">교육기관 + 기수별 발급 통계</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th  onClick={() => handleSort('center_sseion')} className="px-2 py-1 border cursor-pointer select-none">
                  교육원명 {sortIcon('center_sseion')}
                </th>
                <th className="px-2 py-1 border">기수</th>
                <th className="px-2 py-1 border">발급개수</th>
              </tr>
            </thead>
            <tbody>
              {(expandedSections.eduSession ? centerSessionData : centerSessionData.slice(0, 5)).map((item, idx) => (
                <tr key={`${item.edu_name}-${item.session}-${idx}`}>
                  <td className="px-2 py-1 border">{item.edu_name}</td>
                  <td className="px-2 py-1 border">{item.session}</td>
                  <td className="px-2 py-1 border">{item.count}개</td>
                </tr>
              ))}
            </tbody>
          </table>
          {centerSessionData.length > 5 && (
            <button onClick={() => toggleSection('eduSession')} className="mt-2 text-blue-600 hover:underline text-sm">
              {expandedSections.eduSession ? '접기' : '더보기'}
            </button>
          )}
        </div>
      </div>

      {/* 교육기관별 집계 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">교육기관별 발급개수</h2>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => handleSort('center')} className="px-2 py-1 border cursor-pointer select-none">
                교육원명 {sortIcon('center')}
              </th>
              <th className="px-2 py-1 border">발급개수 {sortState.key === 'count' && (sortState.order === 'asc' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {(expandedSections.edu ? centerData : centerData.slice(0, 5)).map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1 border">{item.edu_name}</td>
                <td className="px-2 py-1 border">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {centerData.length > 5 && (
          <button onClick={() => toggleSection('edu')} className="mt-2 text-blue-600 hover:underline text-sm">
            {expandedSections.edu ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* 과정별 집계 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">과정별 발급개수</h2>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => handleSort('course_name')} className="px-2 py-1 border cursor-pointer select-none">
                교육원명 {sortIcon('course_name')}
              </th>
              <th className="px-2 py-1 border">발급개수 {sortState.key === 'count' && (sortState.order === 'asc' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {(expandedSections.course ? courseData : courseData.slice(0, 5)).map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1 border">{item.course_name}</td>
                <td className="px-2 py-1 border">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {courseData.length > 5 && (
          <button onClick={() => toggleSection('course')} className="mt-2 text-blue-600 hover:underline text-sm">
            {expandedSections.course ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* 최근 발급 자격증 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">최근 발급된 자격증</h2>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">발급번호</th>
              <th className="px-2 py-1 border">성명</th>
              <th className="px-2 py-1 border">과정</th>
              <th className="px-2 py-1 border">교육원</th>
              <th className="px-2 py-1 border">발급일자</th>
            </tr>
          </thead>
          <tbody>
            {recentCertificates.map(cert => (
              <tr key={cert.uuid}>
                <td className="px-2 py-1 border">{cert.issue_number}</td>
                <td className="px-2 py-1 border">{cert.user?.user_name ?? '이름없음'}</td>
                <td className="px-2 py-1 border">{cert.course_name}</td>
                <td className="px-2 py-1 border">
                  {cert.education_center?.edu_name}_{cert.education_center?.session}
                </td>
                <td className="px-2 py-1 border">{format(new Date(cert.issue_date), 'yyyy-MM-dd')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
