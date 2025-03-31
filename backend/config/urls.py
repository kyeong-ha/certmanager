from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('certificate/', include('apps.certificate.urls')), 
]
