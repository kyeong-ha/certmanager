import { Link, useLocation } from 'react-router-dom';
import { SidebarItem } from '@/types/layout.type';

const sidebarItems: SidebarItem[] = [
    { label: '홈', path: '/' },
    { label: '교육일정', path: '/schedule' },
    {
      label: '자격증 관리',
      children: [
        { label: '전체 발급내역', path: '/search' },
        { label: '(재)발급하기', path: '/create' },
        { label: '출력하기', path: '/print' },
      ],
    },
    { label: '교육기관 관리', path: '/center' },
    { label: '배송 관리', path: '/delivery' },
  ];

export default function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="w-64 bg-white border-r h-full shadow-sm">
      <div className="px-6 py-4 text-lg font-bold">📘 certmanager</div>
      <nav className="mt-6">
        {sidebarItems.map((item) => (
          <div key={item.label} className="mb-2">
            <div className="px-6 py-2 text-gray-700 font-semibold">{item.label}</div>
            {item.children &&
              item.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path || '#'}
                  className={`block px-8 py-2 text-sm rounded-l-lg hover:bg-gray-100 ${
                    location.pathname === child.path ? 'bg-gray-100 font-medium text-blue-600' : ''
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            {!item.children && item.path && (
              <Link
                to={item.path}
                className={`block px-6 py-2 rounded-l-lg hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-gray-100 font-medium text-blue-600' : ''
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
