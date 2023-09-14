import os
import random
import json
import pickle
import numpy as np

import nltk
from nltk.stem import WordNetLemmatizer

from tensorflow import keras
from keras.models import  load_model


lematizer= WordNetLemmatizer()
with open(os.path.dirname(os.path.realpath(__file__)) + '\Intents_en.json', "r",encoding="utf-8") as json_lectura:
     intents = json.load(json_lectura)
     json_lectura.close()


#Cargamos los ficheros de las clases y las palabras anteriormente guardadas


#Cargamos los paquetes de wordds y clases además del modelo creado 

#words = pickle.load(open("./mysite/bot_architecture/words.pkl","rb"))
words = pickle.load(open(os.path.dirname(os.path.realpath(__file__)) + '\words.pkl', "rb") )

#classes = pickle.load(open("./mysite/bot_architecture/classes.pkl","rb"))
classes = pickle.load(open(os.path.dirname(os.path.realpath(__file__)) + '\classes.pkl', "rb"))
     
#model = load_model("./mysite/bot_architecture/chatbot_model.h5")
model =load_model('C:\\Users\\msant\\OneDrive\\Escritorio\\\DBCapyDevProject\\DBCapy\\back\\DJANGO_BACKEND\\mysite\\bot_architecture/chatbot_model.h5')

#Ponemos la frase que nos manda el usuario en formato lemantizado, como lo hemos procesado en 
# la red neuronal
def frase_limpia(sentence):
    sentence_word= nltk.word_tokenize(sentence)
    sentence_word= [lematizer.lemmatize(word) for word in sentence_word]
    return(sentence_word)


#Hacemos un bag de 1 para cada palabra que coincida de la frase introducida por el usuario 
# y por la lista de palabras del .pkl
def bag_of_word(sentence): 
    sentece_word= frase_limpia(sentence)
    bag=[0]* len(words)
    for w in sentece_word:
          for i, word in enumerate(words):
               if word== w:
                    bag[i]=1
    return np.array(bag) 

#Principal funcion y la más importante--> con ella predecimos con el modelo de deep learning de que clase se trata la frase que nos han mandado
def predict_class(sentence):
     bow = bag_of_word(sentence)   #Llamamos a la función para crear nuestra bolsa de 1 para alimentar a la red neuronal
     res= model.predict(np.array([bow]))[0]  #Mandamos a nuestro modelo con la función de predicción con nuestra bolsa palabras
     ERROR_THRESHOLD = 0.25                  #Nuestro umbral de aceptación de predicción 
     results = [[i,r]for i,r in enumerate(res) if r>ERROR_THRESHOLD]  #Se coge uno de los posibles resultados.

     results.sort(key= lambda x:[1],reverse=True)
     return_list = []
     for r in results:
          return_list.append({'intent':classes[r[0]], 'probability':str(r[1])})
     return return_list

def get_response( intents_list, intents_json):
     tag = intents_list[0]["intent"]
     list_of_intents= intents_json["intents"]
     for i in list_of_intents: 
          if i ["tag"] == tag:
               tag_administracion(tag)
               result_message = random.choice(i["responses"])
               result= tag +"$"+ result_message
               break
     return result

def tag_administracion (tag_name):
     print ("la red descubrio que la frase tiene que ver con el tema--> "+ tag_name)

print ("Adelante <==> Bot activo")


def preguntar_bot():
     message= input("Escribe lo que sea-->")
     ints= predict_class(message)
     res= get_response(ints,intents)
     return (res)

def preguntar_bot_message(my_message):
     ints= predict_class(my_message)
     res= get_response(ints,intents)
     return (res)
