/**
  * @description 자격증의 copy_file을 출력하는 함수
  * @param file 출력 대상 PDF 파일 URL
 */
export function printCopyFile(file: string) {
  const printWindow = window.open(file, '_blank');

  // 팝업 차단이 설정되어 있는 경우
  if (!printWindow) {
    alert('팝업 차단이 설정되어 있어 PDF를 열 수 없습니다.');
    return;
  }
  // PDF 파일이 로드된 후 인쇄
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
