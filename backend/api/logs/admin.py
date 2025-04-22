from django.contrib import admin
from api.logs.models.ReissueLog import ReissueLog

class ReissueLogInline(admin.TabularInline):
    model = ReissueLog
    extra = 0
    fields = ['certificate_uuid', 'reissue_date', 'delivery_type', 'reissue_cost']
    readonly_fields = ['reissue_date']
