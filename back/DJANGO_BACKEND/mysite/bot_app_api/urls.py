from django.urls import path
from . import views

app_name= 'bot_app_api'
urlpatterns= [
    path ('bot_answer/',views.bot_sentence,name='bot_answer'),
    path ('bot_answer2/',views.bot_sentence2,name='bot_answer2'),

]

