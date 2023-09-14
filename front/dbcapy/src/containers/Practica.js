import React,{useState,useEffect } from "react";
import { connect } from "react-redux";
import {Link, Navigate,useParams} from 'react-router-dom';
import Modal from 'react-modal';

import { logout } from '../actions/auth';



import logo_usario from "../decoration/images/Ilustración_Capy_mandarina.png";
import capi from "../decoration/images/capidbcolor.png";
import ejercicio from "../decoration/images/BasesDatosEjercicio.PNG";

import '../decoration/css/Practica.css'; 

 

const Practica = ({logout,user,isAuthenticated}) => {

    //VARIABLES QUE USAMOS PARA LA PRACTICA:

    //Nombre de usario
    const username = user ? user.username : 'no-name';

    const [formData,setFromData]= useState({   
        solucion1: '',
        solucion2: '',    
        respuesta1:'...', 
        respuesta2:'...'
    });
    const {solucion1,solucion2,respuesta1,respuesta2}= formData;

    //Handelers para los dos inputs.
    const handleInputChange1 = (e) => {
        setFromData({ ...formData, [e.target.name]: e.target.value });
      };
      const handleInputChange2 = (e) => {
        setFromData({ ...formData, [e.target.name]: e.target.value });
      };
    const routeParams = useParams(); 

    const [errorMessage, setErrorMessage] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);
    //Promts
    const enunciado_prompt = `
    Devuelve un JSON con dos campos : 'correccion'(booleano que identifica si el EJERCICIO delimitado por '''  está bien o mal resuelto) y 'explanation'(razonamiento al ejercicio de forma detallada). Dentro de 'explanation' NO puedes usar dobles comillas , solo usar comillas dobles para el formato JSON.
 
    EJERICIO:
  '''  ENUNCIADO: "Supongamos que tenemos una base de datos de una tienda de PCComponentes que consta de tres tablas:  \'Clientes\', \'Productos\' y \'Compras\'. La tabla \'Clientes\' contiene información sobre los clientes[cliente_id nombre direccion], la tabla \'Productos\' contiene información sobre los productos disponibles [producto_id nombre precio]en la tienda y la tabla \'Compras\' registra las compras realizadas por los clientes[compra_id cliente_id producto_id fecha].
    `;

    const ejercicio1_promt=`Escribe la consulta de SQL que sirva para poder sacar el nombre de cada cliente, el nombre del producto que ha comprado y la fecha de compra. (ten en cuenta que puedes declarar más de un JOIN en una sola declaración, y que hay varias formas de resolver este ejercicio)."`;
    const ejercicio2_promt=`Escribe la consulta de SQL que sirva para muestrar todos los productos disponibles en la tienda, junto con los nombres de los clientes que los han comprado (si los ha habido) y la fecha de compra."`;



    //Función para salir de la cuenta 
    const logout_user =  async (e) => {
        logout();
        return <Navigate to = "/"/>
    };

  //Lo uso para hacer los POP-UPS de errores con la llamada de CHATGPT
    const closeModal = () => {
        setErrorMessage('');
    };
    //Llamada a chatGPT para saber si la solución es verdadera o falsa
    const comprobar_solucion = async (solucion,ejercicio,setRespuesta) =>{

        const {Configuration, OpenAIApi }= require ('openai');
                const config = new Configuration({
                    apiKey: 'user-key'
                })
                const openai = new OpenAIApi (config); 
                let promt,model_GPT,response;
                promt =enunciado_prompt+ejercicio+ " SOLUCION:"+solucion + "'''";
                console.log(promt);
                model_GPT = 'text-davinci-003';


           

                //Llamada a ChatGPT
                response= await openai.createCompletion({
                    model: model_GPT,
                    prompt: promt,
                    max_tokens: 1000,
                    temperature: 1,
                 })

                 //DEPURACIÓN
                 console.log("La petición que se hace es:");
                 console.log(promt);
                 console.log("La respuesta que obtenemos es :")
                 console.log(response.data); 
                 const responseTextFixed = response.data.choices[0].text.replace(/True/g, 'true').replace(/False/g, 'false').replace(/'/g, '"').trim();
                 console.log(responseTextFixed);
                 try{
                 const parseData=JSON.parse(responseTextFixed);
                console.log(parseData);
                setRespuesta(parseData.explanation);
                console.log(parseData.explanation);
                }
                 catch(err){
                    setErrorMessage("Se produjo un error en la llamada a ChatGPT");   
                    console.log("Error en procesar el JSON del usuario");
                 }
                
                 
    };

    
    if (isAuthenticated===false){
        return <Navigate to = "/"/>
        
    }
 
    

    return( 
        <html className="html_practica">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100;800&display=swap" rel="stylesheet"/>

            <head>
                <meta charset="UTF-8"/>
                <title>Practica_DBCapy</title>
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


            <body className="body_practica">
                <header className="header_practica">
                <nav className="nav_practica">
                    <ul className="ul_practica">
                    <li className="li_practica"><a className="menu_practica" id="menu_practica_teoria" href="/teoria">Teoría</a></li>
                    <li className="li_practica"><a className="menu_practica" id="menu_ejercicios_practica" href="#" >Prácticas</a></li>
                    <li className="li_practica"><a className="menu_practica" id="menu_usuario_practica" onClick={  logout_user} >{username} <br/>Salir de sesión</a></li>
                    <img src={logo_usario} id="imagen_usuario_practica" />

                    </ul>
                </nav>
                </header>
                <main className="main_practica">
                    <div className="temas_practica">
                    <h1 id="temas_titulo_practica"> EJERCICIOS </h1>
                        
                          <a className="a_practica">...</a>
                          <br/><br/>
                        <a className="a_practica">  Tema 4: JOIN</a> <br/>
                        <a className="a_practica" href="#ejercicio1" >&emsp;&emsp;*Ejercicio 1</a><br/>
                        <a className="a_practica" href="#ejercicio2" >&emsp;&emsp;*Ejercicio 2</a><br/>
                        <a className="a_practica">...</a>
                        
                    </div>

                    <div  className="enunciado_practico">
                    
                    <h1 id="practica_titulo_practica" style={{ textDecoration: 'underline' }}>Ejercicio 4:<br/> Ejemplo practico de los JOINs</h1> 
                        <p id="texto_1_practica"><h3>Teniendo el sigueinte enunciado: </h3>
                        Supongamos que tenemos una base de datos de una tienda de PCComponentes que consta de tres tablas: "Clientes", 
                        "Productos" y "Compras". La tabla "Clientes" 
                        contiene información sobre los clientes<strong>[cliente_id	nombre	direccion]</strong>,
                         la tabla "Productos" contiene información sobre los productos disponibles <strong>[producto_id	nombre	precio]</strong>
                        en la tienda y la tabla "Compras" registra las compras realizadas por los clientes<strong>[compra_id  cliente_id  producto_id  fecha]</strong>. <br/>
                        Las tablas tienen el siguiente contenido:<br/><br/>
                        
                        CLIENTES:
                        <table className="tabla_practicas">

                            <thead>
                                <tr>
                                    <th>cliente_id</th>
                                    <th>nombre</th>
                                    <th>direccion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Juan</td>
                                    <td>Calle A, 1</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>María</td>
                                    <td>Calle B, 2</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Pedro</td>
                                    <td>Calle C, 3</td>
                                </tr>
                            </tbody>
                        </table><br/>
                        PRODUCTOS:
                        <table className="tabla_practicas">
                            <thead>
                                <tr>
                                    <th>producto_id</th>
                                    <th>nombre</th>
                                    <th>precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Laptop</td>
                                    <td>1000</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>TV</td>
                                    <td>500</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Smartphone</td>
                                    <td>800</td>
                                </tr>
                            </tbody>
                        </table><br/>
                       COMPRAS:
                        <table className="tabla_practicas">
                            <thead>
                                <tr>
                                    <th>compra_id</th>
                                    <th>cliente_id</th>
                                    <th>producto_id</th>
                                    <th>fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>2023-06-01</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>2</td>
                                    <td>2</td>
                                    <td>2023-06-05</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>1</td>
                                    <td>3</td>
                                    <td>2023-06-10</td>
                                </tr>
                            </tbody>
                        </table>
                    <br/> Lo puedes ver de forma más visual en el diagrama de la derecha~~
                <br/> <br/> <br/> <br/> 
                    <p id='ejercicio1'>
                        <h3 style={{ textDecoration: 'underline' }}>Ejercicio 1</h3>
                        Escribe la consulta de SQL que sirva para poder sacar el nombre de cada cliente, el nombre del producto que ha comprado
                        y la fecha de compra. (ten en cuenta que puedes declarar más de un JOIN en una sola declaración, y que hay varias formas de
                        resolver este ejercicio).
                        <br/> <br/>
                        <div className="ejercicio1" >
                        <strong>INSERT SQL:  </strong>  
                            <input 
                                        className="ejercicio_input"
                                        autoComplete="off"
                                        type="text"
                                        name="solucion1"
                                        value={solucion1}
                                      
                                        onChange={handleInputChange1}
                                        onKeyDown={e => {
                                            if (e.key === "Enter"&& solucion1.trim() !== "") {
                                                comprobar_solucion(solucion1, ejercicio1_promt, (respuesta) =>
                                                setFromData({ ...formData, respuesta1: respuesta}));    
                                                }}
                                            }>
                                        
                                    </input>
                        <div className="explicacionCapy">
                            <img src={capi} className="capy"/>
                            <p className="speech">{respuesta1} 
                            </p>
                        </div>
                        
                        </div>
                    </p>
                    <br/> <br/>
                    <p id='ejercicio2'>
                        <h3 style={{ textDecoration: 'underline' }}>Ejercicio 2</h3>
                        Escribe la consulta de SQL que sirva para muestrar todos los productos disponibles en la tienda,
                        junto con los nombres de los clientes que los han comprado (si los ha habido) y la fecha de compra.
                        <br/>
                        Ojo, en este ejercicio se incita para resolverlo con una variación de JOIN,
                        aunque se puede resolver con otro tipo de planteamiento.<br/><br/>
                         Recuerda que hay muchas formas de resolver los ejercicios de SQL.
                        <br/> <br/>
                        <div className="ejercicio2" >
                            <strong>INSERT SQL:  </strong> 
                            <input 
                                    className="ejercicio_input"
                                    autoComplete="off"
                                    type="text"
                                    name="solucion2"
                                    value={solucion2}
                                    onChange={handleInputChange2}
                                    onKeyDown={e => {
                                        if (e.key === "Enter"&& solucion2.trim() !== "") {
                                            comprobar_solucion(solucion2, ejercicio2_promt, (respuesta) =>
                                            setFromData({ ...formData, respuesta2: respuesta }));    
                                            }}
                                        }
                                    >
                            </input>
                        <div className="explicacionCapy">
                            <img src={capi} className="capy"/>
                            <p className="speech">{respuesta2}
                            </p>
                        </div>

                        </div>
                    </p>

                    </p>
                    </div>

                    <div  className="visor_bbdd">
                    <img src={ejercicio} className="ejercicio_imagen"
                            onCurs
                        />
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


export default connect (mapStateToProps,{logout}) (Practica);