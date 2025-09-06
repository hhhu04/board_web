import {useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getCyphersMatch, getDnfDetail, getDnfTimeline} from "../../api/game/GameApi.jsx";

const  Dnf = ({ gameKey, subVal }) => {
    const [activeTab, setActiveTab] = useState('timeline');

    const {data:characterData, refetch, remove} = useQuery({
        queryKey: ["DNF_CHARACTER", gameKey, subVal],
        queryFn: () => {
            if (!gameKey) {
                return null;
            }
            return getDnfDetail({characterId:gameKey, serverId:subVal});
        },
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["DNF_TIMELINE", gameKey, subVal],
        queryFn: ({ pageParam = '' }) => {
            if (!gameKey) {
                return null;
            }
            return getDnfTimeline({characterId:gameKey, serverId:subVal, next:pageParam});
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.next ?? undefined,
    })

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Character Profile Section */}
            {characterData?.character && (
                <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img 
                            src={`https://img-api.neople.co.kr/df/servers/${subVal}/characters/${gameKey}?zoom=1`}
                            alt={characterData.character.characterName}
                            style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                        />
                        <div>
                            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{characterData.character.characterName}</h2>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <span><strong>레벨:</strong> {characterData.character.level}</span>
                                <span><strong>직업:</strong> {characterData.character.jobGrowName}</span>
                                <span><strong>길드:</strong> {characterData.character.guildName || '없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('timeline')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: activeTab === 'timeline' ? '#007bff' : 'transparent',
                        color: activeTab === 'timeline' ? 'white' : '#333',
                        cursor: 'pointer',
                        borderRadius: '4px 4px 0 0',
                        marginRight: '5px'
                    }}
                >
                    타임라인
                </button>
                <button
                    onClick={() => setActiveTab('info')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: activeTab === 'info' ? '#007bff' : 'transparent',
                        color: activeTab === 'info' ? 'white' : '#333',
                        cursor: 'pointer',
                        borderRadius: '4px 4px 0 0'
                    }}
                >
                    캐릭터 정보
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'timeline' && (
                <div>
                    {data?.pages.map((page, i) => (
                        page?.rows?.map((item, j) => {
                            const getItemGradeColor = (grade) => {
                                switch(grade) {
                                    case 'COMMON': return { color: '#6c757d', text: '일반' };
                                    case 'UNCOMMON': return { color: '#28a745', text: '고급' };
                                    case 'RARE': return { color: '#007bff', text: '레어' };
                                    case 'EPIC': return { color: '#6f42c1', text: '에픽' };
                                    case 'LEGENDARY': return { color: '#fd7e14', text: '전설' };
                                    case 'ARTIFACT': return { color: '#e83e8c', text: '아티팩트' };
                                    default: return { color: '#6c757d', text: grade || '일반' };
                                }
                            };

                            const getActivityTitle = (item) => {
                                const location = item.data?.dungeonName || item.location || '알 수 없는 곳';
                                const code = item.code;

                                switch(true) {
                                    case code >= 500:
                                        return `${item.name} (${location})`;
                                    case code === 201:
                                        return `${item.name} (${item.data.modeName} ${item.data.raidName})`;
                                    case code === 210:
                                        return `${item.name} (${item.data.raidName})`;
                                    case code === 209:
                                        return `${item.name} (${item.data.regionName})`;
                                    case code === 402:
                                        return `${item.name} (${item.data.before} > ${item.data.after} ${item.data.result ? '성공' : '실패'})`;
                                    default:
                                        return `${item.name} (${location})`;
                                }
                            };

                            return (
                                <div key={`${i}-${j}`} style={{ 
                                    backgroundColor: 'white', 
                                    padding: '20px', 
                                    marginBottom: '15px', 
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {(() => {
                                                const code = item.code;
                                                let iconSrc = null;
                                                
                                                switch(true) {
                                                    case (code === 201):
                                                       iconSrc = `https://resource.df.nexon.com/ui/img/mypage/ico/2_29.png`
                                                        break;
                                                    case (code === 210):
                                                       iconSrc = `https://resource.df.nexon.com/ui/img/mypage/ico/2_33.png`
                                                       break;
                                                    case (code === 209):
                                                        iconSrc = `https://resource.df.nexon.com/ui/img/mypage/ico/16_5.png`
                                                        break;
                                                    case (code >= 500 || code === 402):
                                                        iconSrc = `https://img-api.neople.co.kr/df/items/${item.data.itemId}`;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                
                                                return iconSrc && (
                                                    <img 
                                                        src={iconSrc}
                                                        alt="activity icon"
                                                        style={{ 
                                                            width: '24px', 
                                                            height: '24px',
                                                            borderRadius: '4px'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                );
                                            })()}
                                            <h4 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                                                {getActivityTitle(item)}
                                            </h4>
                                        </div>
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: '#666', 
                                            backgroundColor: '#f0f0f0', 
                                            padding: '4px 8px', 
                                            borderRadius: '12px'
                                        }}>
                                            {item.date}
                                        </span>
                                    </div>
                                    
                                    {/* 아이템 정보만 표시 */}
                                    {item.items && item.items.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {item.items.map((itemDetail, idx) => {
                                                const gradeInfo = getItemGradeColor(itemDetail.itemGrade);
                                                return (
                                                    <div key={idx} style={{ 
                                                        backgroundColor: '#f8f9fa', 
                                                        padding: '8px 12px', 
                                                        borderRadius: '6px', 
                                                        border: `2px solid ${gradeInfo.color}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        minWidth: '140px'
                                                    }}>
                                                        <img 
                                                            src={`https://img-api.neople.co.kr/df/items/${itemDetail.itemId}`}
                                                            alt={itemDetail.itemName}
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                borderRadius: '4px',
                                                                border: `1px solid ${gradeInfo.color}`
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ 
                                                                fontSize: '13px', 
                                                                fontWeight: 'bold',
                                                                color: '#333',
                                                                marginBottom: '2px'
                                                            }}>
                                                                {itemDetail.itemName}
                                                            </span>
                                                            <span style={{ 
                                                                fontSize: '11px', 
                                                                color: gradeInfo.color,
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {gradeInfo.text}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ))}
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                width: '100%',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            {isFetchingNextPage ? '로딩중...' : '더보기'}
                        </button>
                    )}
                </div>
            )}

            {activeTab === 'info' && characterData && (
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {/* 기본 정보 */}
                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '5px' }}>기본 정보</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div><strong>캐릭터명:</strong> {characterData.character?.characterName}</div>
                                <div><strong>레벨:</strong> {characterData.character?.level}</div>
                                <div><strong>직업:</strong> {characterData.character?.jobName}</div>
                                <div><strong>전직:</strong> {characterData.character?.jobGrowName}</div>
                                <div><strong>길드:</strong> {characterData.character?.guildName || '없음'}</div>
                            </div>
                        </div>

                        {/* 능력치 */}
                        {characterData.status && (
                            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '5px' }}>능력치</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div><strong>힘:</strong> {characterData.status.strength || 0}</div>
                                    <div><strong>체력:</strong> {characterData.status.vitality || 0}</div>
                                    <div><strong>정신력:</strong> {characterData.status.spirit || 0}</div>
                                    <div><strong>지능:</strong> {characterData.status.intelligence || 0}</div>
                                </div>
                            </div>
                        )}

                        {/* 장비 */}
                        {characterData.equipment && (
                            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '5px' }}>주요 장비</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {characterData.equipment.slice(0, 5).map((item, idx) => (
                                        <div key={idx} style={{ padding: '5px', backgroundColor: 'white', borderRadius: '4px', fontSize: '13px' }}>
                                            <strong>{item.slotName}:</strong> {item.itemName || '장착 없음'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 기타 정보 */}
                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '5px' }}>기타</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div><strong>명성:</strong> {characterData.character?.fame || 0}</div>
                                <div><strong>서버:</strong> {characterData.character?.serverId}</div>
                                <div><strong>캐릭터 ID:</strong> {characterData.character?.characterId}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dnf
