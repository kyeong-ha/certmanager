import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EducationCenterSessionDetail } from '@/features/center/types/EducationCenterSession.type';

//----------------------------------------------------------------------//
interface CenterSessionDetailModal {
  isOpen?: boolean;
  onClose: () => void;
  education_session: EducationCenterSessionDetail;
}
//----------------------------------------------------------------------//

/* ----- Modal -------------------------------------------------------- */
const CenterSessionDetailModal: React.FC<CenterSessionDetailModal> = ({ isOpen, onClose, education_session }) => {
  /* --- 1. Handlers --- */
  // 1.1. 모달 닫기
  if (!isOpen) return null;


  /* --- 2. Render --- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {/* 2.1. 모달 헤더 */}
        <DialogHeader>
          <DialogTitle>{education_session.center_session}기 상세정보</DialogTitle>
        </DialogHeader>

        {/* 2.2. 교육원 정보 */}
        <div className="space-y-2 text-sm mt-2">
          <div><strong>교육기관:</strong> {education_session.education_center.center_name}</div>
          <div><strong>배송주소:</strong> {education_session.delivery_address || '-'}</div>
          <div><strong>운송장 번호:</strong> {education_session.tracking_numbers?.join(', ') || '-'}</div>
          <div><strong>단가:</strong> {education_session.unit_price ?? '-'} 원</div>
           {/* TODO: 교육기수 상세정보 구현 */}
            {/* 2.3. 교육원 배송주소 */}
            {/* 2.4. 교육원 대표번호 */}
            {/* 2.5. 교육원 대표메일 */}
        </div>



        {/* 2.3. 모달 닫기 버튼 */}
        <div className="text-right mt-6">
          <Button variant="outline" onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CenterSessionDetailModal;
