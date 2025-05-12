import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchDropdown() {
  const navigate = useNavigate();

  return (
    <DropdownMenu.Root>

      {/* 1.상위 버튼 */}
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700">
          <Search size={16} />
          통합검색
          <ChevronDown size={16} className="ml-1" />
        </button>
      </DropdownMenu.Trigger>

      {/* 2.하위 버튼 */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 mt-2 min-w-[160px] rounded-md bg-white shadow-lg border text-sm text-gray-700" sideOffset={5}>
          
          {/* 2.1. 회원 검색 */}
          <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/user')}>
            회원검색
          </DropdownMenu.Item>

          {/* 2.2. 자격증 검색 */}
          <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/cert')}>
            자격증검색
          </DropdownMenu.Item>

          {/* 2.3. 교육원 검색 */}
          <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/center')}>
            교육원검색
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
      
    </DropdownMenu.Root>
  );
}
