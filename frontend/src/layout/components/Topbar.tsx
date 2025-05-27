import { useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import SearchDropdown from '@/components/SearchDropdown';

const pageTitles: Record<string, string> = {
  '/': '홈',

  '/schedule': '교육일정',

  '/user': '회원관리: 검색하기',
  '/user/create': '회원관리: 회원 생성하기',
  
  '/cert': '자격증관리: 검색하기',
  '/cert/print': '자격증관리: 출력하기',

  '/center': '교육원관리: 검색하기',

  '/delivery': '배송관리',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || '페이지';
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 py-4 bg-white border-b shadow-sm flex items-center justify-between">
      {/* 1.페이지 제목 */}
      <h1 className="text-xl font-semibold">
        {title}
      </h1>

      {/* 2.버튼 */}
      <div className="flex gap-2">
        
        {/* 2.1.통합검색 버튼 */}
        <SearchDropdown />

        {/* 2.2. 신규발급 버튼 */}
        <button onClick={() => navigate('/cert/print')} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
          <PlusCircle size={16} />
          신규발급
        </button>
        
      </div>
    </header>
  );
}
