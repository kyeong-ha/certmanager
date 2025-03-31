from django.urls import path
from .views.certificate_view import search_certificates, update_certificate

urlpatterns = [
    path('search/', search_certificates),
    path('update/', update_certificate),
]