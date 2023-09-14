import React from "react";
import tituloImg from '../decoration/images/titulo.png'; 
import '../decoration/css/Olvidar_password.css'; 


const RevisarMail = () => {
    
    return(
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
           <br/><br/><br/><br/>
            <h2  className="titulo_revisar_mail" id="login_olvidar">Revisa el mail para recuperar la contraseña</h2>
            <h3 className="pie_pagin_olvidar" >Proyecto TFG Usal Manuel Santa Isabel Mayo 2023</h3>
   
        </body>
        </html> 
    );
   
};



export default RevisarMail;