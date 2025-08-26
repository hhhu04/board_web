import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {useCallback, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useMutation} from "@tanstack/react-query";
import {setAccessToken, setRefreshToken} from "../../helpers/AuthHelper.jsx";
import {joinUser, loginApi} from "../../api/user/UserApi.jsx";
import {useNavigate} from "react-router-dom";
import {UserStore} from "../../store/UserStore.jsx";
import Alert from "../../components/Alert.jsx";

function Join(){

    const nav = useNavigate();
    const [formData, setFormData] = useState({userId:'',password:''})
    const { isLogin , setIsLogin} = UserStore((state) => state);

    const [popMessage, setPopMessage] = useState('')
    const [showPop, setShowPop] = useState(false)
    const [type, setType] = useState('alert')
    const [callback, setCallback] = useState(null)

    useEffect(() => {
        if(isLogin){
            nav('/')
        }
    })

    const closePop = () => {
        setShowPop(false)
    }

    const goLogin = () => {
        nav('/login')
    }

    const showAlert = useCallback((message, onConfirm = closePop) => {
        setPopMessage(message);
        setType('alert');
        setShowPop(true);
        setCallback(() => onConfirm); // 함수를 반환하는 함수로 설정
    }, [closePop]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const join = ()  => {

        if(!formData.userId){
            showAlert('아이디를 입력해주세요')
            return
        }

        if(!formData.password){
            showAlert('비밀번호를 입력해주세요')
            setType('alert')
            setShowPop(true)
            setCallback(closePop)
            return;
        }

        joinMutaion.mutate(formData)

    }

    const joinMutaion = useMutation({
        mutationFn: (account) => {
            return joinUser(account)
                .then( result => {
                    console.log(result)
                    if(result.status === 200)
                    {
                        showAlert('가입되었습니다. 로그인 페이지로 이동합니다.', goLogin);
                    }else{
                        showAlert(result.data?.message || '가입에 실패했습니다.');
                    }
                })
                .catch(
                    (err) => {
                        const errorMessage = err.response?.data?.message || err.message || '가입 중 오류가 발생했습니다.';
                        showAlert(errorMessage);
                    }
                )
                .finally()
        }
    })


    return(
        <>
            <h2 className="mb-4">회원가입</h2>
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
                        <Button type="button" variant="primary" onClick={join}>
                            회원가입
                        </Button>
                        <Button type="button" variant="dark" onClick={()=>nav('/login')} className="ms-2">
                            취소
                        </Button>
                    </Col>

                </Row>

            </Form>

            <Alert
                message={popMessage}
                type={type}
                showPop={showPop}
                setShowPop={closePop}
                callback={callback}
            />
        </>
    )
}

export default Join