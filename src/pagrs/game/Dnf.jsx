import {useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getCyphersMatch, getDnfDetail, getDnfTimeline} from "../../api/game/GameApi.jsx";
import '../../styles/Dnf.css';

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
        <div className="dnf-container">
            {/* Character Profile Section */}
            {characterData?.character && (
                <div className="character-profile">
                    <div className="character-header">
                        <img 
                            src={`https://img-api.neople.co.kr/df/servers/${subVal}/characters/${gameKey}?zoom=3`}
                            alt={characterData.character.characterName}
                            className="character-image"
                        />
                        <div className="character-info">
                            <h2 className="character-name">{characterData.character.characterName}</h2>
                            <div className="character-stats">
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
            <div className="tab-navigation">
                <button
                    onClick={() => setActiveTab('timeline')}
                    className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
                >
                    타임라인
                </button>
                <button
                    onClick={() => setActiveTab('info')}
                    className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                >
                    캐릭터 정보
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'timeline' && (
                <div>
                    {data?.pages.map((page, i) => (
                        page?.rows?.map((item, j) => {
                            const getItemGradeInfo = (grade) => {
                                switch(grade) {
                                    case 'COMMON': return { className: 'grade-common', text: '일반' };
                                    case 'UNCOMMON': return { className: 'grade-uncommon', text: '고급' };
                                    case 'RARE': return { className: 'grade-rare', text: '레어' };
                                    case 'EPIC': return { className: 'grade-epic', text: '에픽' };
                                    case 'LEGENDARY': return { className: 'grade-legendary', text: '전설' };
                                    case 'ARTIFACT': return { className: 'grade-artifact', text: '아티팩트' };
                                    default: return { className: 'grade-common', text: grade || '일반' };
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
                                <div key={`${i}-${j}`} className="timeline-item">
                                    <div className="timeline-header">
                                        <div className="timeline-title">
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
                                                        className="activity-icon"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                );
                                            })()}
                                            <h4 className="activity-title">
                                                {getActivityTitle(item)}
                                            </h4>
                                        </div>
                                        <span className="timeline-date">
                                            {item.date}
                                        </span>
                                    </div>
                                    
                                    {/* 아이템 정보만 표시 */}
                                    {item.items && item.items.length > 0 && (
                                        <div className="items-container">
                                            {item.items.map((itemDetail, idx) => {
                                                const gradeInfo = getItemGradeInfo(itemDetail.itemGrade);
                                                return (
                                                    <div key={idx} className={`item-card ${gradeInfo.className}`}>
                                                        <img 
                                                            src={`https://img-api.neople.co.kr/df/items/${itemDetail.itemId}`}
                                                            alt={itemDetail.itemName}
                                                            className="item-image"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <div className="item-details">
                                                            <span className="item-name">
                                                                {itemDetail.itemName}
                                                            </span>
                                                            <span className="item-grade">
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
                            className="load-more-button"
                        >
                            {isFetchingNextPage ? '로딩중...' : '더보기'}
                        </button>
                    )}
                </div>
            )}

            {activeTab === 'info' && characterData && (
                <div className="info-container">
                    {/* Sub Tab Navigation */}
                    <div className="sub-tab-navigation">
                        {['stats', 'buffs', 'equipment', 'avatar'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveInfoTab(tab)}
                                className={`sub-tab-button ${activeInfoTab === tab ? 'active' : ''}`}
                            >
                                {tab === 'stats' ? '스탯' : 
                                 tab === 'buffs' ? '버프' : 
                                 tab === 'equipment' ? '장비' : '아바타'}
                            </button>
                        ))}
                    </div>

                    {/* Sub Tab Content */}
                    {activeInfoTab === 'stats' && characterData.status && (
                        <div className="stats-grid">
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '15px' }}>
                            {/* 공용 스킬 */}
                            {characterData.buffAvatar?.buff?.skillInfo && (
                                <div style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            backgroundColor: '#e91e63', 
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            스킬
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>공용 스킬</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {characterData.buffAvatar.buff.skillInfo.name}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    backgroundColor: '#e91e63',
                                                    color: 'white',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    Lv.{characterData.buffAvatar.buff.skillInfo.option?.level || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 아바타 버프 아이템들 */}
                            {characterData.buffAvatar?.buff?.avatar && Array.isArray(characterData.buffAvatar.buff.avatar) && 
                             characterData.buffAvatar.buff.avatar.map((item, idx) => (
                                <div key={`avatar-${idx}`} style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {item.itemId ? (
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
                                        ) : (
                                            <div style={{ 
                                                width: '32px', 
                                                height: '32px', 
                                                backgroundColor: '#dee2e6', 
                                                borderRadius: '4px'
                                            }} />
                                        )}
                                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.slotName}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.itemName || '아바타 없음'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    backgroundColor: '#6c757d',
                                                    color: 'white',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    아바타
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 크리처 버프 아이템들 */}
                            {characterData.buffCreature?.buff?.creature && Array.isArray(characterData.buffCreature.buff.creature) &&
                             characterData.buffCreature.buff.creature.map((item, idx) => (
                                <div key={`creature-${idx}`} style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {item.itemId ? (
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
                                        ) : (
                                            <div style={{ 
                                                width: '32px', 
                                                height: '32px', 
                                                backgroundColor: '#dee2e6', 
                                                borderRadius: '4px'
                                            }} />
                                        )}
                                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.slotName}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.itemName || '크리처 없음'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    크리처
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 장비 버프 아이템들 */}
                            {characterData.buffEquipment?.buff?.equipment && Array.isArray(characterData.buffEquipment.buff.equipment) &&
                             characterData.buffEquipment.buff.equipment.map((item, idx) => (
                                <div key={`equipment-${idx}`} style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {item.itemId ? (
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
                                        ) : (
                                            <div style={{ 
                                                width: '32px', 
                                                height: '32px', 
                                                backgroundColor: '#dee2e6', 
                                                borderRadius: '4px'
                                            }} />
                                        )}
                                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.slotName}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.itemName || '장비 없음'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    backgroundColor: '#ffc107',
                                                    color: 'black',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    장비
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 버프가 없는 경우 */}
                            {(!characterData.buffAvatar?.buff?.skillInfo) &&
                             (!characterData.buffAvatar?.buff?.avatar || characterData.buffAvatar.buff.avatar.length === 0) &&
                             (!characterData.buffCreature?.buff?.creature || characterData.buffCreature.buff.creature.length === 0) &&
                             (!characterData.buffEquipment?.buff?.equipment || characterData.buffEquipment.buff.equipment.length === 0) && (
                                <div style={{ 
                                    gridColumn: '1 / -1', 
                                    textAlign: 'center', 
                                    padding: '40px', 
                                    color: '#666',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    활성화된 버프가 없습니다.
                                </div>
                            )}
                        </div>
                    )}

                    {activeInfoTab === 'equipment' && characterData.equipment && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '15px' }}>
                            {characterData.equipment.map((item, idx) => (
                                <div key={idx} style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden',
                                    width: '100%',
                                    boxSizing: 'border-box'
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
                                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.slotName}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.itemName || '장착 없음'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {item.reinforce && item.reinforce > 0 && (
                                                    <span style={{
                                                        backgroundColor: '#2196f3',
                                                        color: 'white',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        padding: '2px 6px',
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
                                                        padding: '2px 6px',
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '15px' }}>
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
