import React  from "react";

import Home from "./containers/Home";
import Registro from "./containers/Registro";
import ConfirmarUsario from "./containers/ConfirmarUsario"
import ConfirmarContraseña from "./containers/ConfirmarContraseña";
import OlvidarContraseña from "./containers/OlvidarContraseña";
import Practica from "./containers/Practica";
import Teoria from "./containers/Teoria";
//import Usuarios from "./containers/Usuarios";
import RevisarMail from "./containers/RevisarMail";
import Layout from "./hocs/Layout";


import { Provider } from "react-redux";
import store  from "./store";


import {BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";



function App () {
    return (
        <Provider store={store}>
            <Layout>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/registro" element={<Registro/>} />
                <Route path="/olvidarPassword" element={<OlvidarContraseña/>}/>
                <Route path="/activate/:uid/:token" element={<ConfirmarUsario/>}/>
                <Route path="password/reset/confirm/:uid/:token" element={<ConfirmarContraseña/>}/>
                <Route path="/practica" element={<Practica/>}/>
                <Route path="/teoria" element={<Teoria/>}/>
                <Route path ="/revisarmail" element={<RevisarMail/>}/>
            </Routes>    
            </Layout>
        </Provider>
      
    )
}

export default App;