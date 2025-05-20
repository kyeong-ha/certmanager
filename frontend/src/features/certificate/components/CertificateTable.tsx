import { useState, useEffect, MouseEvent } from 'react';
import ContextMenu from '../../../components/ContextMenu';

import type { CertificateSummary, CertificateDetail } from '../types/Certificate.type';
import type { UserDetail } from '@/features/user/types/User.type';
import type { EducationCenterSessionDetail } from '@/features/center/types/EducationCenterSession.type';

import { fetchCertificateByUuid } from '../services/cert.api';
import { fetchUserByUuid } from '../../user/services/user.api';
import { fetchEducationSessionByUuid } from '@/features/center/services/center.api';

import CertificateDetailModal from '@/features/certificate/modals/CertificateDetail.modal';
import UserDetailModal from '@/features/user/modals/UserDetail.modal';
import CenterDetailModal from '@/features/center/modals/CenterDetail.modal';
import ReissueModal from '@/features/certificate/modals/ReissueLog.modal';
import PrintModal from '@/features/certificate/modals/CertificatePrint.modal';
import { convertToSummary } from '../utils/convertToSummary';

//----------------------------------------------------------------------//
interface CertificateTableProps {
  searchResults: CertificateSummary[];
  onRefresh: () => void;
}
//----------------------------------------------------------------------//
type ModalKeys =
  | 'certModal'
  | 'userModal'
  | 'centerModal'
  | 'reissueModal'
  | 'printModal';
//----------------------------------------------------------------------//


/* ----- Component ----------------------------------------------------- */
export default function CertificateTable({ searchResults, onRefresh }: CertificateTableProps) {
  /* --- 1.states --- */
  const [tableDatas, setTableData] = useState<CertificateSummary[]>(searchResults);
  const [targetCert, setTargetCert] = useState<CertificateDetail | null>(null);
  const [targetUser, setTargetUser] = useState<UserDetail | null>(null);
  const [targetCenter, setTargetCenter] = useState<EducationCenterSessionDetail | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [modals, setModals] = useState<Record<ModalKeys, boolean>>({ certModal: false, printModal: false, userModal: false, centerModal: false, reissueModal: false, });

  useEffect(() => {
    setTableData(searchResults);
  }, [searchResults]);


  /* --- 2.handlers --- */
  // 2.1. 셀 좌클릭 시 상세정보(certModal) 열기
  const handleLeftClick = async (e: MouseEvent, cert: CertificateSummary) => {
    e.preventDefault();
    // console.log('[handleLeftClick] 클릭된 cert:', cert); // Debug: 클릭된 Object

    try {
      const result = await fetchCertificateByUuid(cert.uuid);
      console.log('[handleLeftClick] 받아온 상세 result:', result); // Debug: API response 확인
      setTargetCert(result);
      openModal('certModal');
    } catch (err) {
      alert('자격증 상세 정보를 불러오지 못했습니다.');
    }
  };

  // 2.2. 셀 우클릭시 ContextMenu 열기
  const handleRightClick = async (e: MouseEvent, cert: CertificateSummary) => {
    e.preventDefault();
    try {
      const result = await fetchCertificateByUuid(cert.uuid);
      setTargetCert(result);
      setContextMenu({ x: e.clientX, y: e.clientY });
    } catch {
      alert('자격증 상세 정보를 불러오지 못했습니다.');
    }
  };


  // 2.3. ContextMenu에서 선택한 항목에 따라 모달 열기
  const handleContextSelect = async (action: string) => {
    if (!targetCert) return;

    switch (action) {
      case '상세정보':
        openModal('certModal');
        try {
          const result = await fetchCertificateByUuid(targetCert.uuid);
          setTargetCert(result);
        } catch {
          alert('자격증 정보를 불러오지 못했습니다.');
        }
        break;
      case '회원정보':
        openModal('userModal');
        try {
          const result = await fetchUserByUuid(targetCert.user.uuid);
          setTargetUser(result);
        } catch {
          alert('회원 정보를 불러오지 못했습니다.');
        }
        break;
      case '교육원정보':
        openModal('centerModal');
        try {
          const result = await fetchEducationSessionByUuid(targetCert.education_session.uuid);
          setTargetCenter(result);
        } catch {
          alert('교육원 정보를 불러오지 못했습니다.');
        }
        break;
      case '재발급하기':
        openModal('reissueModal');
        break;
      case '출력하기':
        openModal('printModal');
        break;
    }
    setContextMenu(null);
  };

  // 2.4. Modals 열기 & 닫기
  const openModal = (key: ModalKeys) => setModals((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key: ModalKeys) => setModals((prev) => ({ ...prev, [key]: false }));

  // 2.5. 상세정보 모달에서 업데이트 후 Table의 데이터에 수정반영
const handleUpdate = async (updated: CertificateDetail) => {
  // 2.5.1. 테이블에 반영
  const updatedSummary = convertToSummary(updated);

  setTableData((prev) =>
    prev.map((row) =>
      row.user.uuid === updatedSummary.user.uuid
        ? {
            ...row,
            user: updatedSummary.user,
          }
        : row
    )
  );
  console.log('[handleUpdate] 업데이트된 데이터:', updatedSummary); // Debug: 업데이트된 데이터 확인
  // 2.5.2. 모달 닫기
  closeModal('certModal');
};

  /* --- 3.Render --- */
  return (
    <div className="overflow-x-auto">

      {/* 검색결과 Table */}
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>{['No.', '발급일자', '발급번호', '성명', '생년월일', '핸드폰', '자격과정', '교육원명'].map((h) => (
            <th key={h} className="px-2 py-2 border">{h}</th>))}
          </tr>
        </thead>
        <tbody>
          {tableDatas.map((row, idx) => (
            <tr key={row.uuid} className="cursor-pointer bg-white hover:bg-gray-100" onClick={(e) => handleLeftClick(e, row)} onContextMenu={(e) => handleRightClick(e, row)} >
              <td className="px-2 py-1 border text-center">{idx + 1}</td>
              <td className="px-2 py-1 border">{row.issue_date}</td>
              <td className="px-2 py-1 border">{row.issue_number}</td>
              <td className="px-2 py-1 border">{row.user?.user_name || '이름없음'}</td>
              <td className="px-2 py-1 border">{row.user?.birth_date || '생년월일없음'}</td>
              <td className="px-2 py-1 border">{row.user?.phone_number || '번호없음'}</td>
              <td className="px-2 py-1 border">{row.course_name}</td>
              <td className="px-2 py-1 border">{row.center_name ?? ''} {row.center_session ? `${row.center_session}기` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} options={['회원정보', '교육원정보', '재발급하기', '출력하기']} onSelect={handleContextSelect} onClose={() => setContextMenu(null)}/>
      )}

      {/* Modals */}

        <>
          {/* 상세정보 */}
          {modals.certModal && targetCert && (
            <CertificateDetailModal isOpen={modals.certModal} onClose={() => closeModal('certModal')} onUpdate={handleUpdate} targetCert={targetCert} />
          )}

          {/* 회원정보 */}
          {modals.userModal && targetUser && (
            <UserDetailModal isOpen={modals.userModal} onClose={() => closeModal('userModal')} user={targetUser} />
          )}

          {/* 교육원정보 */}
          {modals.centerModal && targetCenter && (
            <CenterDetailModal isOpen={modals.centerModal}onClose={() => closeModal('centerModal')} education_session={targetCenter}/>
          )}

          {/* 재발급하기 */}
          {modals.reissueModal && targetCert && (
            <ReissueModal isOpen={modals.reissueModal} onClose={() => closeModal('reissueModal')} certificate={targetCert}/>
          )}

          {/* 출력하기 */}
          {modals.printModal && targetCert && (
            <PrintModal isOpen={modals.printModal} onClose={() => closeModal('printModal')} certificate={targetCert} />
          )}
        </>
    </div>
  );
}
