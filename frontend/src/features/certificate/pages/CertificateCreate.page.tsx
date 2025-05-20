import MainLayout from '@/layout/MainLayout';
import { useState } from "react";
import { CertificateSummary } from "@/features/certificate/types/Certificate.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatIssueNumbers } from "@/utils/formatIssueNumbers";
import { searchCertificates } from "@/features/certificate/services/cert.api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateCertificatesPdf } from '@/features/certificate/services/cert.api';

export default function CertificateCreatePage() {
  const [filterType, setFilterType] = useState<
    "education_center" | "user_name" | "phone_number" | "issue_number"
  >("education_center");

  const [centerName, setCenterName] = useState("");
  const [center_session, setCenterSession] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [issueNumber, setIssueNumber] = useState("");

  const [certificateList, setCertificateList] = useState<CertificateSummary[]>([]);
  const [selectedCertificates, setSelectedCertificates] = useState<CertificateSummary[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const params: any = {};
      if (filterType === "education_center") {
        params.center_name = centerName;
        params.center_session = center_session;
      } else {
        params.filter_type = filterType;
        params.search_value =
          filterType === "user_name"
            ? userName
            : filterType === "phone_number"
            ? phoneNumber
            : issueNumber;
      }
  
      const certificates = await searchCertificates(params);
      setCertificateList(certificates);
      setSelectedCertificates([]);
    } catch (error) {
      console.error(error);
      alert("발급 대상 검색 중 오류가 발생했습니다.");
    }
  };

  const toggleSelectCertificate = (cert: CertificateSummary) => {
    setSelectedCertificates((prev) => {
      if (prev.find((c) => c.uuid === cert.uuid)) {
        return prev.filter((c) => c.uuid !== cert.uuid);
      } else {
        return [...prev, cert];
      }
    });
  };

  const openConfirmModal = () => {
    if (selectedCertificates.length === 0) {
      alert("발급할 자격증을 선택하세요.");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleIssueCertificates = async () => {
    try {
      const uuids = selectedCertificates.map((c) => c.uuid);
      await generateCertificatesPdf(uuids);
      alert("발급 요청이 완료되었습니다.");
      setIsConfirmModalOpen(false);
      setCertificateList([]);
      setSelectedCertificates([]);
    } catch (error) {
      console.error(error);
      alert("발급 중 오류가 발생했습니다.");
    }
  };

  const isSelected = (cert: CertificateSummary) =>
    selectedCertificates.some((c) => c.uuid === cert.uuid);

  const handleRowClick = (cert: CertificateSummary) => {
    toggleSelectCertificate(cert);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCertificates(certificateList);
    } else {
      setSelectedCertificates([]);
    }
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen">
        {/* 🔵 상단 고정 영역 */}
        <div className="sticky top-0 z-10 bg-white p-4 border-b space-y-4">
          <h1 className="text-2xl font-bold">자격증 발급</h1>

          {/* 검색 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="education_center"
                  checked={filterType === "education_center"}
                  onChange={() => setFilterType("education_center")}
                />
                교육원명+기수
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="user_name"
                  checked={filterType === "user_name"}
                  onChange={() => setFilterType("user_name")}
                />
                이름
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="phone_number"
                  checked={filterType === "phone_number"}
                  onChange={() => setFilterType("phone_number")}
                />
                전화번호
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="issue_number"
                  checked={filterType === "issue_number"}
                  onChange={() => setFilterType("issue_number")}
                />
                발급번호
              </label>
            </div>

            {/* 검색 입력창 */}
            {filterType === "education_center" && (
              <div className="flex gap-2">
                <Input
                  placeholder="교육원명 (center_name)"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                />
                <Input
                  placeholder="기수 (center_session)"
                  value={center_session}
                  onChange={(e) => setCenterSession(e.target.value)}
                />
              </div>
            )}
            {filterType === "user_name" && (
              <Input
                placeholder="이름 (user_name)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            )}
            {filterType === "phone_number" && (
              <Input
                placeholder="전화번호 (phone_number)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            )}
            {filterType === "issue_number" && (
              <Input
                placeholder="발급번호 (issue_number)"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
              />
            )}

            <Button  variant="outline" type="submit" className="ml-auto">
              발급 대상 조회
            </Button>
          </form>
        </div>

        {/* 📋 발급 대상 테이블 */}
        <div className="p-4">
          {certificateList.length > 0 && (
            <div className="overflow-x-auto border rounded">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedCertificates.length === certificateList.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="p-2">발급번호</th>
                    <th className="p-2">성명</th>
                    <th className="p-2">생년월일</th>
                    <th className="p-2">전화번호</th>
                    <th className="p-2">자격과정</th>
                    <th className="p-2">교육기관_기수</th>
                  </tr>
                </thead>
                <tbody>
                  {certificateList.map((cert) => (
                    <tr
                      key={cert.uuid}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        isSelected(cert) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleRowClick(cert)}
                    >
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={isSelected(cert)}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="p-2">{cert.issue_number}</td>
                      <td className="p-2">{cert.user.user_name}</td>
                      <td className="p-2">{cert.user.birth_date}</td>
                      <td className="p-2">{cert.user.phone_number}</td>
                      <td className="p-2">{cert.course_name}</td>
                      <td className="p-2">
                        {cert.center_name}_{cert.center_session}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 🔵 하단 고정 버튼 */}
        {certificateList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
            <Button onClick={openConfirmModal} className="w-full">
              선택한 자격증 발급하기
            </Button>
          </div>
        )}

        {/* ✅ 발급 확인 모달 */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>발급할 자격증 요약 확인</DialogTitle>
          </DialogHeader>

          {/* ✅ 과정별 요약 + 수강생 상세 펼치기 */}
          <Accordion type="multiple" className="space-y-2">
            {Object.entries(
              selectedCertificates.reduce<Record<string, CertificateSummary[]>>((acc, cert) => {
                acc[cert.course_name] = acc[cert.course_name] || [];
                acc[cert.course_name].push(cert);
                return acc;
              }, {})
            ).map(([courseName, certificates]) => (
              <AccordionItem key={courseName} value={courseName}>
                <AccordionTrigger className="text-lg font-semibold">
                  {courseName} ({certificates.length}명)
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-40 pr-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-2">발급번호</th>
                          <th className="p-2">발급일자</th>
                          <th className="p-2">성명</th>
                          <th className="p-2">생년월일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.map((cert) => (
                          <tr key={cert.uuid} className="hover:bg-gray-50">
                            <td className="p-2">{cert.issue_number}</td>
                            <td className="p-2">{cert.issue_date}</td>
                            <td className="p-2">{cert.user.user_name}</td>
                            <td className="p-2">{cert.user.birth_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator className="my-4" />

          {/* ✅ 발급번호 요약 */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">발급번호 요약: </span>
              {formatIssueNumbers(selectedCertificates.map((cert) => cert.issue_number))}
            </div>
            <div>
              <span className="font-semibold">총 발급 수: </span>
              {selectedCertificates.length}개
            </div>
          </div>

          {/* ✅ 발급 버튼 */}
          <Button onClick={handleIssueCertificates} className="w-full mt-6">
            최종 발급 요청
          </Button>
        </DialogContent>
      </Dialog>
      </div>
      </MainLayout>
  );
}