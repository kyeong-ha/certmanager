import { useEffect, useState } from 'react';
import { Certificate } from '@/types/Certificate.type';
import { getCertificateStats, getRecentCertificates } from '@/services/dashboard.api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [totalCount, setTotalCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; count: number }[]>([]);
  const [centerData, setCenterData] = useState<{ edu_name: string; count: number }[]>([]);
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getCertificateStats();
      setTotalCount(stats.total);
      setMonthlyData(stats.monthly);
      setCenterData(stats.by_center);
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

      {/* 전체 발급 수 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold">총 발급 자격증 수</h2>
        <p className="text-3xl font-bold mt-2">{totalCount.toLocaleString()}개</p>
      </div>

      {/* 월별 추이 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">월별 발급 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 교육기관별 집계 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">교육기관별 발급 수</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={centerData}>
            <XAxis dataKey="edu_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
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
