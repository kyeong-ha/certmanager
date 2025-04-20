import React, { useState } from 'react';
import { Certificate } from '../types/certificate.type';
import { getUser } from '../services/user.api';
import UserCertificatesModal from './UserCertificates.modal';
import PrintPreviewModal from './PrintPreview.modal';
import CertificateDetailModal from './CertificateDetail.modal';
import EducationCenterModal from './EducationCenter.modal';
import ContextMenu from './ui/ContextMenu';

interface Props {
  results: Certificate[];
}

const CertificateTable: React.FC<Props> = ({ results }) => {
  const [targetCert, setTargetCert] = useState<Certificate>();
  const [targetUser, setTargetUser] = useState<Certificate[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; columnKey: string; } | null>(null);
  const [modals, setModals] = useState({ detailModal: false, printModal: false, userModal: false, centerModal: false, });

  const handleCellClick = (e: React.MouseEvent, cert: Certificate, columnKey: string) => {
    e.preventDefault();
    setTargetCert(cert);
    setContextMenu({ x: e.clientX, y: e.clientY, columnKey });
  };

  const handleSetModals = (action: string) => {
    if (!contextMenu) return;
    switch (action) {
      case '상세보기':
        setModals((prev) => ({ ...prev, detailModal: true }));
        break;
      case '출력하기':
        setModals((prev) => ({ ...prev, printModal: true }));
        break;
      case '회원정보':
        setModals((prev) => ({ ...prev, userModal: true }));
        handleViewUser(targetCert!);
        break;
      case '교육원정보':
        setModals((prev) => ({ ...prev, centerModal: true }));
        break;
    }
    setContextMenu(null);
  };

  const handleViewUser = async (certificate: Certificate) => {
    try {
      const results = await getUser(
        certificate.user.user_name,
        certificate.user.birth_date,
        certificate.user.phone_number
      );
      setTargetUser(results);
    } catch (e) {
      alert('회원 자격증 목록을 불러오지 못했습니다.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-2 border">No.</th>
            <th className="px-2 py-2 border">발급일자</th>
            <th className="px-2 py-2 border">발급번호</th>
            <th className="px-2 py-2 border">성명</th>
            <th className="px-2 py-2 border">생년월일</th>
            <th className="px-2 py-2 border">핸드폰</th>
            <th className="px-2 py-2 border">자격과정</th>
            <th className="px-2 py-2 border">교육원명</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr
              key={row.uuid}
              onClick={(e) => handleCellClick(e, row, 'issue_number')}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="px-2 py-1 border text-center">{index + 1}</td>
              <td className="px-2 py-1 border">{row.issue_date}</td>
              <td className="px-2 py-1 border">{row.issue_number}</td>
              <td className="px-2 py-1 border">{row.user.user_name || '이름 없음'}</td>
              <td className="px-2 py-1 border">{row.user.birth_date || '생년월일 없음'}</td>
              <td className="px-2 py-1 border">{row.user.phone_number || '번호 없음'}</td>
              <td className="px-2 py-1 border">{row.course_name}</td>
              <td className="px-2 py-1 border" onClick={(e) => handleCellClick(e, row, 'education_center')}>
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
          onSelect={handleSetModals}
          onClose={() => setContextMenu(null)}
          options={['회원정보', '교육원정보', '상세보기', '출력하기']}
        />
      )}

      <CertificateDetailModal
        isOpen={modals.detailModal}
        onClose={() => setModals((prev) => ({ ...prev, detailModal: false }))}
        certificate={targetCert!}
      />

      <PrintPreviewModal
        isOpen={modals.printModal}
        onClose={() => setModals((prev) => ({ ...prev, printModal: false }))}
        certificate={targetCert!}
      />

      <UserCertificatesModal
        isOpen={modals.userModal}
        onClose={() => setModals((prev) => ({ ...prev, userModal: false }))}
        user_name={targetCert?.user?.user_name || ''}
        birth_date={targetCert?.user?.birth_date || ''}
        phone_number={targetCert?.user?.phone_number || ''}
        certificates={targetUser}
      />

      {targetCert?.education_center && (
        <EducationCenterModal
          isOpen={modals.centerModal}
          onClose={() => setModals((prev) => ({ ...prev, centerModal: false }))}
          education_center={targetCert.education_center!}
        />
      )}
    </div>
  );
};

export default CertificateTable;