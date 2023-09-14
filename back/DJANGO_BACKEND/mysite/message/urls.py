from django.urls import path
from . import views

app_name= 'message'
urlpatterns= [
    path ('message_recovery/',views.message_recovery,name='message_recovery'),
    path ('message_save/',views.message_save,name='message_save'),

]