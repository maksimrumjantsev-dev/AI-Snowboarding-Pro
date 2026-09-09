import { useMemo, useState } from 'react';
import { Activity, BarChart3, Home, PlayCircle, User, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

type Tab = 'home' | 'analysis' | 'history' | 'profile';

const scores = [
  ['Стойка', 82],
  ['Баланс', 74],
  ['Повороты', 68],
  ['Контроль скорости', 79],
] as const;

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [video, setVideo] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const preview = useMemo(() => (video ? URL.createObjectURL(video) : ''), [video]);

  const startAnalysis = () => {
    setAnalyzing(true);
    setDone(false);
    setProgress(12);
    const steps = [34, 58, 81, 100];
    steps.forEach((p, i) => setTimeout(() => {
      setProgress(p);
      if (p === 100) {
        setTimeout(() => {
          setAnalyzing(false);
          setDone(true);
        }, 350);
      }
    }, 700 * (i + 1)));
  };

  return (
    <div className="app-shell">
      <main className="content">
        {tab === 'home' && (
          <section>
            <div className="eyebrow">AI SNOW COACH</div>
            <h1>Готов к следующему спуску?</h1>
            <p className="muted">Загрузи видео — получи разбор техники, ошибки и упражнения.</p>

            <button className="hero-button" onClick={() => setTab('analysis')}>
              <Upload size={20} /> Загрузить видео
            </button>

            <div className="score-card">
              <div>
                <span className="label">Последняя тренировка</span>
                <h2>AI Score 76</h2>
                <p className="muted small">Повороты · сегодня</p>
              </div>
              <div className="score-ring">76</div>
            </div>

            <div className="grid-2">
              {scores.map(([name, value]) => (
                <div className="metric-card" key={name}>
                  <div className="metric-top"><span>{name}</span><strong>{value}</strong></div>
                  <div className="bar"><span style={{ width: `${value}%` }} /></div>
                </div>
              ))}
            </div>

            <button className="secondary" onClick={() => { setTab('analysis'); setDone(true); }}>
              Посмотреть рекомендации
            </button>
          </section>
        )}

        {tab === 'analysis' && (
          <section>
            <div className="eyebrow">АНАЛИЗ ТЕХНИКИ</div>
            <h1>Загрузка тренировки</h1>

            {!done && (
              <>
                <label className="upload-zone">
                  <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
                  {video ? (
                    <div className="video-wrap">
                      <video src={preview} controls playsInline />
                      <strong>{video.name}</strong>
                    </div>
                  ) : (
                    <div><Upload size={28} /><strong>Выбрать видео</strong><span>MP4, MOV или WEBM</span></div>
                  )}
                </label>

                <div className="form-grid">
                  <label><span>Уровень</span><select><option>Новичок</option><option>Средний</option><option>Продвинутый</option></select></label>
                  <label><span>Тип тренировки</span><select><option>Базовая стойка</option><option>Повороты</option><option>Карвинг</option><option>Фристайл</option></select></label>
                </div>

                <button className="hero-button" disabled={!video || analyzing} onClick={startAnalysis}>
                  <PlayCircle size={20} /> {analyzing ? 'Анализируем…' : 'Начать AI-анализ'}
                </button>

                {analyzing && (
                  <div className="progress-card">
                    <div className="metric-top"><span>Прогресс</span><strong>{progress}%</strong></div>
                    <div className="bar big"><span style={{ width: `${progress}%` }} /></div>
                    <div className="steps">
                      {['Подготовка видео','Поиск ключевых моментов','Анализ техники','Формирование рекомендаций'].map((s, i) => (
                        <span key={s} className={progress >= [20,45,70,95][i] ? 'active-step' : ''}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {done && <Result onNew={() => { setDone(false); setVideo(null); setProgress(0); }} />}
          </section>
        )}

        {tab === 'history' && (
          <section>
            <div className="eyebrow">ПРОГРЕСС</div>
            <h1>История тренировок</h1>
            <div className="trend-card">
              {[61,65,69,72,76].map((v, i) => <div key={i} className="trend-col"><span style={{ height: `${v}%` }} /><small>{v}</small></div>)}
            </div>
            {[['Сегодня','Повороты',76],['7 сентября','Базовая стойка',72],['4 сентября','Карвинг',69]].map(([d,t,s]) => (
              <button className="history-row" key={String(d)} onClick={() => { setTab('analysis'); setDone(true); }}>
                <div><strong>{t}</strong><span>{d}</span></div><b>{s}</b>
              </button>
            ))}
          </section>
        )}

        {tab === 'profile' && (
          <section>
            <div className="eyebrow">ПРОФИЛЬ</div>
            <h1>Мой райдинг</h1>
            <div className="profile-card">
              <div className="avatar">M</div>
              <div><h2>Максим</h2><p className="muted">Средний уровень · Regular</p></div>
            </div>
            <div className="goal-card"><strong>Цели</strong><div className="chips"><span>Уверенные повороты</span><span>Карвинг</span><span>Скорость</span><span>Фристайл</span></div></div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <NavButton active={tab === 'home'} icon={<Home size={20}/>} text="Главная" onClick={() => setTab('home')} />
        <NavButton active={tab === 'analysis'} icon={<Activity size={20}/>} text="Анализ" onClick={() => setTab('analysis')} />
        <NavButton active={tab === 'history'} icon={<BarChart3 size={20}/>} text="История" onClick={() => setTab('history')} />
        <NavButton active={tab === 'profile'} icon={<User size={20}/>} text="Профиль" onClick={() => setTab('profile')} />
      </nav>
    </div>
  );
}

function Result({ onNew }: { onNew: () => void }) {
  return (
    <div className="result">
      <div className="score-card large"><div><span className="label">Итог анализа</span><h2>AI Score 76</h2><p className="muted small">Хорошая база. Главный резерв — начало поворота.</p></div><div className="score-ring">76</div></div>
      <div className="grid-2">{scores.map(([name, value]) => <div className="metric-card" key={name}><div className="metric-top"><span>{name}</span><strong>{value}</strong></div><div className="bar"><span style={{width:`${value}%`}}/></div></div>)}</div>
      <div className="feedback good"><CheckCircle2/><div><strong>Что получается хорошо</strong><p>Стабильная стойка и уверенный контроль скорости на выходе из дуги.</p></div></div>
      <div className="feedback warn"><AlertTriangle/><div><strong>Что нужно исправить</strong><p>Слишком много веса остаётся на задней ноге в начале поворота.</p></div></div>
      {[['Высокий','Вес на задней ноге','Переноси таз ближе к центру доски и начинай поворот обеими ногами.'],['Средний','Руки уходят назад','Держи руки перед корпусом и сохраняй спокойные плечи.'],['Низкий','Поздний взгляд','Смотри заранее в направление следующей дуги.']].map(([p,t,d]) => <div className="issue-card" key={t}><span className="priority">{p}</span><strong>{t}</strong><p>{d}</p></div>)}
      <div className="goal-card"><strong>Упражнения на следующую тренировку</strong><ol><li>Повороты с акцентом на центральную стойку.</li><li>Медленные J-повороты на пологом склоне.</li><li>Серия из 6 связанных дуг с ранним взглядом.</li></ol></div>
      <div className="actions"><button className="secondary">Сохранить тренировку</button><button className="hero-button" onClick={onNew}>Новый анализ</button></div>
    </div>
  );
}

function NavButton({ active, icon, text, onClick }: { active: boolean; icon: React.ReactNode; text: string; onClick: () => void }) {
  return <button className={active ? 'nav-item active' : 'nav-item'} onClick={onClick}>{icon}<span>{text}</span></button>;
}
