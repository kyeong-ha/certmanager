from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('issue_number', 'name', 'education_center', 'issue_date', 'course_name')
    search_fields = ('issue_number', 'name', 'education_center', 'phone_number')
    list_filter = ('issue_date', 'education_center', 'course_name')