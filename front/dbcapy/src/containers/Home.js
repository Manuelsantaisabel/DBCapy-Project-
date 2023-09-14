import React,{useState} from "react";
import {Link, Navigate} from 'react-router-dom';
import { connect } from "react-redux";
import {login} from '../actions/auth';


import '../decoration/css/Loging.css'; 
import tituloImg from '../decoration/images/titulo.png'; 
import capyImg from '../decoration/images/capidbcolor.png'

const Home = ({login, isAuthenticated}) => {
    
    const [formData,setFromData]= useState({   
        email: '',
        password: ''
    });
    const {email, password}= formData;

    const onChange= e => setFromData({...formData, [e.target.name]: e.target.value});

      
    const onSubmit = e =>{
        e.preventDefault();
        login (email,password);
    }

    if (isAuthenticated){
        return <Navigate to = "/teoria"/>
    }

        return (
        <html>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100;800&display=swap" rel="stylesheet"/>
            <title>Login DBCapy</title>
            <div className="wrapped_login">
                <div>
                    <img className="titulo_im_login" src={tituloImg} />
                    <h2 className="titulo_bajo_login">Tu página de aprendizaje de bases de datos</h2>
                    <h2 className="info_login" > Ayuda de IA's para aprender como tu necesites </h2>
                    <h2 className="info_login" > Teoría de bases de datos</h2>
                    <h2 className="info_login" > Ejercicios prácticos</h2>
                </div >

                <body className="body_login">
                    <form className="form_login" onSubmit={e=>onSubmit(e)}>
                        <img className="imagen_login" src={capyImg} />
                        <h2 id="login_login">¡Bienvenido!</h2>
                        <label className="label_login" for="mail">Mail:</label>
                        <input  className="input_login"
                            type="email" 
                            id="email"
                            name="email" 
                            value={email}
                            onChange={e=>onChange(e)}
                            required
                        />
                        <label className="label_login" for="password">Contraseña:</label>
                        <input className="input_login"
                            type="password"
                            id="password" 
                            name="password" 
                            required
                            value={password}
                            onChange={e=>onChange(e)}
                            minLength='6'

                        />

                        <button className="button_login"
                            type="submit" 
                            value="Login"  
                        >
                        Entrar
                        </button>
                        <div className="register_login">
                                <Link to='/registro'>Registrarse</Link>
                        </div>
                        <div className="forgot-password_login">
                                  <Link to="/olvidarPassword">¿Olvidaste la contraseña?</Link>
                        </div>
                        </form>
                    
                        <h3 className="pie_pagin_login" >Proyecto TFG Usal Manuel Santa Isabel Mayo 2023</h3>


                        
                    
                </body>

            </div>
        </html> 
            
        );
};

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Home);