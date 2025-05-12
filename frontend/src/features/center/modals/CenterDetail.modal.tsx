import React from 'react';
import { EducationCenter } from '@/features/center/types/EducationCenter.type';

//----------------------------------------------------------------------//
interface CenterDetailModal {
  isOpen: boolean;
  onClose: () => void;
  education_center: EducationCenter;
}
//----------------------------------------------------------------------//

/* ----- Modal -------------------------------------------------------- */
const CenterDetailModal: React.FC<CenterDetailModal> = ({ isOpen, onClose, education_center }) => {
  /* --- 1. Handlers --- */
  // 1.1. 모달 닫기
  if (!isOpen) return null;


  /* --- 2. Render --- */
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

        {/* 2.1. 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">교육원 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>

        {/* 2.2. 교육원 정보 */}
        <div>
          <p><strong>교육원명:</strong> {education_center?.center_name}</p>
          <p className="text-sm text-gray-500 mt-2">※ 해당 교육원에 대한 상세 정보는 추후 연동 예정입니다.</p>
        </div>

        {/* 2.3. 교육원 배송주소 */}
        {/* <div className="mt-4">
          <p><strong>주소:</strong> {education_center?.address}</p>
          <p className="text-sm text-gray-500 mt-2">※ 해당 교육원에 대한 상세 정보는 추후 연동 예정입니다.</p>
        </div> */}

        {/* 2.4. 교육원 대표번호 */}
        {/* <div className="mt-4">
          <p><strong>전화번호:</strong> {education_center?.phone}</p>
          <p className="text-sm text-gray-500 mt-2">※ 해당 교육원에 대한 상세 정보는 추후 연동 예정입니다.</p>
        </div> */}

        {/* 2.5. 교육원 대표메일 */}
        {/* <div className="mt-4">
          <p><strong>이메일:</strong> {education_center?.email}</p>
          <p className="text-sm text-gray-500 mt-2">※ 해당 교육원에 대한 상세 정보는 추후 연동 예정입니다.</p>
        </div> */}

        {/* 2.3. 모달 닫기 버튼 */}
        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm" >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CenterDetailModal;
