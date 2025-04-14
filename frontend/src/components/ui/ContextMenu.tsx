import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onSelect: (action: string) => void;
  options: string[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onSelect, onClose }) => {
  return (
    <div
      className="absolute z-50 bg-white border rounded shadow-md text-sm"
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
};

export default ContextMenu;
