import uuid
from django.db import models

class EducationCenter(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    center_name = models.CharField(max_length=255)
    center_session = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
   
    class Meta:
        ordering = ['center_name']
         
    def __str__(self):
        return f"{self.center_name}_{self.center_session}" if self.center_session==None else self.center_name
