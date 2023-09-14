import React,{useState} from "react";
import {Link, Navigate} from 'react-router-dom';
import { connect } from "react-redux";
import {signup} from '../actions/auth';


import '../decoration/css/Registro.css'; 
import tituloImg from '../decoration/images/titulo.png'; 
import capyImg from '../decoration/images/capidbcolor.png'

const Registro = ({signup, isAuthenticated}) => {
    const [accountCreated, setAccountedCreated]= useState(false);
    const [formData,setFromData]= useState({   
        email: '',
        password: '',
        username: '',
        estatus: '',
        re_password: '',
        description: ''

    });
    const {email, password,username,estatus,re_password,description}= formData;

    const onChange= e => setFromData({...formData, [e.target.name]: e.target.value});

      
    const onSubmit = e =>{
        e.preventDefault();
        if( password=== re_password){
            signup (email, password,username,estatus,re_password,description);
            setAccountedCreated(true);
        }
        else{
            console.log("Las contraseñas no son iguales")
        }
    }

    if (isAuthenticated){
        return <Navigate to = "/teoria"/>
    }
    if (accountCreated){
        return <Navigate to ="/"/>
    }

        return (
        <html className="html_registro">
             <title>Registro DBCapy</title>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100;800&display=swap" rel="stylesheet"/>
            <body>
        
        <div className="cabecera_registro">
            <a href="/" >
                <img class="titulo_im" src={tituloImg}/>
            </a>
        </div>
      
    
        <form action=""  className="form_registro" method="POST" onSubmit={e=>onSubmit(e)}>
                
                
                <label for="nombre">Nombre:</label>
                <input className="input_registro" 
                    type="text" 
                    id="nombre" 
                    name="username"
                    value={username}
                    onChange={e=>onChange(e)}
                    required/><br/><br/>
            
                <label for="mail">Mail:</label>
                <input className="input_registro"
                    type="email" 
                    id="mail" 
                    name="email" 
                    value={email}
                    onChange={e=>onChange(e)}
                    required/><br/><br/>
            
                <label for="contraseña">Contraseña:</label>
                <input className="input_registro"
                    type="password" 
                    id="contraseña" 
                    name="password" 
                    value={password}
                    onChange={e=>onChange(e)}
                    required/><br/><br/>


                <label for="repetir-contraseña">Repetir contraseña:</label>
                <input className="input_registro" 
                    type="password" 
                    id="repetir-contraseña"
                    name="re_password" 
                    value={re_password}
                    onChange={e=>onChange(e)}
                    required/><br/><br/>
            
                <label for="tipo-de-usuario">Tipo de usuario:</label>
                <select  
                className="select_registro"
                id="tipo-de-usuario" 
                name="estatus" 
                value={estatus}
                onChange={e=>onChange(e)}
                required>

                    <option value="">Seleccione una opción</option>
                    <option value="normal">Normal</option>
                    <option value="subscriptor">Subscriptor</option>
                    <option value="premium">Premium</option>
                </select><br/><br/>
            
                <label for="para-que-quieres-usar-dbcapy">¿Para qué quieres usar DBCapy?</label>
                <textarea className="textarea_registro" 
                    id="para-que-quieres-usar-dbcapy" 
                    rows="4"
                    name="description" 
                    value={description}
                    onChange={e=>onChange(e)}
                ></textarea><br/><br/><br/>
    
                <input className="input_registro" type="submit" value="Registrarse"/>
        </form>
    
        <h3 className="pie_pagin_registro" >Proyecto TFG Usal Manuel Santa Isabel Mayo 2023</h3>
    
    
    </body>
    
            
        </html> 
            
        );
};

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {signup})(Registro);