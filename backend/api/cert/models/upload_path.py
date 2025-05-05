def certificate_pdf_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'certificates/{instance.issue_number}.{ext}'