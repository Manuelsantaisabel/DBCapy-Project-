import axios from 'axios';


export const llamadaAPIBot = (message) => async dispatch => {
    try{
        if (localStorage.getItem('access')){
            const config={
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }
        const body = JSON.stringify({message});
        
            try{
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/bot/bot_answer2/`,body,config);
                //Ya teniendo el res vamos a procesoar este mensaje. Queremos mandar la respuesta y avisar a nuestro Container
                //si se trata de una llamada de ayuda. En tal caso aparecerá un pequeño cuadro para que el usario elija si 
                //quiere ayuda de teoría o ayuda de la web.

                return res.data;
            }catch(err){
                throw new Error("error en la llamada");
            }

         };
    }catch(err){
        throw new Error("error al haceer la función");
    }

};


//Llamada a la  API para comprobar si un usario puede hacer una llamada al bot valida.
export const comprobarGPT = (message,id,estatus) => async dispatch => {
    console.log("voy a hacer una llamada a la petición de GPT");
    try{
        if (localStorage.getItem('access')){
            const config={
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }
      
       
        const body = JSON.stringify({message,id,estatus});
       
            try{
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/gestion_gpt/peticion_gpt/`,body,config);
                return res.data;
            }catch(err){
                throw new Error("error en la llamada");
            }

        };
    }catch(err){
        throw new Error("error al hacer la función");
    }

};  

