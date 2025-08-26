import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import {UserStore} from "../../store/UserStore.jsx";
import {useMutation} from "@tanstack/react-query";
import {loginApi, logoutApi} from "../../api/user/UserApi.jsx";
import {getRefreshToken, removeAuthTokens, setAccessToken, setRefreshToken} from "../../helpers/AuthHelper.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function Header() {

    const nav = useNavigate();
    const { isLogin , setIsLogin} = UserStore((state) => state);

    const logout = useMutation({
        mutationFn: () => {
            const token = getRefreshToken()
            return logoutApi(token)
                .then( result => {
                    console.log(result)
                    if(result.status === 200)
                    {

                        removeAuthTokens()

                        setIsLogin(false);
                        nav('/')

                    }else{
                        alert(result.data.message)
                    }
                })
                .catch(
                    reason => {
                        console.log(reason)
                    }
                )
                .finally()
        }
    })

    return(
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">Board</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {/*<Nav.Link href="#features">Features</Nav.Link>*/}
                        </Nav>
                        <Nav>
                            {
                                isLogin ?
                                    <>
                                        <Nav.Link href="/mypage">마이페이지</Nav.Link>
                                        <Nav.Link onClick={logout.mutate} >로그아웃</Nav.Link>
                                    </>
                                    :
                                    <Nav.Link href="/login">로그인</Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header