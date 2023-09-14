from django.urls import path
from . import views

app_name= 'gestion_gpt'
urlpatterns= [
    path ('peticion_gpt/',views.peticion_gpt,name='peticion_gpt'),

]

