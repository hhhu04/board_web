import React, { useState } from 'react';
import {useQuery} from "@tanstack/react-query";
import {getCyphersMatch, getCyphersMatchList} from "../../api/game/GameApi.jsx";
import '../../styles/Cyphers.css';

const Cyphers = ({ gameKey }) => {
    const [selectedMode, setSelectedMode] = useState('rating');

    const {data, refetch, remove} = useQuery({
        queryKey: ["CYPHERS_MATCH",selectedMode],
        queryFn: () => {
            if (!gameKey) {
                return null;
            }
            return getCyphersMatch({playerId:gameKey, gameTypeId:selectedMode});
        },
    })

    // const {data:matchList, refetch:matchRefetch, remove:matchRemove} = useQuery({
    //     queryKey: ["CYPHERS_MATCH_LIST",selectedMode],
    //     queryFn: () => {
    //         if (!gameKey) {
    //             return null;
    //         }
    //         return getCyphersMatchList({});
    //     },
    // })

    return (
        <div className="cyphers-container">
            <h1 className="cyphers-title">Cyphers</h1>
            
            {data ? (
                <div className="player-info-container">
                    <div className="player-info-section">
                        <h2 className="player-info-title">플레이어 정보</h2>
                        <p><strong>닉네임:</strong> {data.nickname || '정보 없음'}</p>
                        <p><strong>등급:</strong> {data.grade || '정보 없음'}</p>
                        <p><strong>클랜:</strong> {data.clanName || '없음'}</p>
                    </div>
                    
                    <div>
                        <h3 className="records-section-title">전적</h3>
                        
                        <div className="mode-selection">
                            <label className="radio-label">
                                <input 
                                    type="radio" 
                                    value="rating" 
                                    checked={selectedMode === 'rating'} 
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    className="radio-input"
                                />
                                Rating
                            </label>
                            <label className="radio-label">
                                <input 
                                    type="radio" 
                                    value="normal" 
                                    checked={selectedMode === 'normal'} 
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    className="radio-input"
                                />
                                Normal
                            </label>
                        </div>

                        {data && (
                            <div>
                                {selectedMode === 'rating' && (
                                    <div>
                                        <div className="stats-container">
                                            <span className="stat-wins">
                                                승리: {data.wins || 0}
                                            </span>
                                            <span className="stat-losses">
                                                패배: {data.losses || 0}
                                            </span>
                                            <span className="stat-winrate">
                                                승률: {data.winRate ? `${data.winRate}%` : '계산 불가'}
                                            </span>
                                        </div>
                                        <div className="matches-container">
                                            <h4 className="matches-title">Rating 경기 목록</h4>
                                            {data.matches && data.matches.rows && data.matches.rows.length > 0 ? data.matches.rows.map((match, index) => (
                                                <div key={index} className={`match-item ${match.playResult === 'win' ? 'win' : 'lose'}`}>
                                                    <div className="match-content">
                                                        <div className="match-left-info">
                                                            <span className="character-name">{match.playInfo.characterName || '캐릭터 정보 없음'}</span>
                                                            <span className="character-level">Lv.{match.playInfo.level}</span>
                                                            <span className="map-name">({match.map?.name || '맵 정보 없음'})</span>
                                                            <div className="match-playtime">
                                                                플레이타임: {Math.floor(match.playInfo.playTime / 60)}분 {match.playInfo.playTime % 60}초
                                                            </div>
                                                        </div>
                                                        <div className="match-right-info">
                                                            <div className={`match-result ${match.playResult === 'win' ? 'win' : 'lose'}`}>
                                                                {match.playResult === 'win' ? '승리' : '패배'}
                                                            </div>
                                                            <small className="match-date">{match.date}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="no-matches-message">
                                                    Rating 경기 기록이 없습니다.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedMode === 'normal' && (
                                    <div>
                                        <div className="matches-container">
                                            <h4 className="matches-title">일반 경기 목록</h4>
                                            {data.matches && data.matches.rows && data.matches.rows.length > 0 ? data.matches.rows.map((match, index) => (
                                                <div key={index} className="match-item normal">
                                                    <div className="match-content">
                                                        <div className="match-left-info">
                                                            <span className="character-name">{match.playInfo.characterName || '캐릭터 정보 없음'}</span>
                                                            <span className="character-level">Lv.{match.playInfo.level}</span>
                                                            <span className="map-name">({match.map?.name || '맵 정보 없음'})</span>
                                                            <div className="match-playtime">
                                                                플레이타임: {Math.floor(match.playInfo.playTime / 60)}분 {match.playInfo.playTime % 60}초
                                                            </div>
                                                        </div>
                                                        <div className="match-right-info">
                                                            <small className="match-date">{match.date}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="no-matches-message">
                                                    일반 경기 기록이 없습니다.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="loading-message">
                    <p>데이터를 불러오는 중...</p>
                </div>
            )}
            
            <div className="notice-footer">
                * 오늘기준 30일 기록이 조회됩니다.
            </div>
        </div>
    );
};

export default Cyphers;