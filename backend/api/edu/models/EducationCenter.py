import uuid
from django.db import models

class EducationCenter(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    edu_name = models.CharField(max_length=255)
    session = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
   
    class Meta:
        ordering = ['edu_name']
         
    def __str__(self):
        return f"{self.edu_name}_{self.session}" if self.session==None else self.edu_name
