import json

import sys
import os

from django.shortcuts import render
from django.contrib import messages
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication




from .models import RegistroMensajesChatGPT

#Vamos a recibir una id de usuario con dos opciones de función . GUARDAR un mensaje o CARGAR LOS MENSAJES.



#GUARDAR
#Vamos a recibir un JSON con {id:"",text:"",class:""}
#vamos a guardar dicho mensaje dentro de nuestra bd con un id de mensaje id_message. 
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def message_save(request):
    json_message= request.body.decode('utf-8')
    if json_message:
        try:
            #Solo tenemos que procesar nuestro Json y ver que es un dato válido.
            parseo_data= json.loads(json_message)
            if "id"and "text" and "class_name" in parseo_data:
                 id_usario_guardar= parseo_data["id"]
                 mensaje_para_guardar= parseo_data["text"]
                 clase_mensaje_guardar= parseo_data["class_name"]
            else:
                response_data = {'message': 'Error', 'data': 'JSON sin parametros adecuados'}
                return JsonResponse(response_data, status=200)
                 
        except ValueError:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=200)
    else: 
        response_data = {'message': 'Error', 'data': 'No se mando un Json'}
        return JsonResponse(response_data, status=200)
        
    
    guardar= RegistroMensajesChatGPT()
    guardar.id_user_gpt= id_usario_guardar
    guardar.text_message= mensaje_para_guardar
    guardar.class_message= clase_mensaje_guardar
    guardar.save()
    respuesta= JsonResponse({"message":"Mensaje guardado","data":mensaje_para_guardar})
    return (respuesta)
    



#CARGAR
#Vamos a recibir un JSON con {id:""}
#vamos a buscar todos los mensajes de nuestro modelo con id_user_gpt, los devolveremos en un formato JSON
#con formato {"texto":"" , "clase":""}
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def message_recovery(request):
    json_message= request.body.decode('utf-8')
    if json_message:
        try:
            #Solo tenemos que procesar nuestro Json y ver que es un dato válido.
            parseo_data= json.loads(json_message)
            if "id" in parseo_data:
                 id_usario_retornar= parseo_data["id"]
                 
            else:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=200)
                 
        except ValueError:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=200)
    else: 
        response_data = {'message': 'Error', 'data': 'No se mando un Json'}
        return JsonResponse(response_data, status=200)
    
    mensajes_usuario = RegistroMensajesChatGPT.objects.filter(id_user_gpt=id_usario_retornar)
    # Crear una lista de mensajes en formato JSON
    mensajes_json = [
        {"id_message": mensaje.id_message, "text_message": mensaje.text_message, "class_message": mensaje.class_message}
        for mensaje in mensajes_usuario
    ]
    
    return Response(mensajes_json)


   


