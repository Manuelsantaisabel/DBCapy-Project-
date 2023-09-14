import random
import json
import pickle
import numpy as np
import tensorflow as tf

import nltk
from nltk.stem import WordNetLemmatizer

#Función que permite lemantizar las palabras y que nos permite simplificar el lenguaje natural--> hacemos analisis morfologico
lemmatizer = WordNetLemmatizer()

#Añadir el input de aprendizaje de entrada
intents = json.loads(open('Intents_en.json').read())

words = []
classes = []
documents = []
ignoreLetters = ['?', '!', '.', ',']
#OJO--> ignoramos los simbolos de puntuación ya que nuestra red neuronal al ser tan básica solo va a percibir patrones de palabras para encontrar
#soluciones.
#No pretendemos que las entienda. Las autenticas redes neuronales de lenguaje natural no solo interpretan y comprenden , sino que también 
#buscan el valor que tiene una palabra dentro de una frase.

#Vamos a recorrer el JSON y a separar los tags con sus patrones de entrada--> objetivo guardarlos en las listas de Words y Classes
for intent in intents['intents']:
    for pattern in intent['paterns']:
        wordList = nltk.word_tokenize(pattern)  #Función muy importante que nos separa las oraciones en tokens(percibe los espacios, saltos de linea,etc.)
        words.extend(wordList)
        documents.append((wordList, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])


words = [lemmatizer.lemmatize(word) for word in words if word not in ignoreLetters]
words = sorted(set(words))

classes = sorted(set(classes))

pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

#En este punto tenemos 3 listas--> * Words==> con las palabras lemantizadas que no esten dentro de las letras a ignorar
#                                  *Classes==> los 4 tags que tenemos en nuestro json
#                                  *Documents==> conjunto de todas las oraciones tokenizadas (sin lemantizar) con su tag correspondiente


training = []
outputEmpty = [0] * len(classes)

for document in documents:
    bag = []                    #Creamos una bolsa vacia que se llenará de 0 o 1 dependiendo si un patron de palabras coincide con la lista de Words
    wordPatterns = document[0]  #Nuestro Patron de palabras se sacará de las palabras de la lista Documents (es la primera posición ya que solo nos interesan las frases, no las palabras).
    wordPatterns = [lemmatizer.lemmatize(word.lower()) for word in wordPatterns]
    for word in words:
        bag.append(1) if word in wordPatterns else bag.append(0)
    
    outputRow = list(outputEmpty)
    outputRow[classes.index(document[1])] = 1
    training.append(bag + outputRow)

random.shuffle(training)
training = np.array(training)

trainX = training[:, :len(words)]  
trainY = training[:, len(words):]

model = tf.keras.Sequential()
model.add(tf.keras.layers.Dense(128, input_shape=(len(trainX[0]),), activation = 'relu'))
model.add(tf.keras.layers.Dropout(0.5))
model.add(tf.keras.layers.Dense(64, activation = 'relu'))
model.add(tf.keras.layers.Dropout(0.5))
model.add(tf.keras.layers.Dense(len(trainY[0]), activation='softmax'))

sgd = tf.keras.optimizers.SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

model.fit(trainX, trainY, epochs=200, batch_size=5, verbose=1)
model.save('chatbot_model.hd5')
print('Done')