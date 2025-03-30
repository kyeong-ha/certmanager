import React from 'react';
import { Certificate } from '../types/certificate.type';

interface PrintPreviewProps {
  data: Certificate[];
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ data }) => {
  return (
    <div className="print-preview">
      <h3>인쇄 미리보기</h3>
      <ul>
        {data.map((record) => (
          <li key={record.id}>
            {record.name} ({record.issue_number}) - {record.education_center}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrintPreview;