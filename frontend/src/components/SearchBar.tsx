import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (filterType: string, searchValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [filterType, setFilterType] = useState('user_name');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(filterType, searchValue);
  };

  return (
    <div className="search-bar">
      <label htmlFor="search-filter">검색필터:</label>
      <select id="search-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="user_name">이름</option>
        <option value="education_center">교육기관명</option>
        <option value="phone_number">핸드폰</option>
        <option value="issue_number">발급번호</option>
      </select>
      <input
        type="text"
        placeholder="검색어 입력"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;