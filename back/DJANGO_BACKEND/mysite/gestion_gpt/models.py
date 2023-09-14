from django.db import models

class RegistroPeticionChatGPT(models.Model):
    id_user_gpt= models.IntegerField()
    fecha= models.DateTimeField()
    
    class Meta:
        unique_together = (("id_user_gpt", "fecha"),)


def __str__(self) :
    return self.id
