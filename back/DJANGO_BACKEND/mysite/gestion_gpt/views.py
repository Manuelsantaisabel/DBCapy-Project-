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

#Biblioteca que usaremos para hacer el conteo de tokens
import tiktoken

#Biblioteca que usamos para medir el resgistro de solicitudes de ChatGPT
from datetime import datetime 
from .models import RegistroPeticionChatGPT

#Vamos a recibir una petición para llamar a ChatGPT, debemos procesarla y ver si es un 
#usario puede hacer dicha llamada.

#Vamos a recibir un JSON con {id:"",estatus:"",message:""}
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def peticion_gpt(request):
    json_message= request.body.decode('utf-8')

    if json_message:
        try: 
            parseo_data= json.loads(json_message)
            if "message"and "id" and "estatus" in parseo_data:
                 mensaje_para_chatGPT= parseo_data["message"]
                 estatus_user= parseo_data["estatus"]
                 id_user= parseo_data["id"]
            else:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=200)
                 
        except ValueError:
                response_data = {'message': 'Error', 'data': 'Invalid JSON'}
                return JsonResponse(response_data, status=200)
    else: 
        response_data = {'message': 'Error', 'data': 'No se mando un Json'}
        return JsonResponse(response_data, status=200)
    
    #Tamaño peticion
    encoding= tiktoken.encoding_for_model("text-davinci-003")
    num_tokens = len(encoding.encode(mensaje_para_chatGPT))

    #Nº Peticiones usuario
    count_peticiones= RegistroPeticionChatGPT.objects.filter(id_user_gpt=id_user,fecha__date=datetime.now().date()).count()
    print (datetime.now().today())
    print (count_peticiones)
    #print (count_peticiones)
    #Comprobar la longitud de un mensaje y ver si se adecua al máximo de pregunta de su estatus
    #Tb debemos comprobar dentro de nuestro modelo de GestionPeticiones el nº de peticiones 
    #que se un usuario hace en un día

    #NORMAL 60 tokens   ||  30 preguntas/dia
    #SUBSCRIPTOR 150    ||  70 preguntas/dia
    #PREMIUM     400    ||  200 preguntas/dia    Ponemos un limite máximo aunque sea premium para evitar un exploid.

    if(estatus_user=="normal"):
         if(num_tokens>60):
            response_data = {'message': 'Error', 'data': 'El usario normal no puede hacer una pregunta superior a 60 tokens'}
            return JsonResponse(response_data, status=200)
         if(count_peticiones>30):
            response_data = {'message': 'Error', 'data': 'El usario normal no puede hacer más de 30 preguntas diarias'}
            return JsonResponse(response_data, status=200)
             
    elif(estatus_user=="subscriptor"):
        if(num_tokens>150):
            response_data = {'message': 'Error', 'data': 'El usario subscriptor no puede hacer una pregunta superior a 150 tokens'}
            return JsonResponse(response_data, status=200)
        if(count_peticiones>70):
            response_data = {'message': 'Error', 'data': 'El usario subscriptor no puede hacer más de 70 preguntas diarias'}
            return JsonResponse(response_data, status=200)
        
    elif(estatus_user=="premium"):
        if(num_tokens>400):
            response_data = {'message': 'Error', 'data': 'El usario premium no puede hacer una pregunta superior a 400 tokens'}
            return JsonResponse(response_data, status=200)
        if(count_peticiones>200):
            response_data = {'message': 'Error', 'data': 'El usario subscriptor no puede hacer más de 200 preguntas diarias'}
            return JsonResponse(response_data, status=200)
        
    else: 
        response_data = {'message': 'Error', 'data': 'Estatus invalido'}
        return JsonResponse(response_data, status=200)



#Se le mandara al usuario un message con un Error (especificando cual es en "data" y lo pondremos en un mensaje 
# de pop-up en la pagina de dbcapy)
#o un True expecificando que se puede realizar la llamada a ChatGPT y que se ha registrado la nueva
#llamada

    registro= RegistroPeticionChatGPT()
    registro.id_user_gpt= id_user
    registro.fecha= datetime.now()
    registro.save()
    respuesta= JsonResponse({"message":mensaje_para_chatGPT,"data":num_tokens})
    return (respuesta)

