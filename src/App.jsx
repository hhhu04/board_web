import { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pagrs/layout/Layout.jsx";
import Home from "./pagrs/Home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pagrs/auth/Login.jsx";

function App() {

  return (
    <>
     <BrowserRouter>
         <Routes>
             <Route element={<Layout/>}>
                <Route index element={<Home/>}/>
                 <Route path="/login" element={<Login/>}/>
             </Route>
         </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
