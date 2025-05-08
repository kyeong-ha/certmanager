import { useState } from 'react';

interface Props {
    copy_file: string;
}

export default function PDFPreview({ copy_file }: Props) {
  const [loadError, setLoadError] = useState(false);

  return loadError ? (
    <div className="text-sm text-red-500 italic">
      PDF를 불러오지 못했습니다. 파일이 존재하지 않거나 손상되었을 수 있습니다.
    </div>
  ) : (
    <iframe
      src={copy_file}
      className="w-full h-[500px] rounded-md border"
      title="PDF 미리보기"
      onError={() => setLoadError(true)}
    >
      이 브라우저는 PDF 미리보기를 지원하지 않습니다.
    </iframe>
  );
}