from django.contrib import admin
from api.center.models.EducationCenter import EducationCenter

@admin.register(EducationCenter)
class EducationCenterAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'center_name', 'center_session']
    search_fields = ['center_name', 'center_session']
    ordering = ['center_name']