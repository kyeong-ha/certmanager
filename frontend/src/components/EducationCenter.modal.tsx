import React from 'react';
import { EducationCenter } from '@/types/EducationCenter.type';

interface EducationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  education_center: EducationCenter;
}

const EducationCenterModal: React.FC<EducationCenterModalProps> = ({ isOpen, onClose, education_center }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">교육원 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>

        <div>
          <p><strong>교육원명:</strong> {education_center?.name}</p>
          <p className="text-sm text-gray-500 mt-2">※ 해당 교육원에 대한 상세 정보는 추후 연동 예정입니다.</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationCenterModal;
