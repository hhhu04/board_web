import {useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/auth/Login.jsx";
import Mypage from "./pages/mypage/Mypage.jsx";
import {getAccessToken} from "./helpers/AuthHelper.jsx";
import {UserStore} from "./store/UserStore.jsx";
import Join from "./pages/auth/Join.jsx";
import Detail from "./pages/game/Detail.jsx";

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
                 <Route path="/detail/:game/:key" element={<Detail/>} />
             </Route>
         </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
