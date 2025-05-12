import { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PrintPreviewProps {
    copy_file: string;  // 자격증 사본 파일 URL
}

export default function PDFPreview({ copy_file }: PrintPreviewProps) {
  const [loadError, setLoadError] = useState(false);

  /* --- 1.Hanlders --- */
  if (!copy_file || loadError) {
    return (
      <div className="text-sm text-red-500 italic">
        PDF를 불러오지 못했습니다. 파일이 존재하지 않거나 손상되었을 수 있습니다.
      </div>
    );
  }

  /* --- 2.Render --- */
  return (
    <div className="h-[500px] border rounded-md overflow-hidden">
      {/* 2.1.PDF.js Workder를 로드하여 성능 최적화 */}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {/* 2.2.오류 발생 시 LoadError 상태 갱신 */}
        <Viewer fileUrl={copy_file} defaultScale={1.2} onDocumentLoad={(e) => { if (!e.doc) { setLoadError(true); } }} />
      </Worker>
    </div>
  );
}