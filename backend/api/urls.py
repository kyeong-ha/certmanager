from django.urls import path, include

urlpatterns = [
    path('cert/', include('api.cert.urls')),
    path("dashboard/", include("api.dashboard.urls")),
    path('center/', include('api.center.urls')),
    path('user/', include('api.user.urls')),
    path('logs/', include('api.logs.urls')),
]
