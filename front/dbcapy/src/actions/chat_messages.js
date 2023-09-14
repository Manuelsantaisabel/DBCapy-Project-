import axios from 'axios';


//Lo primero es mandar un JSON a nuestra API con el id del usario , nuestro mensaje y el tipo de mensaje que se trata para 
//poder guardar lo 
export const guardarMensajes = (id,text,class_name) => async dispatch => {
    try{
        console.log("voy a llamar al back para hacer una llamada a la api");
        if (localStorage.getItem('access')){
            const config={
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }
        const body = JSON.stringify({id,text,class_name});
        
            try{
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/message/message_save/`,body,config);
                    //Ya tenemos el mensaje de un usario guardado
                    console.log("mensaje guardado");

                return res.data;
            }catch(err){
                throw new Error("error en la llamada");
            }

         };
    }catch(err){
        throw new Error("error al haceer la función");
    }

};



//La segunda función vamos querer recuperar un JSON con todos los mensajes que un usario le hizo a la API de ChatGPT
//para poder mostrarlos dentro de nuestro chat. 

//Solo necesitamos dar nuestra ID a la API para poder sacar todos los mensajes de un usario
//TEMA SEGURIDA :
    // Citando ChatGPT para ver funcionan las consultas de Django con OMS para  evitar Inyección de código:
    /*La consulta que estás realizando utilizando RegistroMensajesChatGPT.objects.filter en Django no es susceptible a la inyección SQL. Django utiliza su ORM (Object-Relational Mapping) para generar consultas seguras y parametrizadas, lo que significa que los valores proporcionados en los filtros se escapan y formatean adecuadamente para prevenir la inyección de SQL.

En tu código, estás utilizando la variable id_usuario_retornar en el filtro. Como estás pasando esta variable directamente a la función filter de Django, el ORM se encargará de asegurarse de que los valores sean tratados de manera segura para evitar la inyección de SQL.

En resumen, debido a la forma en que estás utilizando el ORM de Django para construir y ejecutar consultas, no deberías preocuparte por la inyección de SQL en este caso específico */


export const cargarMensajes = (id) => async dispatch => {
    try{
        
        if (localStorage.getItem('access')){
            const config={
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }
        const body = JSON.stringify({id});
        
            try{
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/message/message_recovery/`,body,config);
                    //Ya tenemos el mensaje de un usario cargados. Se encuentran en un JSON compuesto por {id_mensaje,mensaje, clase}
                return res.data;
            }catch(err){
                throw new Error("error en la llamada");
            }

         };
    }catch(err){
        throw new Error("error al haceer la función");
    }

};
