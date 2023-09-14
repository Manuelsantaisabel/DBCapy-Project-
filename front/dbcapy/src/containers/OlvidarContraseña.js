import React,{useState} from "react";
import {Link, Navigate} from 'react-router-dom';
import { connect } from "react-redux";
import {reset_password} from '../actions/auth';
import CSRFToken from '../actions/csrftoken';

import '../decoration/css/Olvidar_password.css'; 
import tituloImg from '../decoration/images/titulo.png'; 
import capyduda from '../decoration/images/capyduda.png';


const OlvidarContraseña = ({reset_password,isAuthenticated}) => {
    const [requestSent,setRequestSent]= useState(false);
    const [formData,setFromData]= useState({   
        email: '',
        
    });
    const {email}= formData;

    const onChange= e => setFromData({...formData, [e.target.name]: e.target.value});

      
    const onSubmit = e =>{
        e.preventDefault();
        reset_password (email);
        setRequestSent(true);
    }

    if (requestSent){
        return <Navigate to = "/revisarmail"/>
    }

    if (isAuthenticated){
        return <Navigate to = "/teoria"/>
    }


    return (
        <html >
             <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100;800&display=swap" rel="stylesheet"/>
            <body>
            
                <div className="cabecera_olvidar">
                    <a href="/" >
                        <img className="titulo_im_olvidar"  src={tituloImg}  />
                    </a>
                </div>
        
                    <form action="" method ="POST"className="form_olvidar" onSubmit={e=>onSubmit(e)}>
                        
                        <br/>
                    
                            <h2  className="titulo_correo_olvidar" id="login_olvidar">Introduce el correo de usuario</h2>
                        
                    
                        <label className="mail_olvidar" for="mail">Mail:</label>
                        <br/>
                        <input className="input_olvidar"
                            type="email"
                            id="mail"
                            name="email" 
                            value={email}
                            onChange={e=>onChange(e)}
                            required/><br/><br/>
                    
                
                        <input className="input_olvidar"  type="submit" value="Recuperar password"/>
                    </form>
                    <img src={capyduda} className="imagen_olvidar"/>
                    <h3 className="pie_pagin_olvidar" >Proyecto TFG Usal Manuel Santa Isabel Mayo 2023</h3>
        
            </body>
        </html> 
        
    );
};


const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect (mapStateToProps, {reset_password})(OlvidarContraseña);