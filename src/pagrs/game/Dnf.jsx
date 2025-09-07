import {useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getCyphersMatch, getDnfDetail, getDnfTimeline} from "../../api/game/GameApi.jsx";

const  Dnf = ({ gameKey, subVal }) => {
    const [activeTab, setActiveTab] = useState('timeline');
    const [activeInfoTab, setActiveInfoTab] = useState('stats');

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
                            src={`https://img-api.neople.co.kr/df/servers/${subVal}/characters/${gameKey}?zoom=3`}
                            alt={characterData.character.characterName}
                            style={{ width: '300px', height: '300px', borderRadius: '8px' }}
                        />
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>{characterData.character.characterName}</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                                <div><strong>레벨:</strong> {characterData.character.level}</div>
                                <div><strong>직업:</strong> {characterData.character.jobName}</div>
                                <div><strong>전직:</strong> {characterData.character.jobGrowName}</div>
                                <div><strong>길드:</strong> {characterData.character.guildName || '없음'}</div>
                                <div><strong>명성:</strong> {characterData.character.fame?.toLocaleString() || '0'}</div>
                                <div><strong>서버:</strong> {characterData.character.serverId}</div>
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
                    {/* Sub Tab Navigation */}
                    <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
                        {['stats', 'buffs', 'equipment', 'avatar'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveInfoTab(tab)}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: activeInfoTab === tab ? '#28a745' : 'transparent',
                                    color: activeInfoTab === tab ? 'white' : '#666',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    marginRight: '5px',
                                    fontSize: '14px'
                                }}
                            >
                                {tab === 'stats' ? '스탯' : 
                                 tab === 'buffs' ? '버프' : 
                                 tab === 'equipment' ? '장비' : '아바타'}
                            </button>
                        ))}
                    </div>

                    {/* Sub Tab Content */}
                    {activeInfoTab === 'stats' && characterData.status && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            {Object.entries(characterData.status).map(([key, value]) => {
                                // 값이 객체인 경우 객체의 내용을 표시
                                if (typeof value === 'object' && value !== null) {
                                    // 객체가 name과 value 속성을 가진 경우
                                    if (value.name && (value.value !== undefined)) {
                                        return (
                                            <div key={key} style={{ 
                                                backgroundColor: '#f8f9fa', 
                                                padding: '12px 15px', 
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center' 
                                                }}>
                                                    <span style={{ 
                                                        fontSize: '14px', 
                                                        color: '#495057',
                                                        fontWeight: '500'
                                                    }}>
                                                        {value.name}
                                                    </span>
                                                    <span style={{ 
                                                        fontSize: '14px', 
                                                        fontWeight: 'bold',
                                                        color: '#007bff'
                                                    }}>
                                                        {typeof value.value === 'number' ? value.value.toLocaleString() : String(value.value)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    // 다른 형태의 객체는 건너뛰기
                                    return null;
                                }

                                // 원시 타입 값들은 기존 방식으로 처리
                                if (value === null || value === undefined) return null;
                                
                                const getStatName = (statKey) => {
                                    const statNames = {
                                        strength: '힘',
                                        vitality: '체력', 
                                        spirit: '정신력',
                                        intelligence: '지능',
                                        physicalAttack: '물리공격력',
                                        physicalDefense: '물리방어력',
                                        magicalAttack: '마법공격력',
                                        magicalDefense: '마법방어력',
                                        independence: '독립공격력',
                                        criticalHit: '크리티컬',
                                        hitRate: '적중률',
                                        dodgeRate: '회피율',
                                        moveSpeed: '이동속도',
                                        attackSpeed: '공격속도',
                                        castSpeed: '캐스팅속도',
                                        hpMax: '최대 HP',
                                        mpMax: '최대 MP',
                                        hpRegen: 'HP 회복',
                                        mpRegen: 'MP 회복',
                                        inventory: '인벤토리 무게'
                                    };
                                    return statNames[statKey] || statKey;
                                };
                                
                                return (
                                    <div key={key} style={{ 
                                        backgroundColor: '#f8f9fa', 
                                        padding: '12px 15px', 
                                        borderRadius: '6px',
                                        border: '1px solid #dee2e6'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center' 
                                        }}>
                                            <span style={{ 
                                                fontSize: '14px', 
                                                color: '#495057',
                                                fontWeight: '500'
                                            }}>
                                                {getStatName(key)}
                                            </span>
                                            <span style={{ 
                                                fontSize: '14px', 
                                                fontWeight: 'bold',
                                                color: '#007bff'
                                            }}>
                                                {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeInfoTab === 'buffs' && characterData && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                            {/* 아바타 버프 - 공용 스킬 */}
                            {characterData.buffAvatar?.buff?.skillInfo && (
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', gridColumn: '1 / -1' }}>
                                    <div style={{ 
                                        backgroundColor: 'white', 
                                        padding: '15px', 
                                        borderRadius: '6px',
                                        border: '1px solid #dee2e6',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ 
                                                width: '8px', 
                                                height: '8px', 
                                                backgroundColor: '#e91e63', 
                                                borderRadius: '50%' 
                                            }} />
                                            <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#e91e63' }}>
                                                {characterData.buffAvatar.buff.skillInfo.name}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            레벨: {characterData.buffAvatar.buff.skillInfo.option?.level || 0}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 아바타 버프 */}
                            {characterData.buffAvatar && (
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
                                        아바타 버프
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                        {/* 아바타 아이템들 */}
                                        {characterData.buffAvatar.buff?.avatar && Array.isArray(characterData.buffAvatar.buff.avatar) && 
                                         characterData.buffAvatar.buff.avatar.map((item, idx) => (
                                            <div key={idx} style={{ 
                                                backgroundColor: 'white', 
                                                padding: '15px', 
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {item.itemId && (
                                                        <img 
                                                            src={`https://img-api.neople.co.kr/df/items/${item.itemId}`}
                                                            alt={item.itemName}
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                borderRadius: '4px'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#e91e63' }}>
                                                            {item.slotName}
                                                        </div>
                                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                                            {item.itemName || '아바타 없음'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 크리처 버프 */}
                            {characterData.buffCreature && (
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
                                        크리처 버프
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                        {characterData.buffCreature.buff.creature && Array.isArray(characterData.buffCreature.buff.creature) &&
                                            characterData.buffCreature.buff.creature.map((item, idx) => (
                                                <div key={idx} style={{
                                                    backgroundColor: 'white',
                                                    padding: '15px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #dee2e6'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {item.itemId && (
                                                            <img
                                                                src={`https://img-api.neople.co.kr/df/items/${item.itemId}`}
                                                                alt={item.itemName}
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '4px'
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#e91e63' }}>
                                                                {item.slotName}
                                                            </div>
                                                            <div style={{ fontSize: '13px', color: '#666' }}>
                                                                {item.itemName || '아바타 없음'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* 장비 버프 */}
                            {characterData.buffEquipment && (
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
                                        장비 버프
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                        {characterData.buffEquipment.buff.equipment && Array.isArray(characterData.buffEquipment.buff.equipment) &&
                                            characterData.buffEquipment.buff.equipment.map((item, idx) => (
                                                <div key={idx} style={{
                                                    backgroundColor: 'white',
                                                    padding: '15px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #dee2e6'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {item.itemId && (
                                                            <img
                                                                src={`https://img-api.neople.co.kr/df/items/${item.itemId}`}
                                                                alt={item.itemName}
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '4px'
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#e91e63' }}>
                                                                {item.slotName}
                                                            </div>
                                                            <div style={{ fontSize: '13px', color: '#666' }}>
                                                                {item.itemName || '아바타 없음'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* 버프가 없는 경우 */}
                            {(!characterData.buffAvatar || characterData.buffAvatar.length === 0) &&
                             (!characterData.buffCreature || characterData.buffCreature.length === 0) &&
                             (!characterData.buffEquipment || characterData.buffEquipment.length === 0) && (
                                <div style={{ 
                                    gridColumn: '1 / -1', 
                                    textAlign: 'center', 
                                    padding: '40px', 
                                    color: '#666' 
                                }}>
                                    활성화된 버프가 없습니다.
                                </div>
                            )}
                        </div>
                    )}

                    {activeInfoTab === 'equipment' && characterData.equipment && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                            {characterData.equipment.map((item, idx) => (
                                <div key={idx} style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {item.itemId && (
                                            <img 
                                                src={`https://img-api.neople.co.kr/df/items/${item.itemId}`}
                                                alt={item.itemName}
                                                style={{ 
                                                    width: '32px', 
                                                    height: '32px',
                                                    borderRadius: '4px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.slotName}</div>
                                            <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>{item.itemName || '장착 없음'}</span>
                                                {item.reinforce && item.reinforce > 0 && (
                                                    <span style={{
                                                        backgroundColor: item.amplificationName !== null ? '#e91e63' : '#2196f3',
                                                        color: 'white',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        +{item.reinforce}
                                                    </span>
                                                )}
                                                {item.amplificationName && (
                                                    <span style={{
                                                        backgroundColor: '#e91e63',
                                                        color: 'white',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {item.amplificationName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeInfoTab === 'avatar' && characterData.avatar && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                            {characterData.avatar.map((item, idx) => (
                                <div key={idx} style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {item.itemId && (
                                            <img
                                                src={`https://img-api.neople.co.kr/df/items/${item.itemId}`}
                                                alt={item.itemName}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '4px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.slotName}</div>
                                            <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>{item.itemName || '장착 없음'}</span>
                                                {item.reinforce && item.reinforce > 0 && (
                                                    <span style={{
                                                        backgroundColor: '#e91e63',
                                                        color: 'white',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        +{item.reinforce}
                                                    </span>
                                                )}
                                                {item.amplificationName && (
                                                    <span style={{
                                                        backgroundColor: '#e91e63',
                                                        color: 'white',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {item.amplificationName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dnf
