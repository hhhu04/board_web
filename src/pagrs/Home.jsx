import Form from "react-bootstrap/Form";
import {Button, Card} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getCypherInfo, getDnfInfo, mergeFavorites} from "../api/game/GameApi.jsx";
import Alert from "../components/Alert.jsx";
import {UserStore} from "../store/UserStore.jsx";
import {useNavigate} from "react-router-dom";


function Home() {

    const [radioVal, setRadioVal] = useState('')
    const [nicknameVal, setNicknameVal] = useState('')

    const [popMessage, setPopMessage] = useState('')
    const [showPop, setShowPop] = useState(false)
    const [type, setType] = useState('alert')
    const [callback, setCallback] = useState(null)

    const [params, setParams] = useState({})
    const [isFavorite, setIsFavorite] = useState(false)

    const { isLogin } = UserStore((state) => state);

    const nav = useNavigate();

    const closePop = () => {
        setShowPop(false)
    }

    const showAlert = useCallback((message, onConfirm = closePop) => {
        setPopMessage(message);
        setType('alert');
        setShowPop(true);
        setCallback(() => onConfirm); // 함수를 반환하는 함수로 설정
    }, [closePop]);

    const handleRadioChange = (value) => {
        setRadioVal(value);
        setNicknameVal('');
        removeCyphersData?.();
        removeDnfData?.();
    };

    const search = () => {
        if(!radioVal){
            showAlert('게임 종류를 선택해주세요.')
            return
        }

        if(!nicknameVal){
            showAlert('닉네임 또는 아이디를 입력해주세요.')
            return
        }

        console.log(radioVal)

        switch (radioVal)
        {
            case '사퍼':
                setParams({
                    nickname: nicknameVal
                })
                void cyphersSearch();
                break;
            case '던파':
                setParams({
                    characterName: nicknameVal
                })
                void dnfSearch();
                break;

        }


    }


    const {data:cyphersData, refetch: cyphersSearch, remove: removeCyphersData} = useQuery({
        queryKey: ["CYPHERS_INFO"],
        queryFn: () => {
            if (!params.nickname) {
                return null;
            }
            return getCypherInfo(params);
        },
        enabled: false
    })

    const {data:dnfData, refetch: dnfSearch, remove: removeDnfData} = useQuery({
        queryKey: ["DNF_INFO"],
        queryFn: () => {
            if (!params.characterName) {
                return null;
            }
            return getDnfInfo(params);
        },
        enabled: false
    })


    const favoriteUpdate = (game_type, game_key) => {
        if(!isLogin){
            showAlert('로그인 후 이용해주세요.')
            return
        }

        const data = {
            game_type: game_type,
            game_key: game_key
        }

        favoriteMutaion.mutate(data)
    }

    const favoriteMutaion = useMutation({
        mutationFn: (data) => {
            return mergeFavorites(data)
                .then( result => {
                    console.log(result)
                    if(result.status === 200)
                    {
                        console.log(result.data)
                        switch (radioVal){
                            case '사퍼':void cyphersSearch();break;
                            case '던파':void dnfSearch();break;

                        }
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

    const moveDetail = (key) => {
        nav(`/detail/${radioVal}/${key}`)
    }


    return(
        <>
            <Form>
                {['radio'].map((type) => (
                    <div key={`inline-${type}`} className="mb-3">
                        <Form.Check
                            inline
                            label="던파"
                            name="group1"
                            type={type}
                            id={`inline-${type}-1`}
                            value="던파"
                            checked={radioVal === '던파'}
                            onChange={(e) => handleRadioChange(e.target.value)}
                        />
                        <Form.Check
                            inline
                            label="사퍼"
                            name="group1"
                            type={type}
                            id={`inline-${type}-2`}
                            value="사퍼"
                            checked={radioVal === '사퍼'}
                            onChange={(e) => handleRadioChange(e.target.value)}
                        />
                        <Form.Check
                            inline
                            label="롤"
                            name="group1"
                            type={type}
                            id={`inline-${type}-3`}
                            value="롤"
                            checked={radioVal === '롤'}
                            onChange={(e) => handleRadioChange(e.target.value)}
                        />
                    </div>
                ))}
            </Form>
            <Form.Control
                type="text"
                id="inputPassword5"
                placeholder="닉네임/아이디"
                value={nicknameVal}
                onChange={(e) => setNicknameVal(e.target.value)}
            />
            <br/>
            <div className="d-grid gap-2" style={{ zIndex: 1, position: 'relative' }}>
                <Button variant="primary" size="lg" onClick={search}>
                    검색
                </Button>
            </div>


                {
                    cyphersData !== null && cyphersData !== undefined && radioVal === '사퍼' ?
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                <Card style={{ width: '18rem' }} onClick={() => moveDetail(cyphersData.playerId)}>
                                    <Card.Img variant="top" src={`https://img-api.neople.co.kr/cy/characters/${cyphersData.represent.characterId}?zoom=3`}/>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <Card.Title className="mb-0">{cyphersData?.nickname}</Card.Title>
                                            {
                                                isLogin ?
                                                    <Button
                                                        variant={cyphersData.favorite ? "warning" : "outline-warning"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            favoriteUpdate(2,cyphersData.playerId);
                                                        }}
                                                    >
                                                        {cyphersData.favorite ? "⭐" : "☆"}

                                                    </Button>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">등급:</span>
                                                <span>{cyphersData?.grade}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">클랜:</span>
                                                <span>{cyphersData?.clanName || '없음'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">티어:</span>
                                                <span>{cyphersData?.tierName || '기록없음'}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </>
                        :
                        null
                }
                {
                    dnfData !== null && dnfData !== undefined && radioVal === '던파' ?
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={`https://img-api.neople.co.kr/df/servers/${dnfData.serverId}/characters/${dnfData.characterId}?zoom=1`} style={{ marginTop: '-5rem' }}/>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <Card.Title className="mb-0">{dnfData?.characterName}</Card.Title>
                                            {
                                                isLogin ?
                                                    <Button
                                                        variant={dnfData.favorite ? "warning" : "outline-warning"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            favoriteUpdate(2,dnfData.characterId);
                                                        }}
                                                    >
                                                        {dnfData.favorite ? "⭐" : "☆"}
                                                    </Button>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">레벨:</span>
                                                <span>{dnfData?.level}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">직업:</span>
                                                <span>{dnfData?.jobGrowName}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">명성:</span>
                                                <span>{dnfData?.fame || '기록없음'}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </>
                        :
                        null
                }
                {
                    radioVal === '롤' ?
                        <Card.Img variant="top" src="holder.js/100px180" />
                        :
                        null
                }


            <Alert
                message={popMessage}
                type={type}
                callback={callback}
                showPop={showPop}
                setShowPop={closePop}
            />

        </>
    )
}

export default Home