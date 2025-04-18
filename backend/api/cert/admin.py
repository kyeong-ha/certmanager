from django.contrib import admin
from api.cert.models.Certificate import Certificate
from api.logs.admin import ReissueLogInline

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = [
        'uuid',
        'get_user_name',
        'get_user_phone',
        'issue_number',
        'issue_date',
        'course_name',
        'get_edu_name',
        'get_edu_session',
    ]
    search_fields = ['issue_number', 'user__user_name', 'user__phone_number']
    list_filter = ['issue_date', 'education_center__edu_name']
    ordering = ['-issue_date']
    inlines = [ReissueLogInline]

    def get_user_name(self, obj):
        return obj.user.user_name
    get_user_name.short_description = '성명'

    def get_user_phone(self, obj):
        return obj.user.phone_number
    get_user_phone.short_description = '전화번호'

    def get_edu_name(self, obj):
        return obj.education_center.edu_name
    get_edu_name.short_description = '교육원명'

    def get_edu_session(self, obj):
        return obj.education_center.session
    get_edu_session.short_description = '기수'