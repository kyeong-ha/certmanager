import { useState, useEffect, MouseEvent } from 'react';
import { Certificate } from '@/types/Certificate.type';
import { User } from '@/types/User.type';
import { fetchUserByUuid } from '@/services/user.api';
import UserCertificatesModal from './UserCertificates.modal';
import PrintPreviewModal from './PrintPreview.modal';
import CertificateDetailModal from './CertificateDetail.modal';
import EducationCenterModal from './EducationCenter.modal';
import ReissueModal from './Reissue.modal';
import ContextMenu from './ui/ContextMenu';

interface Props {
  searchResults: Certificate[];
}

type ModalKeys =
  | 'detailModal'
  | 'printModal'
  | 'userModal'
  | 'centerModal'
  | 'reissueModal';

const CertificateTable = ({ searchResults }: Props) => {
  /* ----- state --------------------------------------------------------- */
  const [tableDatas, setTableData] = useState<Certificate[]>(searchResults);
  const [targetCert, setTargetCert] = useState<Certificate | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [modals, setModals] = useState<Record<ModalKeys, boolean>>({ detailModal: false, printModal: false, userModal: false, centerModal: false, reissueModal: false });

  useEffect(() => setTableData(searchResults), [searchResults]);

  /* ----- helpers ------------------------------------------------------- */
  const handleCellClick = (e: MouseEvent, cert: Certificate) => {
    e.preventDefault();
    setTargetCert(cert);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextSelect = async (action: string) => {
    if (!targetCert) return;

    switch (action) {
      case '상세보기':
        openModal('detailModal');
        break;
      case '출력하기':
        openModal('printModal');
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
      case '재발급':
        openModal('reissueModal');
        break;
    }
    setContextMenu(null);
  };

  const openModal = (key: ModalKeys) =>
    setModals(prev => ({ ...prev, [key]: true }));

  const closeModal = (key: ModalKeys) =>
    setModals(prev => ({ ...prev, [key]: false }));

  const handleUpdate = (updated: Certificate) => {
    setTableData(prev => prev.map(c => (c.uuid === updated.uuid ? updated : c)));
    closeModal('detailModal');
  };

  /* ----- render -------------------------------------------------------- */
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {[
              'No.', '발급일자', '발급번호', '성명', '생년월일', '핸드폰', '자격과정', '교육원명' ].map(h => (
              <th key={h} className="px-2 py-2 border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableDatas.map((row, idx) => (
            <tr
              key={row.uuid}
              className="cursor-pointer hover:bg-gray-100"
              onClick={e => handleCellClick(e, row)}
            >
              <td className="px-2 py-1 border text-center">{idx + 1}</td>
              <td className="px-2 py-1 border">{row.issue_date}</td>
              <td className="px-2 py-1 border">{row.issue_number}</td>
              <td className="px-2 py-1 border">{row.user.user_name || '이름없음'}</td>
              <td className="px-2 py-1 border">{row.user.birth_date || '생년월일없음'}</td>
              <td className="px-2 py-1 border">{row.user.phone_number || '번호없음'}</td>
              <td className="px-2 py-1 border">{row.course_name}</td>
              <td className="px-2 py-1 border">
                {row.education_center?.edu_name}_{row.education_center?.session}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={['회원정보', '교육원정보', '상세보기', '출력하기', '재발급']}
          onSelect={handleContextSelect}
          onClose={() => setContextMenu(null)}
        />
      )}

      {targetCert && (
        <>
          <CertificateDetailModal
            isOpen={modals.detailModal}
            onClose={() => closeModal('detailModal')}
            onUpdate={handleUpdate}
            targetCert={targetCert}
          />

          <PrintPreviewModal
            isOpen={modals.printModal}
            onClose={() => closeModal('printModal')}
            certificate={targetCert}
          />
          
          {targetUser && (                                
            <UserCertificatesModal
              isOpen={modals.userModal}
              onClose={() => closeModal('userModal')}
              user={targetUser}
            />
          )}

          {targetCert.education_center && (
            <EducationCenterModal
              isOpen={modals.centerModal}
              onClose={() => closeModal('centerModal')}
              education_center={targetCert.education_center}
            />
          )}

          <ReissueModal
            isOpen={modals.reissueModal}
            onClose={() => closeModal('reissueModal')}
            certificate={targetCert}
          />
        </>
      )}
    </div>
  );
};

export default CertificateTable;
