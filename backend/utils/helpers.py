def certificate_copy_file_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'certificate/copy_file/{instance.issue_number}.{ext}'

def user_photo_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'user/photo/{instance.uuid}.{ext}'