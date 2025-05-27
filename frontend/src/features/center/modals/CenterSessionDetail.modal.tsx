// ────────────────────────────────────────────────────────────────────
// *EducationCenterSessionDetail* 모달 – 통계 Badge + 회원 요약 Table + 로그 탭
// 기존 코드 기반으로 UI 확장 (발급현황 KPI / 회원표 / 로그)
// ───────────────────────────────────────────────────────────────────

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EducationCenterSessionDetail } from '@/features/center/types/EducationCenterSession.type';

//----------------------------------------------------------------------//
interface CenterSessionDetailModal {
  isOpen?: boolean;
  onClose: () => void;
  education_session: EducationCenterSessionDetail;
}
//----------------------------------------------------------------------//

/* ----- Modal -------------------------------------------------------- */
const CenterSessionDetailModal: React.FC<CenterSessionDetailModal> = ({ isOpen, onClose, education_session }) => {
  /* --- 1. Handlers --- */
  // 1.1. 모달 닫기
  if (!isOpen) return null;
  
  const users = education_session.users ?? [];
  const logs = education_session.logs ?? [];
  const sessionLogs = (education_session as any).session_logs ?? [];
  const allLogs = [...logs, ...sessionLogs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // 1.2. 상태에 따른 배지 UI 설정
  const statusVariant = (() => {
    switch (education_session.issue_status) {
      case 'DELIVERED':
        return 'default';
      case 'ISSUED':
        return 'destructive';
      default:
        return 'secondary';
    }
  })();

  /* --- 2. Render --- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* modal 너비 확대 */}
      <DialogContent className="max-w-3xl">
        {/* 3.1. 모달 헤더 */}
        <DialogHeader>
          <DialogTitle>{education_session.center_session}기 상세정보</DialogTitle>
        </DialogHeader>

        {/* 3.2. KPI Badges */}
        {/* 발급현황, 배송일자 KPI */}
        <div className="flex flex-wrap gap-2 my-2">
          <Badge variant={statusVariant}>
            {education_session.issue_status} · {education_session.issue_count}개
          </Badge>
          {education_session.issue_date && (
            <Badge variant="outline">최초 발급일 : {education_session.issue_date}</Badge>
          )}
          {education_session.delivery_date && (
            <Badge variant="outline">배송일 : {education_session.delivery_date}</Badge>
          )}
        </div>

        {/* 3.3. 기본 정보 */}
        <div className="space-y-2 text-sm mt-2">
          <div>
            <strong>교육기관:</strong>{' '}
            {education_session.education_center?.center_name ?? '정보 없음'}
          </div>
          <div>
            <strong>배송주소:</strong> {education_session.delivery_address || '-'}
          </div>
          <div>
            <strong>운송장 번호:</strong>{' '}
            {education_session.tracking_numbers?.join(', ') || '-'}
          </div>
          <div>
            <strong>단가:</strong> {education_session.unit_price ?? '-'} 원
          </div>
        </div>

        {/* 3.4. Tabs – 회원 요약 & 로그 */}
        <Tabs defaultValue="users" className="mt-6">
          <TabsList>
            <TabsTrigger value="users">소속 회원</TabsTrigger>
            <TabsTrigger value="logs">로그</TabsTrigger>
          </TabsList>

          {/* ── 회원 요약 Table ── */}
          <TabsContent value="users">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>성명</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>발급번호</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.uuid}>
                    <TableCell>{u.user_name}</TableCell>
                    <TableCell>{u.phone_number}</TableCell>
                    <TableCell>
                      { logs
                        .filter((l) => l.certificate_uuid.user.uuid === u.uuid)
                        .map((l) => l.certificate_uuid.issue_number)
                        .join(', ') || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* ── 로그 목록 ── */}
          <TabsContent value="logs">
            <ul className="space-y-1 text-sm max-h-60 overflow-y-auto pr-2">
              {logs.map((log) => (
                <li key={log.uuid}>
                  • [{log.reissue_date}] {log.certificate_uuid.issue_number} –{' '}
                  {log.delivery_type}{' '}
                  {log.reissue_cost && `(${log.reissue_cost}원)`}{' '}
                  <span className="text-gray-500">
                    ({log.created_at.slice(0, 10)})
                  </span>
                </li>
              ))}
              {logs.length === 0 && <li className="text-gray-400">로그가 없습니다.</li>}
            </ul>
          </TabsContent>
        </Tabs>

        {/* 3.5. 닫기 버튼 */}
        <div className="text-right mt-6">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CenterSessionDetailModal;
