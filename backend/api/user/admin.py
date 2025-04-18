from django.contrib import admin
from api.user.models.User import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'user_name', 'birth_date', 'phone_number', 'user_id']
    search_fields = ['user_name', 'phone_number', 'user_id']
    ordering = ['-created_at']
