import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarItem } from '@/types/Layout.type';
import { FiHome, FiCalendar, FiUsers, FiAward, FiChevronDown, FiChevronRight, FiTruck, FiBookOpen } from 'react-icons/fi';

//----------------------------------------------------------------------//
const sidebarItems: (SidebarItem & { icon?: React.ReactNode })[] = [
    { label: '홈', path: '/', icon: <FiHome /> },
    { label: '교육일정', icon: <FiCalendar /> },
    { label: '회원관리', icon: <FiUsers /> },
    {
      label: '자격증관리', icon: <FiAward />,
      children: [
        { label: '검색하기', path: '/cert' },
        { label: '(재)발급하기', path: '/cert/create' },
        { label: '출력하기', path: '/cert/print' },
      ],
    },
    { label: '교육원관리', icon: <FiBookOpen /> },
    { label: '배송관리', icon: <FiTruck /> },
  ];
//----------------------------------------------------------------------//


export default function Sidebar() {
  /* --- 1. State --- */
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  /* --- 2. Handlers --- */
  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  /* --- 3. Render --- */
  return (
    <aside className="w-64 bg-white border-r h-full shadow-sm">
      {/* 3.1. Sidebar Header */}
      <div className="px-6 py-4 text-lg font-bold">
        📘 자격증 관리시스템
      </div>

      {/* 3.2. Sidebar Items */}
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const hasChildren = !!item.children; // 하위메뉴 존재유무 체크
          const isClickable = !!item.path; // URL 존재유무 체크
          const isActive = location.pathname === item.path; // 상위메뉴 활성화 체크
          const isChildActive = hasChildren ? item.children?.some((child) => child.path === location.pathname) : false; // 하위메뉴 활성화 체크
          const isOpen = openMenus[item.label] || isChildActive; // 드롭다운 자동 열기

          return (
            <div key={item.label} className="mb-1">
               {/* 3.2.1. 하위 메뉴가 있는 경우, Dropdown Menu 활성화 */}
                { hasChildren ? (
                  <>
                    <div className={`flex items-center justify-between px-6 py-2 font-semibold cursor-pointer transition hover:bg-gray-50 hover:border-blue-200 border-l-4 ${ isOpen ? 'border-blue-600 bg-gray-100 text-blue-600' : 'border-transparent text-gray-700' }`} onClick={() => toggleMenu(item.label)}>
                      <span className="flex items-center gap-2">
                        {item.icon} {item.label}
                      </span>
                      {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                     {/* 하위 메뉴 리스트 */}
                    {isOpen &&
                      item.children!.map((child) => (
                        <Link key={child.path} to={child.path || '#'} className={`block px-8 py-2 text-sm rounded-l-lg hover:bg-gray-100 ${ location.pathname === child.path ? 'bg-gray-100 font-medium text-blue-600' : 'text-gray-600' }`}>
                           <span className="text-xs">▸ </span>
                           {child.label}
                        </Link>
                      ))}
                  </>
                ) : isClickable ? (
                // 3.2.2. 하위 메뉴가 없고 path가 있는 경우, Link 연결
                <Link to={item.path!} className={`flex items-center gap-2 px-6 py-2 font-semibold text-gray-700 rounded-l-lg border-l-4 hover:border-blue-500 hover:bg-gray-50 transition ${ isActive ? 'border-blue-600 bg-gray-100 text-blue-600' : 'border-transparent text-gray-700' }`}>
                  <span className="flex items-center gap-2">
                      {item.icon} {item.label}
                  </span>
                </Link>
                ) : (
                  // 3.2.3. 하위 메뉴와 path 모두 없는 경우, 단순 텍스트 표시
                  <div className="flex items-center gap-2 px-6 py-2 text-gray-400 font-semibold cursor-not-allowed select-none">
                    <span className="flex items-center gap-2">
                        {item.icon} {item.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    );
  }