from django.db import models

class EducationCenter(models.Model):
    name = models.CharField(max_length=255)
    session = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.session})" if self.session else self.name
