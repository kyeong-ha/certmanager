import { useState, useEffect, MouseEvent } from 'react';
import { Certificate } from '@/features/certificate/types/Certificate.type';
import { User } from '@/features/user/types/User.type';
import { fetchUserByUuid } from '../../user/services/user.api';

import CertificateDetailModal from '@/features/certificate/modals/CertificateDetail.modal';
import UserDetailModal from '@/features/user/modals/UserDetail.modal';
import CenterDetailModal from '@/features/center/modals/CenterDetail.modal';
import ReissueModal from '@/features/certificate/modals/ReissueLog.modal';
import PrintModal from '@/features/certificate/modals/CertificatePrint.modal';
import ContextMenu from '../../../components/ContextMenu';
import { CertificateSearchForm } from '../types/CertificateSearchForm.type';
import { fetchCertificateByUuid } from '../services/cert.api';

//----------------------------------------------------------------------//
interface CertificateTableProps {
  searchResults: CertificateSearchForm[];
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
export default function CertificateTable({ searchResults }: CertificateTableProps) {
  /* --- 1.states --- */
  const [tableDatas, setTableData] = useState<CertificateSearchForm[]>(searchResults);
  const [targetCert, setTargetCert] = useState<Certificate | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [modals, setModals] = useState<Record<ModalKeys, boolean>>({ certModal: false, printModal: false, userModal: false, centerModal: false, reissueModal: false, });

  useEffect(() =>
    setTableData(searchResults),
  [searchResults]);

  /* --- 2.handlers --- */
  // 2.1. 셀 좌클릭 시 상세정보(certModal) 열기
  const handleLeftClick = (e: MouseEvent, cert: CertificateSearchForm) => {
    e.preventDefault();
    setTargetCert(cert as unknown as Certificate);
    openModal('certModal');
  };

  // 2.2. 셀 우클릭시 ContextMenu 열기
  const handleRightClick = (e: MouseEvent, cert: CertificateSearchForm) => {
    e.preventDefault();
    setTargetCert(cert as unknown as Certificate);
    setContextMenu({ x: e.clientX, y: e.clientY });
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
  const handleUpdate = (updated: Certificate) => {
    setTableData((prev) =>
      prev.map((c) => (c.uuid === updated.uuid ? updated as unknown as CertificateSearchForm : c))
    );
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
              <td className="px-2 py-1 border">{row.user.user_name || '이름없음'}</td>
              <td className="px-2 py-1 border">{row.user.birth_date || '생년월일없음'}</td>
              <td className="px-2 py-1 border">{row.user.phone_number || '번호없음'}</td>
              <td className="px-2 py-1 border">{row.course_name}</td>
              <td className="px-2 py-1 border">{row.education_session?.center_name ?? ''} {row.education_session?.center_session ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} options={['회원정보', '교육원정보', '재발급하기', '출력하기']} onSelect={handleContextSelect} onClose={() => setContextMenu(null)}/>
      )}

      {/* Modals */}
      {targetCert && (
        <>
          {/* 상세정보 */}
          <CertificateDetailModal isOpen={modals.certModal} onClose={() => closeModal('certModal')} onUpdate={handleUpdate} targetCert={targetCert} />

          {/* 회원정보 */}
          {targetUser && (
            <UserDetailModal isOpen={modals.userModal} onClose={() => closeModal('userModal')} user={targetUser} />
          )}

          {/* 교육원정보 */}
          {targetCert.education_session && (
            <CenterDetailModal isOpen={modals.centerModal}onClose={() => closeModal('centerModal')} education_session={targetCert.education_session}/>
          )}

          {/* 재발급하기 */}
          <ReissueModal isOpen={modals.reissueModal} onClose={() => closeModal('reissueModal')} certificate={targetCert}/>

          {/* 출력하기 */}
          <PrintModal isOpen={modals.printModal} onClose={() => closeModal('printModal')} certificate={targetCert} />

        </>
      )}
    </div>
  );
}
