// 파일 업로드용 공통 컴포넌트
interface FileInputBlockProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

export default function FileInputBlock({ label, name, onChange, accept }: FileInputBlockProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-1"
      />
    </div>
  );
}
