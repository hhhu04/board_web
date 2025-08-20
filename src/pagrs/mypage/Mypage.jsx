import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {UserStore} from "../../store/UserStore.jsx";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "../../api/user/UserApi.jsx";

export const Mypage = () => {

    const nav = useNavigate();
    const { isLogin } = UserStore((state) => state);

    useEffect(() => {
        if(!isLogin){
            nav('/')
        }
    },[isLogin, nav])

    const {data, isPending, isError, error} = useQuery({
        queryKey: ["USER_INFO"],
        queryFn: getUserInfo,
        enabled: isLogin
    })


    if(isPending) return <h1>로딩중</h1>
    if(isError) return <h1>에러 발생</h1>

    return(
            <>
                <h1>마이페이지</h1>
                <p>아이디 : {data?.userId}</p>
            </>
    )
}

export default Mypage