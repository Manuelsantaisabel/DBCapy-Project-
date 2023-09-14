from django.shortcuts import render
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import Item
from django.http import JsonResponse
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse
from django.middleware import csrf
from django.http import JsonResponse


# Create your views here.
@api_view(['GET'])
def getData(request):

     return Response("el pepe")

@api_view(['GET'])
def getCsrfToken(request):
     csrf_token = csrf.get_token(request)
     print(csrf_token)
     return JsonResponse({'csrfToken': csrf_token})
