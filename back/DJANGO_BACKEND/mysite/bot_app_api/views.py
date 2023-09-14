import json

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bot_architecture')))

from django.shortcuts import render
from django.contrib import messages
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from bot_architecture.basic_chatbot import preguntar_bot,preguntar_bot_message

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication



#Función de prueba para preguntar algo por terminal, la función que se usa es la siguiente
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def bot_sentence(request):
    
    print("se va a preguntar al usuario")
    respuesta_bot= preguntar_bot()
    respuesta_clase=respuesta_bot.split("$")[0]
    respuesta_message= respuesta_bot.split("$")[1]
    if (respuesta_clase=="ayuda"): usuario_pide_ayuda()
    respuesta= JsonResponse({"clase":respuesta_clase,"message":respuesta_message})
    return (respuesta)


def usuario_pide_ayuda():
    print("El usuario ha pedido ayuda , por tanto hay que registrarlo debtro de la base")

#COMO LO VAMOS A HACER
# El usuario nos llama con un mensaje JSON que solo contiene {message:"mensaje para el bot"}

@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def bot_sentence2(request):
    json_message= request.body.decode('utf-8')

    if json_message:
        try: 
            parseo_data= json.loads(json_message)
            if "message" in parseo_data:
                 mensaje_para_api= parseo_data["message"]
            else:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=400)
                 
        except ValueError:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=400)
    else: 
        response_data = {'message': 'Error', 'data': 'No se mando un Json'}
        return JsonResponse(response_data, status=400)
    
    respuesta_bot= preguntar_bot_message(mensaje_para_api)
    respuesta_clase=respuesta_bot.split("$")[0]
    respuesta_message= respuesta_bot.split("$")[1]
    if (respuesta_clase=="ayuda"): usuario_pide_ayuda()
    respuesta= JsonResponse({"clase":respuesta_clase,"message":respuesta_message})
    return (respuesta)




