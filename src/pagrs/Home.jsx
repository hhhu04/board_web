import Form from "react-bootstrap/Form";
import {Button, Card} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getCypherInfo, getDnfInfo, getLolInfo, mergeFavorites} from "../api/game/GameApi.jsx";
import Alert from "../components/Alert.jsx";
import {UserStore} from "../store/UserStore.jsx";
import {useNavigate} from "react-router-dom";
import '../styles/Home.css';


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
        removeLolData?.();
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
            case '롤':
                if(nicknameVal.indexOf('#') === -1){
                    showAlert('플레이어 이름 + #태그 를 입력해주세요. ')
                    return;
                }
                setParams({
                    gameName: nicknameVal.split('#')[0],
                    tag: nicknameVal.split('#')[1]
                })
                console.log(params)
                void lolSearch();
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

    const {data:lolData, refetch: lolSearch, remove: removeLolData} = useQuery({
        queryKey: ["LOL_INFO"],
        queryFn: () => {
            if (!params.gameName || !params.tag) {
                return null;
            }
            return getLolInfo(params);
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
                            case '롤':void lolSearch();break;

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

    const moveDetail = (key, subVal = '') => {
        let game = ''
        if(radioVal === '던파'){
            game = 'dnf'
        }
        else if(radioVal === '사퍼'){
            game = 'cyphers'
        }
        else if(radioVal === '롤'){
            game = 'lol'
        }

        let url  = `/detail/${game}/${key}`
        if(subVal !== ''){
            url += `?subVal=${subVal}`
        }
        nav(url)
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
                            <div className="game-card-container">
                                <Card className="game-card single" onClick={() => moveDetail(cyphersData.playerId)}>
                                    <Card.Img variant="top" src={`https://img-api.neople.co.kr/cy/characters/${cyphersData.represent.characterId}?zoom=3`}/>
                                    <Card.Body>
                                        <div className="card-header">
                                            <Card.Title className="card-title">
                                                {cyphersData?.nickname}
                                            </Card.Title>
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
                                        <div className="card-info-list">
                                            <div className="card-info-row">
                                                <span className="card-info-label">등급:</span>
                                                <span className="card-info-value">{cyphersData?.grade}</span>
                                            </div>
                                            <div className="card-info-row">
                                                <span className="card-info-label">클랜:</span>
                                                <span className="card-info-value">{cyphersData?.clanName || '없음'}</span>
                                            </div>
                                            <div className="card-info-row">
                                                <span className="card-info-label">티어:</span>
                                                <span className="card-info-value">{cyphersData?.tierName || '기록없음'}</span>
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
                    dnfData && dnfData.rows && dnfData.rows.length > 0 && radioVal === '던파' ?
                        <>
                            <div className="game-card-container grid">
                                {dnfData.rows.map((character, index) => (
                                    <Card
                                        key={index} 
                                        className="game-card grid-item"
                                        onClick={() => moveDetail(character.characterId, character.serverId)}
                                    >
                                        <Card.Img 
                                            variant="top" 
                                            src={`https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`} 
                                            className="dnf-character-image"
                                        />
                                        <Card.Body>
                                            <div className="card-header">
                                                <Card.Title className="card-title">
                                                    {character?.characterName}
                                                </Card.Title>
                                                {
                                                    isLogin ?
                                                        <Button
                                                            variant={character.favorite ? "warning" : "outline-warning"}
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                favoriteUpdate(1, character.characterId);
                                                            }}
                                                        >
                                                            {character.favorite ? "⭐" : "☆"}
                                                        </Button>
                                                        :
                                                        null
                                                }
                                            </div>
                                            <div className="card-info-list">
                                                <div className="card-info-row">
                                                    <span className="card-info-label">레벨:</span>
                                                    <span className="card-info-value">{character?.level}</span>
                                                </div>
                                                <div className="card-info-row">
                                                    <span className="card-info-label">직업:</span>
                                                    <span className="card-info-value">{character?.jobGrowName}</span>
                                                </div>
                                                <div className="card-info-row">
                                                    <span className="card-info-label">명성:</span>
                                                    <span className="card-info-value">{character?.fame || '기록없음'}</span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </>
                        :
                        null
                }
                {
                    lolData !== null && lolData !== undefined && radioVal === '롤' ?
                        <>
                            <div className="game-card-container">
                                <Card className="game-card single" onClick={() => moveDetail(lolData.puuid)}>
                                    <Card.Img variant="top" src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${lolData.profileIconId}.png`}/>
                                    <Card.Body>
                                        <div className="card-header">
                                            <Card.Title className="card-title">
                                                {nicknameVal}
                                            </Card.Title>
                                            {
                                                isLogin ?
                                                    <Button
                                                        variant={lolData.favorite ? "warning" : "outline-warning"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            favoriteUpdate(3,lolData.puuid);
                                                        }}
                                                    >
                                                        {lolData.favorite ? "⭐" : "☆"}
                                                    </Button>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="card-info-list">
                                            <div className="card-info-row">
                                                <span className="card-info-label">레벨:</span>
                                                <span className="card-info-value">{lolData?.summonerLevel}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </>
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