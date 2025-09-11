import {useQuery} from "@tanstack/react-query";
import {getDnfDetail, getLolDetail} from "../../api/game/GameApi.jsx";
import '../../styles/Lol.css';
import { useState } from 'react';

const Lol = ({ gameKey, subVal}) => {
    const [expandedMatches, setExpandedMatches] = useState({});

    const {data, refetch, remove} = useQuery({
        queryKey: ["LOL_DETAIL", gameKey],
        queryFn: () => {
            if (!gameKey) {
                return null;
            }
            return getLolDetail(gameKey);
        },
    })

    // 해당 유저가 승리했는지 패배했는지 확인하는 함수
    const getUserMatchResult = (matchInfo, userInfo) => {
        if (!matchInfo?.participants || !userInfo) return null;
        
        const currentUser = matchInfo.participants.find(participant => 
            participant.puuid === userInfo.puuid
        );
        
        return currentUser ? currentUser.win : null;
    };

    const toggleTeamInfo = (matchIndex) => {
        setExpandedMatches(prev => ({
            ...prev,
            [matchIndex]: !prev[matchIndex]
        }));
    };

    const getGameModeDisplayName = (gameMode) => {
        switch(gameMode) {
            case 'CLASSIC':
                return '소환사의 협곡';
            case 'ARAM':
                return '칼바람 나락';
            default:
                return gameMode;
        }
    };


    // 매치 데이터가 없으면 로딩 상태 표시
    if (!data) {
        return <div>데이터를 불러오는 중...</div>;
    }

    const { userInfo, matchList } = data;

    return (
        <div className="lol-container">
            {/* 유저 정보 섹션 */}
            {userInfo && (
                <div className="user-info-section">
                    <div className="user-profile">
                        <div className="user-icon">
                            <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${userInfo.profileIconId}.png`}
                                alt="Profile Icon"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="user-details">
                            <h2 className="summoner-name">{userInfo.name}</h2>
                            <div className="user-stats">
                                <div><strong></strong> {subVal}</div>
                                <div><strong>레벨:</strong> {userInfo.summonerLevel}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 매치 리스트 섹션 */}
            {matchList && matchList.length > 0 && (
                <div className="match-list-section">
                    <h3>최근 경기</h3>
                    {matchList.map((match, index) => {
                        const isWin = getUserMatchResult(match.info, userInfo);
                        const matchRowClass = isWin === true ? 'match-row win' : 
                                             isWin === false ? 'match-row loss' : 'match-row';
                        
                        return (
                            <div key={index} className={matchRowClass}>
                                <div className="match-header">
                                    <div className="match-result">
                                        <span className={`result-text ${isWin ? 'win-text' : 'loss-text'}`}>
                                            {isWin ? '승리' : '패배'}
                                        </span>
                                        <span className="game-mode">{getGameModeDisplayName(match.info.gameMode)}</span>
                                    </div>
                                    <div className="match-info">
                                        <div className="match-duration">
                                            {Math.floor(match.info.gameDuration / 60)}분 {match.info.gameDuration % 60}초
                                        </div>
                                        <div className="match-date">
                                            {new Date(match.info.gameCreation).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 현재 유저의 정보 */}
                                {match.info.participants && (
                                    <div className="current-user-match-info">
                                        {match.info.participants
                                            .filter(participant => participant.puuid === userInfo.puuid)
                                            .map((participant, pIndex) => (
                                                <div key={pIndex} className="user-match-details">
                                                    <div className="champion-info">
                                                        <img 
                                                            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                                                            alt={participant.championName}
                                                            className="champion-icon"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <span className="champion-name">{participant.championName}</span>
                                                    </div>
                                                    <div className="kda-info">
                                                        <span className="kda">
                                                            {participant.kills}/{participant.deaths}/{participant.assists}
                                                        </span>
                                                        <span className="kda-ratio">
                                                            KDA: {((participant.kills + participant.assists) / Math.max(participant.deaths, 1)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="stats-info">
                                                        <span>CS: {participant.totalMinionsKilled + participant.neutralMinionsKilled}</span>
                                                        <span>골드: {participant.goldEarned?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                                
                                {/* 팀 정보 토글 버튼 */}
                                <div className="team-info-toggle" onClick={() => toggleTeamInfo(index)}>
                                    <span>팀 정보</span>
                                    <span className={`arrow ${expandedMatches[index] ? 'expanded' : ''}`}>▼</span>
                                </div>
                                
                                {/* 참여한 모든 유저 정보 (간략히) */}
                                {expandedMatches[index] && (
                                    <div className="all-participants">
                                    <div className="team-section">
                                        <h5>팀 1</h5>
                                        <div className="participants-grid">
                                            {match.info.participants
                                                .filter(p => p.teamId === 100)
                                                .map((participant, pIndex) => (
                                                    <div key={pIndex} className="participant-item">
                                                        <img 
                                                            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                                                            alt={participant.championName}
                                                            className="participant-champion"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <div className="participant-info">
                                                            <span className="participant-name">{participant.riotIdGameName}#{participant.riotIdTagline}</span>
                                                            <span className="participant-damage">{participant.totalDamageDealtToChampions?.toLocaleString() || 0}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    
                                    <div className="team-section">
                                        <h5>팀 2</h5>
                                        <div className="participants-grid">
                                            {match.info.participants
                                                .filter(p => p.teamId === 200)
                                                .map((participant, pIndex) => (
                                                    <div key={pIndex} className="participant-item">
                                                        <img 
                                                            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                                                            alt={participant.championName}
                                                            className="participant-champion"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <div className="participant-info">
                                                            <span className="participant-name">{participant.riotIdGameName}#{participant.riotIdTagline}</span>
                                                            <span className="participant-damage">{participant.totalDamageDealtToChampions?.toLocaleString() || 0}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            
            {(!matchList || matchList.length === 0) && (
                <div className="no-matches">
                    매치 기록이 없습니다.
                </div>
            )}
        </div>
    )
}

export default Lol