import { Printer } from 'lucide-react';
import { printCopyFile } from '@/utils/printFile';

//----------------------------------------------------------------------//
interface PrintButtonProps {
  file: string;
  label?: string;
  className?: string;
}
//----------------------------------------------------------------------//

export default function PrintButton({ file, label = '출력하기', className }: PrintButtonProps) {
  return (
    // 1.버튼 클릭 시 printElement 함수 호출
    <button onClick={() => printCopyFile(file)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm hover:bg-secondary/80 ${className}`}>
      <Printer size={16} />
      {label}
    </button>
  );
}