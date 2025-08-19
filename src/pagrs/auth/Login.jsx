import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useMutation} from "@tanstack/react-query";
import {setAccessToken, setRefreshToken} from "../../helpers/AuthHelper.jsx";
import {loginApi} from "../../api/user/UserApi.jsx";
import {useNavigate} from "react-router-dom";
import {UserStore} from "../../store/UserStore.jsx";

function Login(){

    const nav = useNavigate();
    const [formData, setFormData] = useState({userId:'',password:''})
    const { isLogin , setIsLogin} = UserStore((state) => state);

    useEffect(() => {
        if(isLogin){
            nav('/')
        }
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const login = ()  => {

        if(!formData.userId){
            alert('아이디를 입력해주세요')
            return
        }

        if(!formData.password){
            alert('비밀번호를 입력해주세요')
            return;
        }

        loginMutaion.mutate(formData)

    }

    const loginMutaion = useMutation({
        mutationFn: (account) => {
            return loginApi(account)
                .then( result => {
                    console.log(result)
                    if(result.status === 200)
                    {
                        console.log(result.data.token)
                        const accessToken = result.data.token;
                        const refreshToken = result.data.refreshToken;

                        setAccessToken(accessToken)
                        setRefreshToken(refreshToken)

                        setIsLogin(true);
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
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextId">
                    <Form.Label column sm="2">
                        ID
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" name="userId" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                        Password
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="password" name="password" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Row>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="button" variant="primary" onClick={login}>
                            로그인
                        </Button>
                        <Button type="button" variant="dark" onClick={login} className="ms-2">
                            회원가입
                        </Button>
                    </Col>
                    
                </Row>

            </Form>
        </>
    )
}

export default Login