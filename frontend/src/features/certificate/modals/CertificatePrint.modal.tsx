import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CertificateDetail } from '@/features/certificate/types/Certificate.type';
import { createReissueLog } from '@/features/certificate/services/logs.api';
import ReissueLogConfirmModal from '@/features/certificate/modals/ReissueLogConfirm.modal';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Printer } from 'lucide-react';
import { generateCertificatesPdf } from '@/features/certificate/services/cert.api';

interface CertificatePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateDetail[] | CertificateDetail;
}

export default function CertificatePrintModal({ isOpen, onClose, certificate }: CertificatePrintModalProps) {
  const certificateList = Array.isArray(certificate) ? certificate : [certificate];
  const [pendingCert, setPendingCert] = useState<CertificateDetail | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [printQueue, setPrintQueue] = useState<CertificateDetail[]>([]);

  const [pdfToPrint, setPdfToPrint] = useState<string | null>(null);
  const [printingCertUuid, setPrintingCertUuid] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingCert && printQueue.length > 0) {
      const next = printQueue[0];
      setPendingCert(next);
      setShowLogModal(true);
      setPrintQueue(queue => queue.slice(1));
    }
  }, [pendingCert, printQueue]);

  const printCertificate = async (cert: CertificateDetail) => {
    let pdfUrl = cert.copy_file;

    if (!pdfUrl) {
      try {
        const result = await generateCertificatesPdf([cert.uuid]);
        const path = result.success?.[0]?.copy_file;

        if (!path || !path.startsWith('/')) throw new Error('PDF 생성 실패');
        pdfUrl = path;
      } catch (error) {
        toast.error('PDF 생성 실패: 서버 오류');
        return;
      }
    }

    setPdfToPrint(pdfUrl!);
    setPrintingCertUuid(cert.uuid);
  };


  const handleConfirmedPrint = async (
    cert: CertificateDetail,
    logData?: { reissue_date: string; delivery_type: '선불' | '착불'; reissue_cost: number }
  ) => {
    if (logData) {
      try {
        await createReissueLog({ certificate_uuid: cert.uuid, ...logData });
        alert('재발급 로그가 저장되었습니다.');
      } catch (error) {
        console.error('재발급 로그 저장 실패:', error);
        alert('재발급 로그 저장에 실패했습니다.');
      }
    }
    printCertificate(cert);
    setPendingCert(null);
  };

  const handlePrint = (cert: CertificateDetail) => {
    if (cert.copy_file) {
      setPendingCert(cert);
      setShowLogModal(true);
    } else {
      printCertificate(cert);
    }
  };

  const handleBulkPrint = () => {
    const immediate = certificateList.filter(cert => !cert.copy_file);
    const queue = certificateList.filter(cert => cert.copy_file);
    immediate.forEach(cert => printCertificate(cert));
    setPrintQueue(queue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>자격증 출력 미리보기</DialogTitle>
        </DialogHeader>

        {certificateList.length > 1 && (
          <div className="flex justify-end mb-2">
            <button onClick={handleBulkPrint} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
              전체 출력
            </button>
          </div>
        )}

        <ScrollArea className="space-y-6 h-[80vh] pr-4">
          {certificateList.map((cert) => (
            <div key={cert.uuid} className="rounded-lg border p-4 shadow-sm bg-white space-y-4">
              {/* 출력 대상 요약 영역 */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-gray-900">{cert.issue_number} - {cert.user.user_name}</h3>
                  <p className="text-sm text-gray-600">
                    {cert.education_session.education_center.center_name} / {cert.issue_date}
                  </p>
                  {cert.copy_file ? (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">재발급</span>
                  ) : (
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">신규발급</span>
                  )}
                </div>
              </div>

              {/* PDF 미리보기 영역 */}
              <div className="border rounded-md overflow-hidden bg-gray-50">
                {cert.copy_file ? (
                  <iframe
                    id={`iframe-${cert.uuid}`}
                    src={cert.copy_file}
                    title={`preview-${cert.uuid}`}
                    className="w-full h-[500px] rounded"
                  />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center text-gray-400 text-sm italic">
                    신규 자격증은 아직 PDF가 생성되지 않았습니다. 출력 시 자동으로 생성됩니다.
                  </div>
                )}
              </div>
              
              <button onClick={() => handlePrint(cert)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
                <Printer size={16} />
                출력하기
              </button>
            </div>
          ))}
        </ScrollArea>

        {pendingCert && (
          <ReissueLogConfirmModal
            isOpen={showLogModal}
            onClose={() => { setShowLogModal(false); setPendingCert(null); }}
            onConfirm={(data) => { handleConfirmedPrint(pendingCert, data); setShowLogModal(false); }}
          />
        )}
      </DialogContent>
      {pdfToPrint && printingCertUuid && (
        <iframe
          style={{ display: 'none' }}
          src={pdfToPrint}
          onLoad={() => {
            const iframe = document.querySelector(`iframe[src="${pdfToPrint}"]`) as HTMLIFrameElement;

            try {
              const userConfirmed = window.confirm('이 자격증을 프린터로 출력하시겠습니까?');

              if (userConfirmed) {
                iframe?.contentWindow?.focus();
                iframe?.contentWindow?.print();
                toast.success('출력 명령이 완료되었습니다.');
              } else {
                toast('출력을 취소하였습니다.');
              }
            } catch (e) {
              console.error(e);
              toast.error('출력 실패: 브라우저 인쇄를 실행할 수 없습니다.');
            } finally {
              setPdfToPrint(null);
              setPrintingCertUuid(null);
              setTimeout(() => {
                onClose();
              }, 500);
            }
          }}
        />
      )}
    </Dialog>
  );
  
}
