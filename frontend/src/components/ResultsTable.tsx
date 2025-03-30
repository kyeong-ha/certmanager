import React from 'react';
import { Certificate } from '../types/certificate.type';

interface ResultsTableProps {
  results: Certificate[];
  onSelect: (record: Certificate) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onSelect }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>발급번호</th>
          <th>성명</th>
          <th>교육원명</th>
          <th>발급일자</th>
        </tr>
      </thead>
      <tbody>
        {results.map((record) => (
          <tr key={record.id} onClick={() => onSelect(record)}>
            <td>{record.issue_number}</td>
            <td>{record.name}</td>
            <td>{record.education_center}</td>
            <td>{record.issue_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;