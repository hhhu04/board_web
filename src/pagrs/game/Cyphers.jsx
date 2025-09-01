import React, { useState } from 'react';
import {useQuery} from "@tanstack/react-query";
import {getCyphersMatch, getCyphersMatchList} from "../../api/game/GameApi.jsx";

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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Cyphers</h1>
            
            {data ? (
                <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>플레이어 정보</h2>
                        <p><strong>닉네임:</strong> {data.nickname || '정보 없음'}</p>
                        <p><strong>등급:</strong> {data.grade || '정보 없음'}</p>
                        <p><strong>클랜:</strong> {data.clanName || '없음'}</p>
                    </div>
                    
                    <div>
                        <h3 style={{ color: '#333', marginBottom: '10px' }}>전적</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ marginRight: '10px' }}>
                                <input 
                                    type="radio" 
                                    value="rating" 
                                    checked={selectedMode === 'rating'} 
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    style={{ marginRight: '5px' }}
                                />
                                Rating
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="normal" 
                                    checked={selectedMode === 'normal'} 
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    style={{ marginRight: '5px' }}
                                />
                                Normal
                            </label>
                        </div>

                        {data && (
                            <div>
                                {selectedMode === 'rating' && (
                                    <div>
                                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                            <span style={{ backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                                                승리: {data.wins || 0}
                                            </span>
                                            <span style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                                                패배: {data.losses || 0}
                                            </span>
                                            <span style={{ backgroundColor: '#2196F3', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                                                승률: {data.winRate ? `${data.winRate}%` : '계산 불가'}
                                            </span>
                                        </div>
                                        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto' }}>
                                            <h4>Rating 경기 목록</h4>
                                            {data.matches && data.matches.rows && data.matches.rows.length > 0 ? data.matches.rows.map((match, index) => (
                                                <div key={index} style={{ 
                                                    padding: '8px', 
                                                    marginBottom: '5px', 
                                                    backgroundColor: match.playResult === 'win' ? '#e8f5e8' : '#fce8e8',
                                                    borderRadius: '4px',
                                                    borderLeft: `4px solid ${match.playResult === 'win' ? '#4CAF50' : '#f44336'}`
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <span style={{ fontWeight: 'bold' }}>{match.playInfo.characterName || '캐릭터 정보 없음'}</span>
                                                            <span style={{ margin: '0 10px', color: '#666' }}>Lv.{match.playInfo.level}</span>
                                                            <span style={{ color: '#888' }}>({match.map?.name || '맵 정보 없음'})</span>
                                                            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                                                플레이타임: {Math.floor(match.playInfo.playTime / 60)}분 {match.playInfo.playTime % 60}초
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: match.playResult === 'win' ? '#4CAF50' : '#f44336' }}>
                                                                {match.playResult === 'win' ? '승리' : '패배'}
                                                            </div>
                                                            <small style={{ color: '#666' }}>{match.date}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                    Rating 경기 기록이 없습니다.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedMode === 'normal' && (
                                    <div>
                                        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto' }}>
                                            <h4>일반 경기 목록</h4>
                                            {data.matches && data.matches.rows && data.matches.rows.length > 0 ? data.matches.rows.map((match, index) => (
                                                <div key={index} style={{ 
                                                    padding: '8px', 
                                                    marginBottom: '5px', 
                                                    backgroundColor: '#f9f9f9',
                                                    borderRadius: '4px',
                                                    borderLeft: '4px solid #9E9E9E'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <span style={{ fontWeight: 'bold' }}>{match.playInfo.characterName || '캐릭터 정보 없음'}</span>
                                                            <span style={{ margin: '0 10px', color: '#666' }}>Lv.{match.playInfo.level}</span>
                                                            <span style={{ color: '#888' }}>({match.map?.name || '맵 정보 없음'})</span>
                                                            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                                                플레이타임: {Math.floor(match.playInfo.playTime / 60)}분 {match.playInfo.playTime % 60}초
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <small style={{ color: '#666' }}>{match.date}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
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
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>데이터를 불러오는 중...</p>
                </div>
            )}
            
            <div style={{ 
                marginTop: '20px', 
                paddingTop: '10px', 
                borderTop: '1px solid #e0e0e0',
                fontSize: '12px', 
                color: '#999', 
                textAlign: 'center' 
            }}>
                * 오늘기준 30일 기록이 조회됩니다.
            </div>
        </div>
    );
};

export default Cyphers;