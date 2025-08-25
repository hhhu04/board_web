import {useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pagrs/layout/Layout.jsx";
import Home from "./pagrs/Home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pagrs/auth/Login.jsx";
import Mypage from "./pagrs/mypage/Mypage.jsx";
import {getAccessToken} from "./helpers/AuthHelper.jsx";
import {UserStore} from "./store/UserStore.jsx";
import Join from "./pagrs/auth/Join.jsx";

function App() {

    const { isLogin , setIsLogin} = UserStore((state) => state);

    useEffect(() => {
        const accessToken = getAccessToken();
        setIsLogin(!!accessToken);
    }, [setIsLogin]);


  return (
    <>
     <BrowserRouter>
         <Routes>
             <Route element={<Layout/>}>
                <Route index element={<Home/>}/>
                 <Route path="/login" element={<Login/>}/>
                 <Route path="/join" element={<Join/>}/>
                 <Route path="/mypage" element={<Mypage/>}/>
             </Route>
         </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
