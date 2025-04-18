from django.contrib import admin
from api.edu.models.EducationCenter import EducationCenter

@admin.register(EducationCenter)
class EducationCenterAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'edu_name', 'session']
    search_fields = ['edu_name', 'session']
    ordering = ['edu_name']