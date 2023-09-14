from django.db import models

class RegistroMensajesChatGPT(models.Model):
    
    id_message= models.AutoField(primary_key=True) 
    id_user_gpt= models.IntegerField()
    text_message= models.CharField(blank=False,max_length=2000)
    class_message= models.CharField(blank=False,max_length=200)


    def __str__(self) :
        return self.id_message

