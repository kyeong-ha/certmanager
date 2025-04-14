import pandas as pd
from django.core.management.base import BaseCommand
from apps.certificate.models.Certificate import Certificate 
from apps.certificate.models import EducationCenter
class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Import certificates from Excel file
        excel_path = 'apps/certificate/management/data/certificates.xlsx'
        
        try:
            df = pd.read_excel(excel_path)

        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f"Excel file not found at {excel_path}"))
            return

        certificates = []
        for _, row in df.iterrows():
            try:
                issue_date_value = None
                if pd.notna(row['issue_date']):
                    issue_date_value = pd.to_datetime(row['issue_date']).date()
                    
                    education_center_obj, _ = EducationCenter.objects.get_or_create(name=row['education_center'], session=row['session'])
                certificates.append(Certificate(
                    issue_type=row['issue_type'],
                    issue_number=row['issue_number'],
                    issue_date=issue_date_value,
                    user_name=row['user_name'],
                    birth_date=str(row['birth_date']),
                    course_name=row['course_name'],
                    phone_number=row['phone_number'],
                    education_center=education_center_obj,
                    user_id=row['user_id'] if pd.notna(row['user_id']) else None,
                    postal_code=str(row['postal_code']),
                    address=row['address'] if pd.notna(row['address']) else None,
                    note=row['note'] if pd.notna(row['note']) else None,
                ))
            except Exception as e:
                self.stderr.write(self.style.WARNING(f"Row skipped due to error: {e}"))

        try:
            Certificate.objects.bulk_create(certificates)
            self.stdout.write(self.style.SUCCESS(f'{len(certificates)} certificates imported successfully'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Database insertion failed: {e}"))
