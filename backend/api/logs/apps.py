from django.apps import AppConfig

class ReissueLogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.logs'
    verbose_name = 'ReissueLog'