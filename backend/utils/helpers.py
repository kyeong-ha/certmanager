import os

def certificate_copy_file_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'certificate/copy_file/{instance.issue_number}.{ext}'

def certificate_photo_upload_to(instance, filename):
    """
    - 온라인교육(is_online=True): user_id 기반
    - 오프라인교육(is_online=False): yyyy년/mm월dd일/분류코드_교육원_기수_발급일자/성명_생년월일.jpg
    """
    base, ext = os.path.splitext(filename)
    if instance.is_online:
        return f"images/{instance.user.user_id}{ext}"
    else:
        issue_type = instance.issue_type
        date = instance.issue_date
        session = instance.education_session
        user = instance.user
        
        fname = f"{user.user_name}_{user.birth_date.strftime('%y%m%d')}{ext}"
        # 오프라인교육의 경우 디렉토리 구조를 yyyy년/mm월dd일/분류코드_교육원_기수_발급일자/images/로 설정
        year_dir  = f"{date.year}년"
        month_dir = f"{date.month:02d}월{date.day:02d}일"
        session_dir = (
            f"{issue_type}_"
            f"{session.education_center.center_name}_"
            f"{session.center_session}기_"
            f"{date.strftime('%y%m%d')}"
        )
        return os.path.join(
            year_dir,
            month_dir,
            session_dir,
            "images",
            fname
        )
        
def user_photo_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'user/photo/{instance.uuid}.{ext}'