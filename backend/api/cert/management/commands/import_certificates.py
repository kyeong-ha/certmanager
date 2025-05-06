import pandas as pd
import datetime
from django.core.management.base import BaseCommand
from api.cert.models import Certificate
from api.edu.models.EducationCenter import EducationCenter
from api.user.models.User import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        excel_path = 'data/test_certificates.xlsx'

        try:
            df = pd.read_excel(excel_path)
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f"Excel file not found at {excel_path}"))
            return

        def safe_parse_date(date_str):
            try:
                if pd.isna(date_str) or str(date_str).strip() == '':
                    return None
                return datetime.datetime.strptime(str(date_str), '%Y.%m.%d').date()
            except Exception:
                return None

        certificates = []
        for _, row in df.iterrows():
            try:
                user_filter = {
                    'user_name': row['user_name'],
                    'birth_date': pd.to_datetime(row['birth_date']).date(),
                    'phone_number': row['phone_number']
                }

                user_obj, _ = User.objects.get_or_create(
                    **user_filter,
                    defaults={
                        'user_id': row['user_id'] if pd.notna(row['user_id']) else None,
                        'postal_code': str(row['postal_code']) if pd.notna(row['postal_code']) else '',
                        'address': row['address'] if pd.notna(row['address']) else '',
                    }
                )

                education_center_obj, _ = EducationCenter.objects.get_or_create(
                    edu_name=row['edu_name'],
                    session=row['session']
                )

                certificates.append(Certificate(
                    user=user_obj,
                    education_center=education_center_obj,
                    issue_type=row['issue_type'],
                    issue_number=row['issue_number'],
                    issue_date=pd.to_datetime(row['issue_date']).date(),
                    course_name=row['course_name'],
                ))
            except Exception as e:
                self.stderr.write(self.style.WARNING(f"Row skipped due to error: {e}"))

        try:
            Certificate.objects.bulk_create(certificates)
            self.stdout.write(self.style.SUCCESS(f'{len(certificates)} certificates imported successfully'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Database insertion failed: {e}"))
