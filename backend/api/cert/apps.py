from django.apps import AppConfig

class CertificateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.cert'
    verbose_name = 'Certificate'
    
    def ready(self):
        import api.cert.signals  # noqa