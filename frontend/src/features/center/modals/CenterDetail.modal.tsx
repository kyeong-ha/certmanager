import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InputBlock from '@/components/ui/InputBlock';
import { updateEducationCenter } from '@/features/center/services/center.api';
import type { EducationCenterDetail, EducationCenterWriteForm } from '../types/EducationCenter.type';
import CenterSessionDetailModal from './CenterSessionDetail.modal';
import type { EducationCenterSessionDetail } from '../types/EducationCenterSession.type';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  center: EducationCenterDetail;
  onUpdate?: (updated: EducationCenterDetail) => void;
}

export default function EducationCenterDetailModal({ isOpen, onClose, center, onUpdate }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<EducationCenterWriteForm | null>(null);

  const [selectedSession, setSelectedSession] = useState<EducationCenterSessionDetail | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const sessionList = center.center_session_list ?? [];

  useEffect(() => {
    if (isOpen) {
      setEditMode(false);
      setFormData({ ...center });
    }
  }, [isOpen, center]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => prev && { ...prev, [name]: value });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const updated = await updateEducationCenter(center.uuid, formData);
      onUpdate?.(updated); // 수정 성공 시 부모에게 반영
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="flex flex-col max-h-[90vh]">
            {/* 헤더 영역 */}
            <DialogHeader className="p-4 border-b sticky top-0 bg-white z-10">
              <DialogTitle>교육기관 상세정보</DialogTitle>
            </DialogHeader>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-4">
              {formData ? (
                <>
                  <InputBlock label="기관명" name="center_name" value={formData.center_name} onChange={handleChange} editable={editMode} />
                  <InputBlock label="전화번호" name="center_tel" value={formData.center_tel ?? ''} onChange={handleChange} editable={editMode} />
                  <InputBlock label="주소" name="center_address" value={formData.center_address ?? ''} onChange={handleChange} editable={editMode} />
                  <InputBlock label="대표자" name="ceo_name" value={formData.ceo_name ?? ''} onChange={handleChange} editable={editMode} />
                  <InputBlock label="대표자 연락처" name="ceo_mobile" value={formData.ceo_mobile ?? ''} onChange={handleChange} editable={editMode} />
                  <InputBlock label="담당자" name="manager_name" value={formData.manager_name ?? ''} onChange={handleChange} editable={editMode} />
                  <InputBlock label="담당자 연락처" name="manager_mobile" value={formData.manager_mobile ?? ''} onChange={handleChange} editable={editMode} />

                  <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2">📦 교육기수 목록</h3>
                    {sessionList.length === 0 ? (
                      <p className="text-gray-500 text-sm">등록된 기수가 없습니다.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-2 border">기수</th>
                              <th className="p-2 border">배송주소</th>
                              <th className="p-2 border">운송장 번호</th>
                              <th className="p-2 border">생성일</th>
                              <th className="p-2 border">수정일</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* TODO: 교육기수 상세정보 모달 구현 후, 행 클릭 시 모달 연결 */}
                            {sessionList.map((session) => (
                              <tr
                                key={session.uuid}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setIsSessionModalOpen(true);
                                }}
                              >
                                <td className="p-2 border">{session.center_session}기</td>
                                <td className="p-2 border">{session.delivery_address || '-'}</td>
                                <td className="p-2 border">{session.tracking_numbers?.join(', ') || '-'}</td>
                                <td className="p-2 border">{new Date(session.created_at).toLocaleDateString()}</td>
                                <td className="p-2 border">{new Date(session.updated_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">정보를 불러오는 중입니다...</p>
              )}
            </div>

            {/* 편집/저장 버튼 영역 */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>취소</Button>
                  <Button onClick={handleSave}>저장</Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>편집</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 교육기수 상세 모달 */}
      {isSessionModalOpen && selectedSession && (
        <CenterSessionDetailModal
          isOpen={isSessionModalOpen}
          onClose={() => {
            setIsSessionModalOpen(false);
            setSelectedSession(null);
          }}
          education_session={selectedSession!}
        />
      )}
    </>
  );
}
