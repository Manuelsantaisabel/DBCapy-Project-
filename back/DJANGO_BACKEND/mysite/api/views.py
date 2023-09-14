import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import Item
from .serializers import ItemSerizlizers
from django.http import JsonResponse
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


def Responde():
     respuesta= JsonResponse({"name":"Manuel","age":22,"message":"El alumno es mu guapo"})
     return respuesta
     
     

@api_view(['GET'])
def getData(request):
     items= Item.objects.all()
     serializer = ItemSerizlizers(items,many=True)
     return Response(serializer.data)


@api_view(['POST'])
def addItem(request):
     serializer = ItemSerizlizers(data=request.data)
     if serializer.is_valid():
          serializer.save()
     return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def botsentence(request):
     respuesta=  redirect('bot_app_api:bot_answer')
     return respuesta



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def botsentence2(request):
     json_message= request.GET.get('json_message',None)
     if json_message:
          try: 
               parseo_data= json.loads(json_message)
               if "message" in parseo_data:
                    json_data= parseo_data["message"]
                    json_data_str = json.dumps(json_data)
                    url = '/bot/bot_answer2/?json_message={}'.format(json_data_str)
                    respuesta=  redirect(url)
                    return respuesta
               else:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=400)
              
               
                       
          except ValueError:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=400)
     else: 
        response_data = {'message': 'Error', 'data': 'No se mando un Json'}
        return JsonResponse(response_data, status=400)





