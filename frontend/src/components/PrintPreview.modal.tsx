import React from 'react';
import { Certificate } from '../types/Certificate.type';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ isOpen, onClose, certificate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">자격증 출력 미리보기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>

        <div className="h-[500px] overflow-auto border rounded">
          <img
            src={certificate.user.photo || ''}
            alt="자격증 미리보기"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            인쇄하기
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
