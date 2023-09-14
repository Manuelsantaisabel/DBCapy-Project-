//BIBLIOTECAS DE REACTS
import React,{useState, useEffect, useRef} from "react";
import { connect } from "react-redux";
import {Link, Navigate,redirect,useParams} from 'react-router-dom';
import Modal from 'react-modal';
import Switch from "react-switch";


//ACCIONES
import {llamadaAPIBot,comprobarGPT} from '../actions/chat_bot';
import { logout } from '../actions/auth';
import {guardarMensajes,cargarMensajes} from '../actions/chat_messages';


//IMAGENES
import logo_usario from "../decoration/images/Ilustración_Capy_mandarina.png";
import titulo_chat from "../decoration/images/titulo_chat.png";
import send_logo from "../decoration/images/send_logo.png";
import simpsons from "../decoration/images/ralph.gif";
import capyduda from '../decoration/images/capyduda.png';
import red_neuronal from '../decoration/images/RedNeuronalXor.png'
import coding from"../decoration/images/coding.gif";
import capy_orange from "../decoration/images/capybara_orange.gif";
import bbdd from "../decoration/images/bbdd.png";
import join from "../decoration/images/join.png";
import chatgpt from "../decoration/images/chatGpt.jpg";

//CSS
import '../decoration/css/Teoria.css'; 



const Teoria = ({logout,user,isAuthenticated,llamadaAPIBot,comprobarGPT,guardarMensajes,cargarMensajes}) => {
   
//VARIABLES QUE USAREMOS

    //Nombre de usario- variables que vamos a usar
    const username = user ? user.username : 'no-name';
    const id_user= user? user.id: 'null';
    const estatus_user=  user? user.estatus: 'null';
    

    //Variables de mensajes:

    //Constantes que se utilizan para chatear con el usario (son los mensajes para 
    // guardar las respuestas que un usario ponga en el chat, no la conversación que aparece
    // en pantalla).
    const [formData,setFromData]= useState({   
        message: '',    
        respuesta:'' 
    });
    //Para usar los mensajes
    const {message,respuesta}= formData;
    const onChange= e => setFromData({...formData, [e.target.name]: e.target.value});

    const [mensajes, setMensajes] = useState([]);   //Mensajes que aparecen dentro del chat
    const [mostrarAyuda, setMostrarAyuda] = useState(false);    //Mensaje de ayudo generico
    const [mostrarAyudaChatGPT,setMostrarAyudaChatGPT]= useState(false);    //Mensaje ayuda de como funciona GPT
    const [activadorGPT, setActivadorGPT] = useState(false);    //Booleano de usar chat usar chat para llamar a GPT



    const [selectedTopic, setSelectedTopic] = useState(0);   //Coleccion estados para cada tema de teoria
        const handleTopicClick = (topic) => {
            setSelectedTopic(topic);
        };
    
        
           

    const routeParams = useParams(); 

        //Para mostrar el error que un usario puede tener a la hora de llamar a ChatGPT
    const [errorMessage, setErrorMessage] = useState('');

        //Para elegir el modelo que vamos a utilizar de chatGPT
    const [isDavinci, setIsDavinci] = useState(true);

        //Para poner el chat en el punto más bajo cada vez que llegue un mensaje
    const chatRef = useRef(null);




//FUNCIONES

  
    //Función que procesa un mensaje recibido~~> RED NEURONAL
    const llamar_bot = async (e) =>{
        try{
            //Llamada a actions/chat_bot            
            const respuesta = await llamadaAPIBot(formData.message);
                
            //Actualizar los nuevos mensajes (añadirlos al chat)
                setMensajes(prevMensajes => [
                    ...prevMensajes,
                    { texto: message, clase: 'sent_teoria' },
                    { texto: respuesta['message'], clase: 'received_teoria' }
                ]);
            
            
            //Poner el textbank otra vez en blanco
             setFromData({ ...formData, message: '' });

            
            //Procesar los mensajes de ayuda
            if(respuesta['clase']=="ayuda"){
                setMostrarAyuda(true);
            }else{
                setMostrarAyuda(false);
            }
            
        }catch(err){
            throw new Error("Error en la llamada del Bot");
        }
    };





    //Llamada a ChatGPT~~~> GESTIÓN DE LA LLAMADA Y DE LOS LIMITES

            /*Aunque la idea original es contabilizar el nº de tokens en el propio
        front, la herramienta de js-tiktoken (la cual es la herramienta que 
            proporciona el encriptamiento de palabras en tokens de ChatGPT) no esta habilitada
            en la parte del cliente, es por eso que vamos a mandar directamente nuestro
            mensaje al servidor junto con nuestro id-estatus
            JSON {id:"",estatus:"",mensaje:""}
            En nuestro Backend vamos a comprobar el numero de llamadas que un usario hace+ actualizar el número de llamadas 
            si es válido.
            */
        
    const preguntarGPT = async (e) =>{
        try{
            
            //Ponemos los booleanos a falso para evitar dobles llamadas.
            setMostrarAyudaChatGPT(false)
            setActivadorGPT(false);

            console.log("vamos a llamar a gpt");

                //CONSULTAR LIMITES USARIOS

            //Primero llamamos a nuestra api para saber si el mensaje se puede aceptar para llamar a ChatGPT.
            //Voy a tratar el la respuesta como un objeto de Java 
            const respuesta_solicitar_chatGPT = await comprobarGPT(formData.message,id_user,estatus_user); 
           
            console.log(respuesta_solicitar_chatGPT);

         
            //En el caso de que haya algún error se muestra al usario 
            if (respuesta_solicitar_chatGPT.message==='Error'){
                        console.log("error en la solicitud de la llamada");
                        setErrorMessage(respuesta_solicitar_chatGPT.data)    
                        setFromData({ ...formData, message: '' });

                    }

            else{   
                
                //VAMOS A PREGUNTAR A CHATGPT

                //Parametros de configuración 
                const {Configuration, OpenAIApi }= require ('openai');
                const config = new Configuration({
                    apiKey: 'user-key'
                   
                })
                const openai = new OpenAIApi (config);
                let promt,model_GPT,response;
                //Debemos hacer la llamada a la api segun el modelo que el usuario haya elegido con el Switch
                //tb el modelo altera como expresamos el promt
                //Hacemos dos response diferentes por la configuración con el stop

                    //En davincii debemos sintetizar una orden "Promt" que sea válida para todos los mensajes que un usario pueda
                    //preguntar. Tb especificamos el formato con el que nosotros estamos trabajando.
                    if (isDavinci){
                        console.log("modo davinci");
                         promt ="Responde a la siguiente pregunta (limitada con ''') en un formato JSON con dos campos ,"+
                         "'tema_bbdd'(booleano que identifica si la frase tiene que ver con el tema de Bases de datos) y 'respuesta'"+
                         "(respuesta a la frase, si 'tema_bbdd' es False, respuesta será Null). Pregunta:'''"+formData.message+"'''" ;
                         console.log(promt);
                         model_GPT = 'text-davinci-003';
                             //Llamada a ChatGPT
                         response= await openai.createCompletion({
                            model: model_GPT,
                            prompt: promt,
                            max_tokens: 2000,
                            temperature: 1,
                        })
                    }
                    //En cambio , el Fine-Tunning al identificar patrones debemos poner tanto un patrón para identificar nuestro 
                    //promt y tb hasta donde queremos que nuestro modelo escriba. 
                    //Esta en modo Beta ya que puede causar errores debido a que es un modelo creado con un set de datos personal.
                    //Debemos comprobar que la respuesta que se genera con Finne-Tunning es tb un JSON válido.
                    else{
                        console.log("modo Fine-Tunning");
                         promt =formData.message+"\\n\\n###\\n\\n" ;
                         model_GPT = 'davinci:ft-usal-2023-06-25-20-25-43';
                         response= await openai.createCompletion({
                            model: model_GPT,
                            prompt: promt,
                            max_tokens: 2000,
                            temperature: 1,
                            stop: ['###'],
                        })
                    }

            
                //Mostrar respuesta , la api nos ha devuelto un ejercicio en formato JSON con los dos siguiente parametros:
                //{"tema_bbdd":"True/False","respuesta":"respuesta obtenida"}
                console.log(response.data); 
                console.log(response.data.choices[0]);
                console.log(response.data.choices[0].text);
                //Primero vamos a ver si el tema es de bbdd.
                const responseTextFixed = response.data.choices[0].text.replace(/True/g, 'true').replace(/False/g, 'false').replace(/'/g, '"').trim();
                console.log(responseTextFixed);
                const parseData=JSON.parse(responseTextFixed);
                console.log(parseData);
                if(parseData.tema_bbdd){
                    setMensajes(prevMensajes => [...prevMensajes,
                        {texto: message, clase: 'sent_teoria'} ,
                        {texto:parseData.respuesta,clase: 'tutorial_web' }]);
                    //Poner el textbank otra vez en blanco
                    setFromData({ ...formData, message: '' });

                            //GUARDAR MENSAJES
                        console.log("vamos a guardar los mensajes de los usarios");
                        //Lo último es guardar la pregunta y respuesta entre usario-chatGPT 
                        //hay que mandar el id+texto+clase
                        const guardado_mensaje_usario= await guardarMensajes(id_user,message,'sent_teoria');
                        const guardado_mensaje_gpt= await guardarMensajes(id_user,parseData.respuesta,'tutorial_web');
                        console.log("mensajes se han guardado");
                        console.log (guardado_mensaje_gpt);
                        console.log(guardado_mensaje_usario);
                        


                }else{
                //El mensaje del usario no tiene que ver con el tema de la página web. No se responde.
                    setMensajes(prevMensajes => [...prevMensajes,
                        {texto: message, clase: 'sent_teoria'} ,
                        {texto:'La pregunta que hiciste no tiene que ver con bases de datos',clase: 'tutorial_web' }]);
                
                    //Poner el textbank otra vez en blanco
                    setFromData({ ...formData, message: '' });
                
                }
            }

            
        }catch(err){

            console.log("error en la solicitud de la llamada a chatGPT");
            setErrorMessage("Se produjo un error en la llamada a ChatGPT");   
            setFromData({ ...formData, message: '' });
            throw new Error("Error en la llamada del CHATGPT");
        }    

    }

    
    //Dudas básicas de como usar la web- Tutorial sencillo 
    //Mostrar mensaje de ayuda si setMostrarAyuda esta en True
    const tutorialWeb = e =>{
        const tutorialMensaje = {
            texto: 'Vamos a intentar ayudarte con el funcionamiento de la web, para empezar el objetivo del proyecto es poder enseñar bases de datos de una manera particulary adaptada para cada usario. Para ello tienes tanto temario de teoría y ejercicios prácticosrelacionados, las dos secciones de arriba. Además, para ayudarte con todo tienes el chat para poder hablar con una IA ',
            clase: 'tutorial_web'};
        setMensajes(prevMensajes => [...prevMensajes,tutorialMensaje]);
        setMostrarAyuda(false);
    }
   

    //Lo uso para hacer los POP-UPS de errores con la llamada de CHATGPT
    const closeModal = () => {
        setErrorMessage('');
    };

     //Función para salir de la cuenta 
    const logout_user =  async (e) => {
        logout();
        return <Navigate to = "/"/>
    };

    //Función con la que el Switch cambia el modelo de chatGPT.
    const handleToggle = () => {
        setIsDavinci(!isDavinci);
      };

    //Función para poder ir abajo del chat
      //Ponemos el scroll en el punto más bajo 
    useEffect(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, [mensajes]);

    //Función de cargar los mensajes de los usarios 
    useEffect(()=>{
       const obtenerMensajes = async ()=>{
            try{
            console.log(id_user);
            if (id_user!=null){
                //Cargar mensajes y comprobar si
                const lista_de_mensaje= await cargarMensajes(id_user);
                if (Array.isArray(lista_de_mensaje)) {
                  const cargarMensajes = lista_de_mensaje.map((mensajes) => ({
                    texto: mensajes.text_message,
                    clase: mensajes.class_message,
                    }));    
                setMensajes((prevMensajes) => [...prevMensajes, ...cargarMensajes]);
                }
            }
                
            // Actualizar el estado de los mensajes con los nuevos mensajes
            }    
            catch(error){
                console.error("Error al obtener mensajes:", error);
                }
            };
        
        obtenerMensajes();
     
    },[id_user]);
      
    if (!isAuthenticated){
        return <Navigate to = "/"/>
    }
    


    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================
    return( 
        <html className="html_teoria">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100;800&display=swap" rel="stylesheet"/>

            <head>
                <meta charset="UTF-8"/>
                <title>Teoria_DBCapy</title>
            </head>

            {errorMessage && (
                <Modal className="pop_up_error"
                isOpen={true}
                onRequestClose={closeModal}
                contentLabel="Error Modal"
                >
                <h2>Error</h2>
                <p>{errorMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
                </Modal>
            )}

            <body className="body_teoria">
                <header className="header_teoria">
                <nav className="nav_teoria">
                    <ul className="ul_teoria">
                    <li className="li_teoria"><a className="menu_teoria" id="menu_teoria" >Teoría</a></li>
                    <li className="li_teoria"><a className="menu_teoria" id="menu_practicas" href="/practica"  >Prácticas</a></li>
                    <li className="li_teoria"><a className="menu_teoria" id="menu_usuario_teoria" onClick={  logout_user} >{username}<br/>Salir de sesión</a></li>
                    <img src={logo_usario} id="imagen_usuario_teoria" />

                    </ul>
                </nav>
                </header>
                <main className="main_teoria">
                    <div className="temas_teoria">
                    <h1 id="temas_titulo_teoria"> TEMAS </h1>
                        
                        <a className="a_teoria" onClick={() => handleTopicClick(0)}> Tema 0:Otra forma de aprender Bases de datos</a> <br/>
                                <a className="a_teoria" href="#tema0_1"onClick={() => handleTopicClick(0)} >&emsp;&emsp;*Introducción</a><br/>
                                <a className="a_teoria"href="#tema0_2"onClick={() => handleTopicClick(0)}>&emsp;&emsp;*Qué es DBCapy?</a><br/>
                                <a className="a_teoria" href="#tema0_3"onClick={() => handleTopicClick(0)}>&emsp;&emsp;*Cómo usar la Web</a><br/><br/>
                        <a className="a_teoria" onClick={() => handleTopicClick(1)}> Tema 1:¿Que es una base de datos?</a>  <br/><br/>
                        <a className="a_teoria"> ...</a> <br/><br/>
                        <a className="a_teoria" onClick={() => handleTopicClick(4)}> Tema 4: ¿Que es un JOIN? </a> <br/>
          
                        <a className="a_teoria">...</a><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <a clasName= "a_teoria" href="https://docs.google.com/forms/d/e/1FAIpQLSdu_UoYKeGIiZxEC0102zOirnqRoH74WtEHnEBiUGek--GRPA/viewform?usp=sf_link" >Encuesta de satisfacción</a>
                    </div>

                    <div  className="teoria_teoria">
                    {selectedTopic === 0 && (
                        <div>
                            <p id="tema0_1"/>
                             <h1 id="teoria_titulo_teoria" style={{ textDecoration: 'underline' }}>Tema 0:<br/>Otra forma de aprender Bases de datos~DBCapy</h1> 
                        <p id="texto_1_teoria">
                            
                            Cuando buscamos una web para aprender lenguajes informáticos, generalmente encontramos
                            una serie de temarios acompañádos de ejercicios prácticos para poder comprender y practicar el lenguaje en cuestion.<br/><br/> 
                            Sin embargo,esta forma de aprendizaje en línea plantea un problema:las <strong>posibles dudas o cuestiones que un alumno pueda tener</strong>.
                            Por ejemplo, al intentar comprender un tema explicado o al tener dudas sobre el enunciado de un ejercicio, entre otros casos.
                            
                            <br/> <br/> <br/><img className="simpsons" src={simpsons} alt="GIF" /><br/><br/>
                            Es aquí donde entra en juego la ayuda de un Chatbot para asistir a los usuarios.
                            Mi proyecto de fin de grado, <strong>"Chatbot aplicado a la resolución de consultas en asignaturas de Bases de Datos"</strong> 
                            se centra en usar un asistente virtual dentro de una plataforma de aprendizaje de la materia de bases de datos.<br/>
                            En última instancia, un chatbot o asistente virtual, es una inteligencia artificial que se comunica con usuarios para poder brindarles ayuda de diversas formas.
                            Con el paso del tiempo, los chatbots han ido adquiriendo mayor complejidad gracias a los avances en el campo de la inteligencia artificial aplicada a la comprensión del lenguaje natural.
                            Como muchos saben, los modelos de IA han evolucionado enormemente desde la aparición del modelo Transformer, siendo el caso de ChatGPT el más reconocido en la actualidad.
                            
                            <br/><br/>

                            <h2  id="tema0_2">¿Qué es DBCapy?-Tecnologias en la creación de la Web</h2>
                            En esta web, tenemos el bot llamado DBCapy, el cual interactúa con los usuarios para poder brindarles una asistencia de ayuda con la web
                            y para resolver dudas del temario y de los ejercicios. Pero, ¿cómo funciona este bot?<br/>
                            <img src={capyduda} className="capyDuda_teoria"/><br/>
                            En el caso de DBCapy utilizamos dos modelos de inteligencias artificiales aplicadas al entendimiento de Lenguaje Natural: 
                            <strong>Una red neuronal con modelo secuencial</strong> y la <strong>API de ChatGPT</strong>. Aunque no entraré en detalles exhaustivos sobre estas dos tecnologías, como 
                            sí se hace en la memoria del Trabajo Fin de Grado (TFG), proporcionaré una breve introducción de como se han aplicado estas herramientas.
                            <br/> <br/>
                            La red secuencial está creada con la herramienta TensorFlow y programada con Python. Se trata de una red con 3 capas para
                            poder leer lenguaje natural y clasificarlo segun una lista de temas. Dependiendo del tema escogido , se procede a dar una respuesta ya pre-escrita.<br/><br/>
                            <img src={red_neuronal} className="redNeuronal"/><br/>
                            Las dos primeras capas tienen 128 y 64 neuronas respectivamente y la última capa tiene un total de 11 neuronas que representan cada uno de los temas que el bot clasifica.<br/>
                            A la hora de crear esta red, tuve un problema al solo poder utilizar el inglés para poder comunicarse con
                            el bot. Esto se debe a las dificultades de implementar el entendimiento del natural del castellano, sobretodo a la hora de la función de 
                            lemantización de palabras. Una herramienta muy buena que sirve para esta función es
                             <a href="https://nlp.lsi.upc.edu/freeling/node/12"  target="_blank" >FreeLing</a>, la cual ofrece una biblioteca en C++ para la comprensión del lenguaje natural del español.
                            
                            <br/><br/><br/>

                           El segundo software utilizado es ChatGPT. Una de las IA's más conocidas gracias a su flexibilidad, fluidez y coherencia a la hora de responder a preguntas. 
                           Este gran proyecto software nació gracias al modelo creado en 2017 llamado Transformer ,
                            <a href="https://la.blogs.nvidia.com/2022/04/19/que-es-un-modelo-transformer/" target="_blank" > más información este modelo</a>.<br/>
                            <br/>
                            <img src={chatgpt}  /><br/><br/>
                            ChatGPT nos proporciona diferentes formas para poder solventar las posibles dudas de los estudiantes puedan tener, en nuestro caso de bases de datos. Usaremos dos de las herramientas que OpenaAI ofrece:   
                            un modelo Fine Tunning y el modelo Davincii. El primer modelo, ofrece la posibilidad de crear nuestras propias especificaciones y patrones que se adapten a nuestras necesidades.Para crear este modelo,
                            primero he creado un Set da datos de varias decenas de ejemplos de como quiero que sean las respuestas los ejercicios. El problema de usar esta tecnologia es la falta de información
                            y recursos para poder refinar este modelo. Por tanto solo se ofrece a modo de Beta y para poder demostrar otras formas de implementar ChatGPT.<br/>
                            El segundo modelo, se trata del famoso Davincii-003. Se han creado diferentes promts que nos den los formatos y soluciones para nuestras demandas especificas.Este concepto se denomina Ingeniería de Promts.<br/><br/>
                            
                            
                             
                            A la hora de implementar dicha API debemos tener precaución el coste de procesar cada token.Aunque parezca poco 0,01€ cada 1000 tokens, puede suponer
                            un riesgo de escalabilidad o de posibles ataques. Es por esta razón que <strong>cada llamada de ChatGPT debe ser procesada primero por nuestra red neuronal secuencial, y 
                            luego comprobar que el usuario, según su plan de subscripción puede o no hacer dicha llamada.</strong><br/>
                            Se ha creado un servicio API REST que se gestione las peticiones de los uarios para poder hacer las llamadas a ChatGPT.
                            <br/><br/>
                            <h2 id="tema0_3">Cómo usar la web</h2>
                            
                            La forma de estudiar es simple, ir leyendo diferentes temarios y ejemplos sobre las bases de datos y luego ponerlos en practica con los diferentes ejercicios 
                            de la pestaña <strong>Prácticas</strong>. En esta pestaña encontraras diferentes ejercicios relacionados con los temas 
                            que se ven en esta web. Para resolverlos, solo se debe introdcir la respuesta del ejercicio en la terminal que pone "introduce código sql".
                            Cualquier duda de un ejercicio puede ser solucionada en esta pestaña con una llamada a ChatGPT.<br/>
                            A la hora de escribir en el chat de la derecha, tenemos que tener en cuenta que <strong>los comandos solo pueden hacerse en inglés</strong>. Luego las preguntas a ChatGPT sí se pueden 
                            realizar en español.<br/>
                            <img src={coding} className="coding_gif" alt="GIF"/><br/><br/>
                            La secuencia para llamar a GPT y que debemos incluir dentro del Chatbot es la siguiente: <strong>Escribir "help", luego bulsar el botón "BBDD", y por último escribir en el chat tu pregunta relacionada con el tema de Bases de Datos</strong>. Este modelo <strong>solo</strong> responde a preguntas que solo tengan que ver con Bases de datos.
                             
                            El modelo esta entrenado para poder ayudarte y explicarte los ejercicios sin darte la solución directamente.<br/><br/>
                            Una guía fácil de comandos que puedes utilizar son : <br/><strong>
                            help | hello | whats your name? | what time it is? | good bye | who is your creator? | how to use the comands? | how to use the web? | what bots are used in this web?
                            </strong><br/>Aunque claro, cualquier otra variación de estos comandos, todo en inglés, puede ser procesado por la red neuronal y se entiende como
                            un comando válido. 
                            <br/><br/><br/>
                            Ya con toda esta información de como se ha planteado el proyecto y una pequeña guía de uso de la web , estas preparado para utilizar DBCapy. Mucha suerte con tu aprendizaje de bases de datos :D
                            <img src={capy_orange} alt="GIF" className="capy_orange"/>
                        </p>
                        </div>
                    )}
                    {selectedTopic === 1 && (
                        <div>
                    <h1 id="teoria_titulo_teoria" style={{ textDecoration: 'underline' }}>Tema 1:<br/> ¿Que es una base de datos?</h1> 
                        <p id="texto_1_teoria">
                        Este primer tema es mucho más teoria , para poder asentar una serie de conceptos claves. Por tanto en este tema no se aplican ningun ejercicio practico. <br/><br/>
                        
                        Una base de datos es una herramienta informática que permite almacenar, organizar y gestionar grandes cantidades de información de manera eficiente y estructurada. En términos simples, una base de datos es como una "biblioteca" digital que puede contener todo tipo de información, desde nombres y direcciones de contacto hasta transacciones financieras y registros de inventario.<br/><br/>
                            <img src={bbdd} className="bbdd_img"/><br/><br/>
                        Las bases de datos se utilizan en una amplia variedad de contextos, desde pequeñas empresas y organizaciones sin fines de lucro hasta grandes corporaciones y agencias gubernamentales. Las bases de datos también son utilizadas por particulares para organizar y administrar su propia información personal.<br/><br/>
                        
                        Una de las ventajas más importantes de las bases de datos es su capacidad para manejar grandes volúmenes de información de manera eficiente y efectiva. En lugar de tener que buscar a través de una gran cantidad de archivos en papel o electrónicos, una base de datos permite a los usuarios buscar y recuperar información de manera rápida y fácil.<br/><br/>
                        
                        Además, las bases de datos también permiten la creación de informes personalizados y análisis de datos que pueden ayudar a las organizaciones a tomar decisiones informadas y estratégicas. Por ejemplo, una empresa puede utilizar una base de datos para analizar las tendencias de ventas de un determinado producto y utilizar esa información para ajustar su estrategia de marketing y ventas.<br/><br/>
                        
                        En resumen, una base de datos es una herramienta crucial para cualquier persona u organización que necesite administrar grandes cantidades de información de manera efectiva y eficiente. Ya sea para gestionar información de clientes, empleados, transacciones financieras o cualquier otra cosa, una base de datos es una herramienta poderosa que puede ayudar a simplificar y mejorar el proceso de gestión de datos.</p>
                        </div>
                    )}
                        
                    {selectedTopic === 4 && (
                        <div>
                             <h1 id="teoria_titulo_teoria"   style={{ textDecoration: 'underline' }}>Tema 4:<br/>¿Que es un JOIN? </h1> 
                        <p id="texto_1_teoria">
                            El JOIN es una de las funciones más importantes que tenemos dentro de SQL.<strong> Sirve para poder combinar dos o más tablas basándose en un campo común entre ellas</strong>. 
                            <br/> <br/>
                            Podemos verlo como "una intersección según unos datos en especifico". Aunque claro, depende del tipo de JOIN que hagamos, vamos a obtener un conjunto u otro.
                            <br/><br/>
                            Una operación JOIN tine la siguiente sintaxis <br/>
                            <p style={{
                                backgroundColor: 'black',
                                backgroundImage: 'radial-gradient(rgba(0, 150, 0, 0.75), black 120%)',
                                textShadow: '0 0 5px #C8C8C8',
                                border: '3px solid #000',
                                color: 'white'
                                }}
                            >
                            SELECT *<br/>
                            FROM Empleados<br/>
                            JOIN Departamentos ON Empleados.departamento_id = Departamentos.departamento_id </p><br/>
                            Podemos observar como el JOIN va después del FROM y va acompañado del sufijo ON, que indica los campos que vamos a querer que coincidan.
                            En este caso tenemos dos tablas , <strong>Empleados</strong> 
                            <p style={{color:'green' }}>[empleado_id-nombre-departamento_id]</p> y <strong>Departamentos</strong>
                            <p style={{color:'green' }}>[departamento_id-nombre]</p> 
                            Ambas tablas tienen una columna en común , departamento_id. Al hacer un JOIN lo que hacemos
                            es juntar todas las columnas de ambas tablas que coincidan con el mismo departamento_id creando así una <strong>nueva tabla combinada</strong>
                            <p style={{color:'green' }}>[empleado_id-nombre-departamento_id-nombre]</p>
                            <br/>
                            <a href="/practica#ejercicio1">~Practica el ejemplo primero de JOIN</a><br/><br/>
                            
                            Existen varios tipos de JOIN's dependiendo de lo que queramos que nos devulevan con la orden de combinación.
                            "Las ordenes también pueden variar su nombre dependiendo del gestor de BBDD que usemos".<br/> 
                            Los tipos principales son los siguiente:<br/><br/>
                            <strong>*INER JOIN</strong> ~ Solo se seleccionan los registros que tienen coincidencias en ambas tablas<br/><br/>
                            <strong>*LEFT JOIN</strong> ~ Devuelve todos los registros de la tabla izquierda  y los registros coincidentes de la tabla derecha<br/><br/>
                            <strong>*RIGHT JOIN</strong> ~Devuelve todos los registros de la tabla derecha y los registros coincidentes de la tabla izquierda [el inverso de LEFT JOIN]<br/><br/>
                            <strong>*FULL JOIN</strong> ~(también llamado <strong>FULL OUTER JOIN</strong>)Devuelve todos los registros de ambas tablas sin importar si hay coincidencias o no.
                                     Si no hay coincidencias, se devolverán valores nulos en las columnas correspondientes.<br/><br/>
                            <strong>*CROSS JOIN</strong> ~devuelve el producto cartesiano de las filas de ambas tablas,
                                     es decir, combina cada fila de la tabla izquierda con cada fila de la tabla derecha. No requiere una condición de unión y devuelve todos los posibles pares de filas.<br/><br/>
                        
                            Todos estos tipos se entienden mejor con la sigueinte imagen: <br/> <br/>
                            <img src={join} className="join_img"/><br/><br/>
                            A la hora de plantearnos como resolver un problema con JOINS debemos plantear como de potente es esta orden de SQL. Siempre debemos pensar que es lo que
                            queremos que nos devuelva el comando y plantear que tipo de JOIN podríamos utilizar.
                            <br/>
                            En el siguiente problema que se plantea , puedes resolver el ejercicio con un tipo de JOIN, pero puedes intentar plantear otras formas de resolver el problema.<br/>
                            <a href="/practica#ejercicio2">~Ejercicio de entendimiento de los tipos de JOIN</a><br/><br/>
                        
                        </p>
                        </div>
                    )}    
                        </div>




                    <div  className="chat_teoria">
                        <h1 className="h1Chat"> <img id="imagen_chat_teoria" src={titulo_chat}/></h1>
                    
                        <div  className="mensajes_teoria" ref={chatRef}>     
                            {mensajes.map((mensaje, index) => (
                               <div className={mensaje.clase} key={index}>
                               {mensaje.texto}
                             </div>
                            ))}

                    {mostrarAyuda && (
                    <div className="ayuda_teoria">
                            <p> ¿Necesitas ayuda con la web o una pregunta de bases de datos? </p>
                            <button className="botonAyudaWeb" onClick={tutorialWeb}>Web</button>
                            <button className="botonAyudaTeoria" 
                                onClick={()=>{setActivadorGPT(true); 
                                            setMostrarAyuda(false);
                                            setMostrarAyudaChatGPT(true);}
                            }>BBDD</button>
                    </div>
                    )}
                          {mostrarAyudaChatGPT && (
                        <div className="ayuda_teoria_chatGPT">
                            <p>Escribe en el chat cualquier duda que tengas sobre bases de datos , por ejemplo que es 
                                una base de datos relacinal? cuales son los comandos en sql para poder crear una base de datos?...
                                No hace falta hacer las preguntas en ingles. 
                                Recuerda que todas las preguntas y la longitud de dichas 
                                <span style={{ fontWeight: 'bold' }}> preguntas son contabilizadas ylimitadas 
                                según el plan de subscripción que tengas</span> .
                                Si no quieres hacer ninguna pregunta, puedes <span style={{ fontWeight: 'bold' }}> cancelar.</span> 
                                El modelo DAVINCI es el que esta por defecto, aunque se incluye de forma Beta el modelo FINE-TUNNING.</p>
                            
                            <span className="option-left">Fine-Tunning(Beta)</span>
                            <Switch
                                onChange={handleToggle}
                                checked={isDavinci}
                             
                            />
                            <span className="option-right">Davinci-003</span>
                            <br/><br/>
                            <button className="botonAyudaWeb" 
                                onClick={()=>{setMostrarAyudaChatGPT(false);
                                              setActivadorGPT(false);}}>
                            Cancelar</button>
                       
                        </div>
                    )}


                        </div>


                        <div className="caja_texto"> 
                            <input 
                                autoComplete="off"
                                className="text_chat_box"
                                type="text"
                                name="message"
                                value={message}
                                onChange={e=>onChange(e)}
                                placeholder="Recuerda que los mensajes deben mandarse en ingles"
                                required
                                onKeyDown={e => {
                                    if (e.key === "Enter"&& message.trim() !== "") {
                                        e.preventDefault(); 
                                    if (activadorGPT) {
                                        preguntarGPT();
                                    } else {
                                        llamar_bot();
                                    }
                                    }
                                }} 
                                />
                                
                                <button className="send_button"
                                        onClick={activadorGPT?preguntarGPT:llamar_bot}
                                        disabled={!message}
                                        
                                >
                                <img src={send_logo}
                                    className="send_logo_img"
                                />
                            </button>
                        </div>
                    </div>
                </main>
            </body>
        </html>
        
        );
   
};

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated,
    user:state.auth.user
});


export default connect (mapStateToProps,{llamadaAPIBot,logout,comprobarGPT,guardarMensajes,cargarMensajes}) (Teoria);