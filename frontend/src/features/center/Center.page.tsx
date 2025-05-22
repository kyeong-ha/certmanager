import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EducationCenterDetail } from '@/features/center/types/EducationCenter.type';
import { EducationCenterSummary } from '@/features/center/types/EducationCenter.type';
import { deleteEducationCenters, fetchAllCenter, fetchCenterByUuid } from './services/center.api';
import MainLayout from '@/layout/MainLayout';
import CenterTable from './components/CenterTable';
import CenterDetailModal from './modals/CenterDetail.modal';
import CenterCreateModal from './modals/CenterCreate.modal';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function CenterPage() {
  const [centers, setEducationCenters] = useState<EducationCenterSummary[]>([]); // 교육기관 목록
  const [search, setSearch] = useState(''); // 검색어
  const [targetEducationCenter, setTargetEducationCenter] = useState<EducationCenterDetail | null>(null); // 선택된 교육기관 상세정보
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 교육기관 등록 모달 display 여부
  const [selectedCenterUuids, setSelectedCenterUuids] = useState<string[]>([]); // 선택된 교육기관 UUID 리스트

    useEffect(() => {
      fetchEducationCenters();
    }, []);
    
  /* 1.Handlers */
  // 1.1. 교육기관 전체 목록 가져오기
  const fetchEducationCenters = async () => {
    const response = await fetchAllCenter();
    setEducationCenters(response);
  };

  // 1.2. 필터링된 교육기관 목록
  const filteredEducationCenters = centers.filter((center) =>
    center.center_name.toLowerCase().includes(search.toLowerCase()) ||
    center.center_tel?.includes(search)
  );

  // 1.3. 새 교육기관 등록 성공 시 목록 갱신
  const handleCreateSuccess = async () => {
    fetchEducationCenters();
  };

  // 1.4. 교육기관 삭제
  const handleDeleteCenters = async () => {
    if (selectedCenterUuids.length === 0) return;
    if (!confirm(`${selectedCenterUuids.length}개 교육기관을 삭제하시겠습니까?`)) return;

    try {
      await deleteEducationCenters(selectedCenterUuids);
      toast.success(`✅ ${selectedCenterUuids.length}개 교육기관이 삭제되었습니다`);
      const updated = await fetchAllCenter();
      setEducationCenters(updated);
      setSelectedCenterUuids([]);
    } catch (error) {
      toast.error('❌ 교육기관 삭제에 실패했습니다');
    }
  };

  /* 2.Render */
  return (
    <MainLayout>
      <div className="p-6 mx-auto">
        {/* 🔍 검색 헤더 + 추가 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🔍 교육기관 검색</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)} variant="default">+ 새 교육기관 추가</Button>
          </div>
        </div>

        {/* 2.1. 검색창 */}
        <Input
          placeholder="교육기관명을 입력하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 max-w-md"
        />

        {/* 2.2. 검색결과 Table */}
        {/* 선택 삭제 + 선택 수 */}
        {selectedCenterUuids.length > 0 && (
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md border border-gray-300 mb-4">
            <span className="text-sm text-gray-700">
              ✅ <strong>{selectedCenterUuids.length}</strong>개 선택됨
            </span>
            <Button
              onClick={handleDeleteCenters}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 size={16} />
              선택 삭제
            </Button>
          </div>
        )}

        {/* 2.2. 교육기관 목록 Table */}
        <CenterTable
          centers={filteredEducationCenters}
          onSelectChange={setSelectedCenterUuids}
          onRowClick={async (centerSearch) => {
            // 더블 클릭 시 상세정보 모달 오픈
            const data = await fetchCenterByUuid(centerSearch.uuid);
            setTargetEducationCenter(data);
          }}
          onContextSelect={async (action, center) => {
            if (action === '상세보기') {
              const data = await fetchCenterByUuid(center.uuid);
              setTargetEducationCenter(data);
            }
            if (action === '삭제하기') {
              const confirmed = confirm(`"${center.center_name}" 교육기관을 삭제하시겠습니까?`);
              if (!confirmed) return;

              await deleteEducationCenters(center.uuid);
              toast.success(`"${center.center_name}" 삭제 완료 ✅`);
              fetchEducationCenters(); // 목록 새로고침
              setSelectedCenterUuids((prev) => prev.filter((uuid) => uuid !== center.uuid)); // 선택 목록에서도 제거
            }
          }}
        />


        {/* 2.3. 회원 상세정보 Modal */}
        {targetEducationCenter && (
          <CenterDetailModal
            isOpen={targetEducationCenter !== null}
            onClose={() => setTargetEducationCenter(null)}
            center={targetEducationCenter}
          />
        )}
        {/* 2.4. 교육기관 등록 Modal */}
        <CenterCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </MainLayout>
  );
}