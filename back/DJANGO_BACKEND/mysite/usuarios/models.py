from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager,PermissionsMixin

# Create your models here.


class Comprobador_Usuarios(UserManager):

    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError('Los usuarios deben tener un email')
        
        username = extra_fields.get('username')
        if not username:
            username = email.split('@')[0]

        user= self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save()
        return user

class CustomUser(AbstractUser,PermissionsMixin):

    STATUS= (
        ('regular','regular'),
        ('subscriptor','subscriptor'),
        ('subscriptro_plus','subscriptro_plus'),
        ('moderador','moderador'),
        ('normal','normal'),
        ('premium','premium')
    )
    username= models.CharField(max_length=255, unique=True)  
    email= models.EmailField(unique=True,max_length=255)
    estatus = models.CharField(max_length=100, choices=STATUS,default='regular')
    description = models.TextField('Descripcion',max_length=600,default='',blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS =['username','estatus','description']
    objects= Comprobador_Usuarios()

  

    def __str__(self) :
        return self.username


    

