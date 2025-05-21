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
import CertificatePrintModal from '@/features/certificate/modals/CertificatePrint.modal';
import { convertToSummary } from '../utils/convertToSummary';

//----------------------------------------------------------------------//
interface CertificateTableProps {
  searchResults: CertificateSummary[];         // 테이블에 표시할 자격증 목록
  onRefresh: () => void;                       // 재조회 트리거 함수
  onSelectChange?: (selected: string[]) => void; // 선택된 자격증 uuid 리스트 전달 (체크박스 선택 시)
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
export default function CertificateTable({ searchResults, onRefresh, onSelectChange }: CertificateTableProps) {
  /* --- 1.states --- */
  const [tableDatas, setTableData] = useState<CertificateSummary[]>(searchResults);
  const [targetCert, setTargetCert] = useState<CertificateDetail | null>(null);
  const [targetUser, setTargetUser] = useState<UserDetail | null>(null);
  const [targetCenter, setTargetCenter] = useState<EducationCenterSessionDetail | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [modals, setModals] = useState<Record<ModalKeys, boolean>>({ certModal: false, printModal: false, userModal: false, centerModal: false, reissueModal: false, });
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]); // 선택된 UUID 리스트
  

  useEffect(() => {
    setTableData(searchResults);
  }, [searchResults]);


  /* --- 2.handlers --- */
  // 2.1. 셀 좌클릭 시 행 선택/해제
  const handleLeftClick = async (e: MouseEvent, cert: CertificateSummary) => {
    toggleSelection(cert.uuid);
    if (e.detail === 2) {
      // 더블 클릭 시 상세정보 모달 열기
      openModal('certModal');
      try {
        const result = await fetchCertificateByUuid(cert.uuid);
        setTargetCert(result);
      } catch {
        alert('자격증 정보를 불러오지 못했습니다.');
      }
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

  // 2.6. 1개의 행 선택/해제
  const toggleSelection = (uuid: string) => {
    setSelectedUuids((prev) => {
      const next = prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid];
      onSelectChange?.(next);
      return next;
    });
  };

  // 2.7. 전체 선택/해제
  const toggleAll = () => {
    if (selectedUuids.length === searchResults.length) {
      setSelectedUuids([]);
      onSelectChange?.([]);
    } else {
      const allUuids = searchResults.map((cert) => cert.uuid);
      setSelectedUuids(allUuids);
      onSelectChange?.(allUuids);
    }
  };

  /* --- 3.Render --- */
  return (
    <div className="overflow-auto">

      {/* 검색결과 Table */}
      <div className="overflow-auto max-h-[calc(100vh-300px)] rounded border border-gray-200">
        <table className="min-w-full table-fixed text-sm border-separate border-spacing-0">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="w-8 px-2 py-2 border-b border-gray-300">
              <input
                type="checkbox"
                checked={selectedUuids.length === searchResults.length}
                onChange={toggleAll}
              />
            </th>
            <th className="px-2 py-1 border">발급번호</th>
            <th className="px-2 py-1 border">이름</th>
            <th className="px-2 py-1 border">생년월일</th>
            <th className="px-2 py-1 border">전화번호</th>
            <th className="px-2 py-1 border">자격과정</th>
            <th className="px-2 py-1 border">발급일자</th>
            <th className="px-2 py-1 border">교육기관</th>
          </tr>
        </thead>
          <tbody>
            {tableDatas.map((row, idx) => (
              <tr key={row.uuid} className="cursor-pointer bg-white hover:bg-blue-50" onClick={(e) => handleLeftClick(e, row)} onContextMenu={(e) => handleRightClick(e, row)} >
                <td className="px-2 py-1 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedUuids.includes(row.uuid)}
                    onChange={() => toggleSelection(row.uuid)}
                  />
                </td>
                <td className="px-2 py-1 border">{row.issue_number}</td>
                <td className="px-2 py-1 border">{row.user?.user_name || '이름없음'}</td>
                <td className="px-2 py-1 border">{row.user?.birth_date || '생년월일없음'}</td>
                <td className="px-2 py-1 border">{row.user?.phone_number || '번호없음'}</td>
                <td className="px-2 py-1 border">{row.course_name}</td>
                <td className="px-2 py-1 border">{row.issue_date}</td>
                <td className="px-2 py-1 border">{row.center_name ?? ''} {row.center_session ? `${row.center_session}기` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} options={['상세정보', '회원정보', '교육원정보', '재발급하기', '출력하기']} onSelect={handleContextSelect} onClose={() => setContextMenu(null)}/>
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

          {/* 출력하기 */}
          {modals.printModal && targetCert && (
            <CertificatePrintModal isOpen={modals.printModal} onClose={() => closeModal('printModal')} certificate={targetCert} />
          )}
        </>
    </div>
  );
}
