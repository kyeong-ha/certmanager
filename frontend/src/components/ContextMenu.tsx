import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  x: number;
  y: number;
  onSelect: (action: string) => void;
  options: string[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onSelect, onClose }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const menu = (
    <div
      className="fixed z-[9999] bg-white border rounded shadow-md text-sm"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {options.map((option, i) => (
        <div
          key={i}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
          onClick={() => onSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );

  return createPortal(menu, document.body); // 🧩 브라우저 전체 기준
};

export default ContextMenu;
