from django.contrib import admin
from .models.EducationCenter import EducationCenter
from .models.EducationCenterSession import EducationCenterSession

@admin.register(EducationCenter)
class EducationCenterAdmin(admin.ModelAdmin):
    list_display = ['center_name']

@admin.register(EducationCenterSession)
class EducationCenterSessionAdmin(admin.ModelAdmin):
    list_display = ['education_center', 'center_session']
