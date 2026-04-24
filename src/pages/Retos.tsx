import { useState } from 'react';
import { Trophy, Target, Award, CheckCircle, Clock, Crown, Gift as GiftIcon } from 'lucide-react';
import { useApp, type Challenge } from '../context/AppContext';
import './Retos.css';

const levelConfig = {
  Bronce: { color: '#cd7f32', gradient: 'linear-gradient(135deg, #cd7f32, #8b5a2b)', icon: '🥉', minPoints: 0 },
  Plata: { color: '#94a3b8', gradient: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: '🥈', minPoints: 500 },
  Oro: { color: '#eab308', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', icon: '🥇', minPoints: 2000 },
  Platino: { color: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #334155)', icon: '💎', minPoints: 5000 },
  Diamante: { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', icon: '✨', minPoints: 10000 },
};

const benefitsByLevel = {
  Bronce: ['2% de descuento en tu primera compra', 'Acceso a ofertas exclusivas', 'Puntos por cada compra'],
  Plata: ['5% de descuento permanente', 'Envío gratis en pedidos +30€', ' birthday gift'],
  Oro: ['10% de descuento permanente', 'Envío gratis siempre', 'Atención prioritaria'],
  Platino: ['15% de descuento permanente', 'Envío gratis express', 'Productos exclusivos'],
  Diamante: ['20% de descuento permanente', 'Envío gratis express 24h', 'Asesoramiento personal', 'Invitaciones a eventos'],
};

const rewards = [
  { id: 1, name: '10% de descuento', points: 500, icon: '🎫', description: 'Válido por 30 días' },
  { id: 2, name: 'Envío gratis', points: 300, icon: '🚚', description: 'Una compra' },
  { id: 3, name: 'Gel antibacterial', points: 250, icon: '🧴', description: 'Stock limitado' },
  { id: 4, name: '5% de descuento', points: 200, icon: '🎫', description: 'Válido por 15 días' },
  { id: 5, name: 'Bálsamo labial', points: 150, icon: '💋', description: 'Nuevo aroma' },
  { id: 6, name: '100 puntos extra', points: 100, icon: '⭐', description: 'En tu próxima compra' },
];

const typeIcons: Record<string, string> = {
  daily: '📅',
  weekly: '📆',
  purchase: '🛒',
  referral: '👥',
  streak: '🔥',
};

export default function Retos() {
  const { user, challenges, completeChallenge } = useApp();
  const [activeTab, setActiveTab] = useState<'desafios' | 'canjes' | 'niveles'>('desafios');

  const currentLevel = user.level || 'Bronce';
  const levelData = levelConfig[currentLevel as keyof typeof levelConfig];
  
  const nextLevel = currentLevel === 'Bronce' ? 'Plata' : currentLevel === 'Plata' ? 'Oro' : currentLevel === 'Oro' ? 'Platino' : currentLevel === 'Platino' ? 'Diamante' : null;
  const nextLevelData = nextLevel ? levelConfig[nextLevel as keyof typeof levelConfig] : null;
  
  const pointsToNext = nextLevelData ? nextLevelData.minPoints - user.totalPoints : 0;
  const progressToNext = nextLevelData ? ((user.totalPoints - levelData.minPoints) / (nextLevelData.minPoints - levelData.minPoints)) * 100 : 100;

  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const purchaseChallenges = challenges.filter(c => c.type === 'purchase');

  const unlockedAchievements = user.achievements.filter(a => a.unlocked);
  const lockedAchievements = user.achievements.filter(a => !a.unlocked);

  const handleRedeem = (_rewardId: number) => {
    console.log('Reward ID:', _rewardId);
    alert('¡Premio canjeado exitosamente!');
  };

  return (
    <div className="page-container retos-page">
      {/* Hero Banner */}
      <div className="club-hero" style={{ '--level-gradient': levelData.gradient } as React.CSSProperties}>
        <div className="club-hero-content">
          <div className="club-level-badge">
            <span className="level-icon">{levelData.icon}</span>
            <span className="level-name">{currentLevel}</span>
          </div>
          <h1>MF ELITE</h1>
          <p className="club-tagline">Excellence in health and exclusive benefits</p>
          
          <div className="club-stats">
            <div className="stat-box">
              <span className="stat-value">{user.totalPoints.toLocaleString()}</span>
              <span className="stat-label">Puntos Totales</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{user.streak}</span>
              <span className="stat-label">Días de Racha</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{unlockedAchievements.length}</span>
              <span className="stat-label">Logros</span>
            </div>
          </div>
        </div>
        
        {nextLevelData && (
          <div className="next-level-card">
            <div className="next-level-header">
              <Crown size={18} />
              <span>Siguiente nivel: {nextLevel}</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressToNext}%` }}></div>
              </div>
              <span className="progress-text">{pointsToNext} puntos para {nextLevel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="club-tabs">
        <button 
          className={`tab-btn ${activeTab === 'desafios' ? 'active' : ''}`}
          onClick={() => setActiveTab('desafios')}
        >
          <Target size={18} />
          Desafíos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'canjes' ? 'active' : ''}`}
          onClick={() => setActiveTab('canjes')}
        >
          <GiftIcon size={18} />
          Canjea tus Puntos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'niveles' ? 'active' : ''}`}
          onClick={() => setActiveTab('niveles')}
        >
          <Crown size={18} />
          Niveles y Beneficios
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'desafios' && (
        <div className="tab-content">
          {/* Purchase Challenges */}
          <section className="challenges-section">
            <div className="section-header">
              <h2><Target size={20} /> Retos por Compra</h2>
            </div>
            <div className="challenges-grid">
              {purchaseChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} onComplete={completeChallenge} />
              ))}
            </div>
          </section>

          {/* Daily Challenges */}
          <section className="challenges-section">
            <div className="section-header">
              <h2><Clock size={20} /> Retos Diarios</h2>
              <span className="expires-tag">¡Vence hoy!</span>
            </div>
            <div className="challenges-grid">
              {dailyChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} onComplete={completeChallenge} />
              ))}
            </div>
          </section>

          {/* Weekly Challenges */}
          <section className="challenges-section">
            <div className="section-header">
              <h2><Award size={20} /> Retos Semanales</h2>
            </div>
            <div className="challenges-list">
              {weeklyChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} onComplete={completeChallenge} horizontal />
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section className="challenges-section">
            <div className="section-header">
              <h2><Trophy size={20} /> Tus Logros</h2>
            </div>
            <div className="achievements-grid">
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="achievement-card unlocked">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                  </div>
                  <CheckCircle size={20} className="unlocked-check" />
                </div>
              ))}
              {lockedAchievements.map(achievement => (
                <div key={achievement.id} className="achievement-card locked">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="achievement-progress">
                        <div className="mini-progress">
                          <div className="mini-progress-fill" style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}></div>
                        </div>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'canjes' && (
        <div className="tab-content">
          <section className="rewards-section">
            <div className="section-header">
              <h2><GiftIcon size={20} /> Canjea tus Puntos</h2>
              <span className="points-balance">Tienes <strong>{user.totalPoints}</strong> puntos</span>
            </div>
            <div className="rewards-grid">
              {rewards.map(reward => (
                <div key={reward.id} className="reward-card">
                  <span className="reward-icon">{reward.icon}</span>
                  <div className="reward-details">
                    <h4>{reward.name}</h4>
                    <p>{reward.description}</p>
                  </div>
                  <button 
                    className={`redeem-btn ${user.totalPoints >= reward.points ? '' : 'disabled'}`}
                    onClick={() => handleRedeem(reward.id)}
                    disabled={user.totalPoints < reward.points}
                  >
                    {reward.points} pts
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'niveles' && (
        <div className="tab-content">
          <section className="levels-section">
            <div className="section-header">
              <h2><Crown size={20} /> Niveles y Beneficios</h2>
            </div>
            
            <div className="levels-showcase">
              {Object.entries(levelConfig).map(([level, data]) => (
                <div 
                  key={level} 
                  className={`level-card ${currentLevel === level ? 'current' : ''} ${levelConfig[currentLevel as keyof typeof levelConfig].minPoints < data.minPoints ? 'locked' : ''}`}
                >
                  <div className="level-header" style={{ background: data.gradient }}>
                    <span className="level-icon-large">{data.icon}</span>
                    <h3>{level}</h3>
                    {currentLevel === level && <span className="current-badge">Tu nivel</span>}
                  </div>
                  <div className="level-benefits">
                    <ul>
                      {benefitsByLevel[level as keyof typeof benefitsByLevel].map((benefit, i) => (
                        <li key={i}>
                          <CheckCircle size={14} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="level-requirement">
                    <span>Desde {data.minPoints.toLocaleString()} puntos</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge, onComplete, horizontal = false }: { 
  challenge: Challenge; 
  onComplete: (id: string) => void;
  horizontal?: boolean;
}) {
  const progress = Math.min((challenge.progress / challenge.target) * 100, 100);

  if (horizontal) {
    return (
      <div className={`challenge-card horizontal ${challenge.completed ? 'completed' : ''}`}>
        <span className="challenge-icon">{typeIcons[challenge.type]}</span>
        <div className="challenge-content">
          <h4>{challenge.title}</h4>
          <p>{challenge.description}</p>
          {challenge.reward && <span className="reward-badge">🎁 {challenge.reward}</span>}
        </div>
        <div className="challenge-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{challenge.progress}/{challenge.target}</span>
        </div>
        <div className="challenge-action">
          <span className="points-value">+{challenge.points} pts</span>
          {challenge.completed ? (
            <CheckCircle size={24} className="completed-icon" />
          ) : (
            <button onClick={() => onComplete(challenge.id)} className="complete-btn">
              Completar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`challenge-card ${challenge.completed ? 'completed' : ''}`}>
      <div className="challenge-top">
        <span className="challenge-icon">{typeIcons[challenge.type]}</span>
        <span className="points-badge">+{challenge.points} pts</span>
      </div>
      <h4>{challenge.title}</h4>
      <p>{challenge.description}</p>
      <div className="challenge-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span>{challenge.progress}/{challenge.target}</span>
      </div>
      {challenge.completed && (
        <div className="completed-overlay">
          <CheckCircle size={24} />
          <span>Completado</span>
        </div>
      )}
    </div>
  );
}
