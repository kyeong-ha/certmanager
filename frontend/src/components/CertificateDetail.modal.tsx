import React, { useState } from 'react';
import { Certificate } from '../types/Certificate.type';
import { EducationCenter } from '@/types/EducationCenter.type';
import { ReissueLog } from '@/types/ReissueLog.type';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
}

const CertificateDetailModal: React.FC<Props> = ({ isOpen, onClose, certificate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'preview'>('info');
  
  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">자격증 상세보기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('preview')}
          >
            미리보기
          </button>

        </div>

        {/* Tab Content */}
        {activeTab === 'info' ? (
          <div className="space-y-2">
            <div>이름: {certificate.user_name}</div>
            <div>생년월일: {certificate.birth_date}</div>
            <div>자격과정: {certificate.course_name}</div>
            <div>발급일자: {certificate.issue_date}</div>
            <div>발급번호: {certificate.issue_number}</div>
            <div>교육기관: {certificate.education_center?.name || null}_{certificate.education_center?.session || null}</div>

            {/* 재발급 이력 */}
            {Object.keys(certificate).includes('reissue_logs') && (
              <div className="mt-4">
                <strong>🔁 재발급 이력</strong>
                <ul className="list-disc list-inside text-sm mt-1">
                  {certificate.reissue_logs?.map((log, index) => (
                    <li key={index}>
                      {log.reissue_date} / {log.delivery_type} {log.reissue_cost ? `/ ${log.reissue_cost.toLocaleString()}원` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[400px] flex justify-center items-center border rounded-lg overflow-hidden">
            <img
              src={certificate.image_url}
              alt="자격증 미리보기"
              className="object-contain max-h-full max-w-full"
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between">
          <a
            href={certificate.pdf_url || certificate.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            download
          >
            PDF 다운로드
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>

    </>
  );
};

export default CertificateDetailModal;
