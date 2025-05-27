import { Printer } from 'lucide-react';
import { printCopyFile } from '@/utils/printFile';

//----------------------------------------------------------------------//
interface PrintButtonProps {
  file: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}
//----------------------------------------------------------------------//

export default function PrintButton({ file, label = '출력하기', className, onClick }: PrintButtonProps) {
  const handleClick = () => {
    if (onClick) return onClick();
    printCopyFile(file);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm hover:bg-secondary/80 ${className}`}
    >
      <Printer size={16} />
      {label}
    </button>
  );
}