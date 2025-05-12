import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

//----------------------------------------------------------------------//
interface SearchFilterProps {
  onSearch: (params: Record<string, string>) => void;
  onReset: () => void;
}
//----------------------------------------------------------------------//

/* ----- Component ----------------------------------------------------- */
const SearchFilter = ({ onSearch, onReset }: SearchFilterProps) => {
  /* --- 1.states --- */
  const [filterType, setFilterType] = useState("user_name");
  const [searchValue, setSearchValue] = useState("");
  const [centerSession, setCenterSession] = useState("");

  /* --- 2.handlers --- */
  // 2.1. 검색 실행
  const handleSearch = () => {
    if (!searchValue.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    if (filterType === "education_center") {
      const params: Record<string, string> = { center_name: searchValue };
      if (centerSession.trim()) params.center_session = centerSession;
      onSearch(params);
    } else {
      onSearch({ filter_type: filterType, search_value: searchValue });
    }
  };

  // 2.2. 검색기준 및 검색어 초기화
  const handleReset = () => {
    setFilterType("user_name");
    setSearchValue("");
    setCenterSession("");
    onReset();
  };

  /* --- 3.rendering --- */
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm">
      {/* 검색기준(filter) 드롭박스 */}
      <div>
        <label htmlFor="search-filter" className="block text-sm font-medium mb-1">
          검색기준
        </label>
        <select id="search-filter" value={filterType} onChange={(e) => { setFilterType(e.target.value); setSearchValue(""); setCenterSession(""); }}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="user_name">이름</option>
          <option value="phone_number">전화번호</option>
          <option value="issue_number">발급번호</option>
          <option value="education_center">교육원명</option>
        </select>
      </div>

      {/* 검색어(value) 입력란 */}
      <div>
        <label
          htmlFor="search-value"
          className="block text-sm font-medium mb-1"
        >
          {filterType === "education_center" ? "교육원명" : "검색어"}
        </label>
        <Input
          id="search-value"
          type="text"
          placeholder={
            filterType === "education_center"
              ? "교육원명을 입력하세요"
              : "검색어 입력"
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* 교육원명 선택 시 -> 교육기수 입력란 표시 */}
      {filterType === "education_center" && (
        <div>
          <label htmlFor="center_session" className="block text-sm font-medium mb-1">
            기수 (선택)
          </label>
          <Input
            id="center_session"
            type="text"
            placeholder="예: 1기"
            value={centerSession}
            onChange={(e) => setCenterSession(e.target.value)}
          />
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={handleSearch}>
          검색
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          초기화
        </Button>
      </div>
    </div>
  );
};

export default SearchFilter;
