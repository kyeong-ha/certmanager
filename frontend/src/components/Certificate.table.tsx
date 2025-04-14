import React, { useState } from 'react';
import { Certificate } from '../types/Certificate.type';
import { getUserInfo } from '../services/getUserInfo';
import UserCertificatesModal from './UserCertificates.modal';
import PrintPreviewModal from './PrintPreview.modal';
import CertificateDetailModal from './CertificateDetail.modal';
import EducationCenterModal from './EducationCenter.modal';
import ContextMenu from './ui/ContextMenu';

interface Props {
  results: Certificate[];
}

const CertificateTable: React.FC<Props> = ({ results }) => {
  const [targetCert, setTargetCert] = useState<Certificate | null>(null);
  const [targetUser, setTargetUser] = useState<Certificate[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    columnKey: string;
  } | null>(null);
  const [modals, setModals] = useState({
    detail: false,
    print: false,
    user: false,
    center: false,
  });

  const handleCellClick = (
    e: React.MouseEvent,
    cert: Certificate,
    columnKey: string
  ) => {
    e.preventDefault();
    setTargetCert(cert);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      columnKey,
    });
  };

  const handleMenuSelect = (action: string) => {
    if (!contextMenu) return;
    switch (action) {
      case '상세보기':
        setModals((prev) => ({ ...prev, detail: true }));
        break;
      case '출력하기':
        setModals((prev) => ({ ...prev, print: true }));
        break;
      case '회원정보':
        setModals((prev) => ({ ...prev, user: true }));
        handleViewUserInfo(targetCert!);
        break;
      case '교육원정보':
        setModals((prev) => ({ ...prev, center: true }));
        break;
    }
    setContextMenu(null);
  };

  const handleViewUserInfo = async (certificate: Certificate) => {
    try {
      const results = await getUserInfo(
        certificate.user_name,
        certificate.birth_date,
        certificate.phone_number
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
              key={row.issue_number}
              onClick={(e) => handleCellClick(e, row, 'issue_number')}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="px-2 py-1 border text-center">{index + 1}</td>
              <td className="px-2 py-1 border">{row.issue_date}</td>
              <td className="px-2 py-1 border">{row.issue_number}</td>
              <td className="px-2 py-1 border">{row.user_name}</td>
              <td className="px-2 py-1 border">{row.birth_date}</td>
              <td className="px-2 py-1 border">{row.phone_number}</td>
              <td className="px-2 py-1 border">{row.course_name}</td>
              <td
                className="px-2 py-1 border"
                onClick={(e) => handleCellClick(e, row, 'education_center')}
              >
                {row.education_center?.name} {row.education_center?.session}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelect={handleMenuSelect}
          onClose={() => setContextMenu(null)}
          options={[
            '회원정보',
            '교육원정보',
            '상세보기',
            '출력하기'
          ]}
        />
      )}

      <CertificateDetailModal
        isOpen={modals.detail}
        onClose={() => setModals((prev) => ({ ...prev, detail: false }))}
        certificate={targetCert!}
      />

      <PrintPreviewModal
        isOpen={modals.print}
        onClose={() => setModals((prev) => ({ ...prev, print: false }))}
        certificate={targetCert!}
      />

      <UserCertificatesModal
        isOpen={modals.user}
        onClose={() => setModals((prev) => ({ ...prev, user: false }))}
        user_name={targetCert?.user_name || ''}
        birth_date={targetCert?.birth_date || ''}
        phone_number={targetCert?.phone_number || ''}
        certificates={targetUser}
      />

      {targetCert?.education_center && (
        <EducationCenterModal
          isOpen={modals.center}
          onClose={() => setModals((prev) => ({ ...prev, center: false }))}
          education_center={targetCert.education_center}
        />
      )}
    </div>
  );
};

export default CertificateTable;
