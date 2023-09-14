from django.urls import path,include
from . import views

urlpatterns= [
    path('get_name', views.getData), 
    path ('add_item',views.addItem),
    path ('bot_sentence',views.botsentence),
    path ('bot_sentence2',views.botsentence2),
]

