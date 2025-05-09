import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': '홈',
  '/schedule': '교육일정',
  '/search': '전체 발급내역',
  '/create': '(재)발급하기',
  '/print': '출력하기',
  '/center': '교육기관 관리',
  '/delivery': '배송 관리',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || '페이지';

  return (
    <header className="w-full px-6 py-4 bg-white border-b shadow-sm">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
