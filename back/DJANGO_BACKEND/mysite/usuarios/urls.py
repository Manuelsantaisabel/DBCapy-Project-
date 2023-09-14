from django.urls import path,include
from . import views

urlpatterns= [
    path('get_name', views.getData), 
    path ('get_CSRToken',views.getCsrfToken),
    
]