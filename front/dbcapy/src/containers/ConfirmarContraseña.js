import React,{useState} from "react";
import {Link, Navigate,useParams} from 'react-router-dom';
import { connect } from "react-redux";
import {reset_password_confirm} from '../actions/auth';

import '../decoration/css/Olvidar_password.css'; 
import tituloImg from '../decoration/images/titulo.png'; 

const ConfirmarContraseña = ({match ,reset_password,isAuthenticated}) => {
    const [requestSent,setRequestSent]= useState(false);
    const [formData,setFromData]= useState({   
        new_password: '',
        re_new_password: ''
        
    });
    const {new_password,re_new_password}= formData;

    const onChange= e => setFromData({...formData, [e.target.name]: e.target.value});

    const routeParams = useParams(); 

    const onSubmit = e =>{
        e.preventDefault();
        const uid =routeParams.uid;
        const token = routeParams.token;
        reset_password_confirm (uid, token, new_password, re_new_password);
        setRequestSent(true);
    }

  
    
    if (requestSent){
        return <Navigate to = "/teoria"/>
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
                   
                        <img className="titulo_im_olvidar"  src={tituloImg}  onSubmit={e=>onSubmit(e)}/>
                   
                </div>
        
                    <form action="" method="POST" className="form_olvidar">
                        <br/>
                    
                            <h2  className="titulo_correo_olvidar" id="login_olvidar">Introduce la nueva contraseña </h2>
                        
                    
                        <label className="mail_olvidar" for="mail">Nueva contraseña:</label>
                        <br/>
                        <input className="input_olvidar" 
                          type="password"
                          id="password" 
                          name="new_password" 
                          required
                          value={new_password}
                          onChange={e=>onChange(e)}
                          minLength='6'/>
                        
                        <label className="mail_olvidar" for="mail">Confirmar nueva contraseña:</label>
                        <br/>
                        <input className="input_olvidar" 
                          type="password"
                          id="password" 
                          name="re_new_password" 
                          required
                          value={re_new_password}
                          onChange={e=>onChange(e)}
                          minLength='6'/>
                    
                
                        <input className="input_olvidar"  type="submit" value="Restablecer password"/>
                    </form>
                    <h3 className="pie_pagin_olvidar" >Proyecto TFG Usal Manuel Santa Isabel Mayo 2023</h3>
        
            </body>
        </html> 
        
    );
};

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect (mapStateToProps, {reset_password_confirm})(ConfirmarContraseña);