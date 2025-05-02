from docx import Document
from docx.shared import Cm
import os
from docx2pdf import convert

def generate_certificate_document(cert, output_dir, file_base_name):
    """
    cert 객체를 기반으로 Word 문서 작성 후 PDF로 변환
    """
    # 템플릿 불러오기
    template_path = os.path.join("template", "phoenix_ver1.docx")
    doc = Document(template_path)

    replacements = {
        "$성명$": cert.user.user_name,
        "$생년월일$": cert.user.birth_date,
        "$자격과정$": cert.course_name,
        "$발급번호$": cert.issue_number,
        "$등록번호$": "",  # 등록번호가 별도로 있으면 여기에 추가
        "$발급일자$": cert.issue_date.strftime("%Y-%m-%d") if cert.issue_date else "",
    }

    for para in doc.paragraphs:
        for key, value in replacements.items():
            if key in para.text:
                para.text = para.text.replace(key, str(value))

    # Word 파일 저장
    word_path = os.path.join(output_dir, f"{file_base_name}.docx")
    doc.save(word_path)

    # PDF로 변환
    pdf_path = os.path.join(output_dir, f"{file_base_name}.pdf")
    convert(word_path, pdf_path)

    return word_path, pdf_path
