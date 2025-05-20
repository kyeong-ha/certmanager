import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';

interface AutoCompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onSelect: (value: string) => void;
  onCreateNew: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  value,
  onChange,
  options,
  onSelect,
  onCreateNew,
  placeholder = '',
  disabled = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    if (value.trim() !== '') {
      setShowSuggestions(true);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsCreatingNew(false);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onFocus={() => !isCreatingNew && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
      />

      {showSuggestions && (
        <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
          {/* 신규 생성 옵션 */}
          {value.trim() && !options.includes(value.trim()) && (
            <li
              key="__new__"
              className="px-3 py-2 font-semibold bg-gray-50 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                onCreateNew(value.trim());
                setIsCreatingNew(true);
                setShowSuggestions(false);
              }}
            >
              "{value}" 신규 생성
            </li>
          )}

          {/* 기존 항목 목록 */}
          {filtered.map((opt) => (
            <li
              key={opt}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                if (opt !== value) {
                  onSelect(opt);
                }
                setIsCreatingNew(false);
                setShowSuggestions(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
