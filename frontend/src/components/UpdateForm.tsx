import React, { useState, useEffect } from 'react';
import { Certificate } from '../types/certificate.type';

interface UpdateFormProps {
  selectedRecord: Certificate | null;
  onUpdate: (filter: object, updateData: object) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ selectedRecord, onUpdate }) => {
  const [phone_number, setPhoneNumber] = useState('');

  useEffect(() => {
    if (selectedRecord) {
      setPhoneNumber(selectedRecord.phone_number);
    }
  }, [selectedRecord]);

  const handleUpdate = () => {
    if (selectedRecord) {
      const filter = { issue_number: selectedRecord.issue_number };
      const updateData = { phone_number };
      onUpdate(filter, updateData);
    }
  };

  return (
    <div className="update-form">
      {selectedRecord ? (
        <>
          <h3>{selectedRecord.name} 정보 수정</h3>
          <label htmlFor="phone-number">전화번호: </label>
          <input id="phone-number"
            type="text"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handleUpdate}>수정</button>
        </>
      ) : (
        <p>수정할 항목을 선택하세요.</p>
      )}
    </div>
  );
};

export default UpdateForm;