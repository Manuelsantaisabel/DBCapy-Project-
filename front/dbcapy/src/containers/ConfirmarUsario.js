import React,{useState} from "react";
import {Link, Navigate,useParams} from 'react-router-dom';
import { connect } from "react-redux";
import {verify} from '../actions/auth';


import '../decoration/css/Loging.css'; 
import tituloImg from '../decoration/images/titulo.png'; 
import capyImg from '../decoration/images/capidbcolor.png'

const ConfirmarUsario = ({verify}) => {
    
    const [verified,setVerified]= useState(false);

    const routeParams = useParams(); 

    const verify_accounts = e =>{
        const uid =routeParams.uid;
        const token = routeParams.token;
        verify (uid,token);
        setVerified(true);
    }

    if (verified){
        return <Navigate to = "/teoria"/>
    }

        return (
        <html>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100;800&display=swap" rel="stylesheet"/>
            <title>Activar usuario</title>
            
            <div className="ActivarUsuario">
            <h1 >Verifica la cuenta</h1>
            <button className="boton_confirmar"
                onClick={verify_accounts}>
            Verificar
            </button>
            </div>
                
        </html> 
            
        );
};



export default connect(null, {verify})(ConfirmarUsario);