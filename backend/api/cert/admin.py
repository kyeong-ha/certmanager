from django.contrib import admin
from api.cert.models.Certificate import Certificate
from api.logs.admin import ReissueLogInline

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = [
        'uuid',
        'issue_number',
        'issue_date',
        'course_name',
        'get_user_name',
        'get_user_phone',
        'get_center_name',
        'get_center_session',
    ]
    search_fields = ['issue_number', 'user__user_name', 'user__phone_number']
    list_filter = ['issue_date', 'education_session__education_center__center_name']
    ordering = ['-issue_date']
    inlines = [ReissueLogInline]

    def get_user_name(self, obj):
        return obj.user.user_name
    get_user_name.short_description = '성명'

    def get_user_phone(self, obj):
        return obj.user.phone_number
    get_user_phone.short_description = '전화번호'

    def get_center_name(self, obj):
        return obj.education_session.education_center.center_name if obj.education_session and obj.education_session.education_center else None
    get_center_name.short_description = '교육원명'

    def get_center_session(self, obj):
        return obj.education_session.center_session if obj.education_session and obj.education_session.education_center else None
    get_center_session.short_description = '기수'