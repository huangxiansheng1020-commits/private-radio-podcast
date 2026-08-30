import { useEffect, useState } from 'react'
import { fetchPodcastFeed } from './podcast'
import { fallbackEpisodes, podcastFeeds, stations } from './data'
import { usePlayer } from './PlayerContext'
import type { AudioSource, PodcastFeed, SleepTimer } from './types'
import { ArrowIcon, BackIcon, ChevronIcon, ClockIcon, HeartIcon, HomeIcon, MicIcon, MoonIcon, MoreIcon, PauseIcon, PlayIcon, RefreshIcon, SettingsIcon, SparkIcon, UserIcon } from './icons'

type Tab = 'home' | 'podcast' | 'me'

const formatTime = (value: number) => {
  if (!value || !Number.isFinite(value)) return '00:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Cover({ source, size = 'medium', className = '' }: { source?: AudioSource | PodcastFeed | null; size?: 'small' | 'medium' | 'large'; className?: string }) {
  const title = source?.title || '声匣'
  const isPodcast = source && ('type' in source ? source.type === 'podcast' : true)
  return <div className={`cover cover-${size} ${isPodcast ? 'cover-podcast' : 'cover-radio'} ${className}`} style={source?.cover ? { backgroundImage: `url(${source.cover})` } : undefined} aria-label={`${title}封面`}>
    {!source?.cover && <><span className="cover-mark">{isPodcast ? '声' : 'FM'}</span><span className="cover-lines" /></>}
  </div>
}

function PlayButton({ source, size = 'normal' }: { source: AudioSource; size?: 'normal' | 'large' }) {
  const { currentSource, isPlaying, toggle } = usePlayer()
  const active = currentSource?.id === source.id
  return <button className={`play-button play-button-${size}`} onClick={() => toggle(source)} aria-label={active && isPlaying ? `暂停${source.title}` : `播放${source.title}`}>
    {active && isPlaying ? <PauseIcon size={size === 'large' ? 22 : 16} /> : <PlayIcon size={size === 'large' ? 22 : 16} />}
  </button>
}

function MiniPlayer({ onOpen }: { onOpen: () => void }) {
  const { currentSource, isPlaying, toggle } = usePlayer()
  if (!currentSource) return null
  return <div className="mini-player" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen()}>
    <Cover source={currentSource} size="small" />
    <div className="mini-copy"><strong>{currentSource.title}</strong><span>{currentSource.subtitle || currentSource.source}</span></div>
    <button className="mini-toggle" onClick={(event) => { event.stopPropagation(); toggle(currentSource) }} aria-label={isPlaying ? '暂停' : '播放'}>{isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}</button>
    <ChevronIcon size={18} />
  </div>
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  return <nav className="bottom-nav" aria-label="主导航">
    <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}><HomeIcon size={21} /><span>首页</span></button>
    <button className={tab === 'podcast' ? 'active' : ''} onClick={() => setTab('podcast')}><MicIcon size={21} /><span>播客</span></button>
    <button className={tab === 'me' ? 'active' : ''} onClick={() => setTab('me')}><UserIcon size={21} /><span>我的</span></button>
  </nav>
}

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return <div className="section-title"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action && <button className="text-button">{action}<ArrowIcon size={15} /></button>}</div>
}

function HomePage({ episodes, onOpenPlayer }: { episodes: AudioSource[]; onOpenPlayer: (source?: AudioSource) => void }) {
  const { currentSource, currentTime, isPlaying, toggle } = usePlayer()
  const featured = currentSource?.type === 'podcast' ? currentSource : episodes[0]
  const continuePlaying = currentSource || featured
  return <main className="page home-page">
    <header className="topbar"><div className="brand"><span className="brand-dot" />声匣</div><button className="icon-button" aria-label="更多"><MoreIcon size={22} /></button></header>
    <section className="hero-copy"><span className="eyebrow">SATURDAY · 08.29</span><h1>把声音，<br /><em>留给自己。</em></h1><p>今天想听点什么？从上次停下的地方继续。</p></section>

    <section className="continue-card" onClick={() => onOpenPlayer(continuePlaying)}>
      <div className="card-label"><span><SparkIcon size={14} /> 继续收听</span><span className="card-kicker">{currentSource ? '上次播放' : '为你准备'}</span></div>
      <div className="continue-main"><Cover source={continuePlaying} size="medium" /><div className="continue-info"><span className="source-label">{continuePlaying?.source || '霓达播客'}</span><h3>{continuePlaying?.title || '选择一个声音开始'}</h3><div className="continue-meta"><span>{currentSource?.type === 'live' ? '正在直播' : `${formatTime(currentTime)} / ${formatTime(currentSource?.duration || featured?.duration || 0)}`}</span><button className="round-play" onClick={(event) => { event.stopPropagation(); continuePlaying && toggle(continuePlaying) }}>{isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}</button></div></div></div>
      <div className="progress-track"><span style={{ width: `${currentSource?.type === 'podcast' && currentSource.duration ? Math.min(100, currentTime / currentSource.duration * 100) : 18}%` }} /></div>
    </section>

    <section className="content-section"><SectionTitle eyebrow="YOUR STATIONS" title="常听广播" action="全部" /><div className="station-list">{stations.map((station, index) => <div className="station-row" key={station.id}><div className={`station-avatar station-${index}`}><span>{index === 0 ? '交' : index === 1 ? '声' : 'R4'}</span></div><div className="station-copy"><strong>{station.title}</strong><span>{station.frequency} · {station.stationCategory}</span></div><PlayButton source={station} /></div>)}</div></section>

    <section className="content-section updates-section"><SectionTitle eyebrow="FROM YOUR PODCASTS" title="最近更新" action="查看全部" /><div className="episode-stack">{episodes.slice(0, 3).map((episode) => <article className="episode-row" key={episode.id} onClick={() => onOpenPlayer(episode)}><Cover source={episode} size="small" /><div className="episode-copy"><span className="source-label">{episode.source}</span><strong>{episode.title}</strong><span className="episode-date">{episode.publishedAt || '最近更新'}{episode.duration ? ` · ${formatTime(episode.duration)}` : ''}</span></div><PlayButton source={episode} /></article>)}</div></section>
  </main>
}

function PodcastPage({ feed, episodes, onOpenPlayer, onRefresh }: { feed: PodcastFeed; episodes: AudioSource[]; onOpenPlayer: (source?: AudioSource) => void; onRefresh: () => Promise<void> }) {
  const [refreshing, setRefreshing] = useState(false)
  const reload = async () => {
    setRefreshing(true)
    try { await onRefresh() } finally { setRefreshing(false) }
  }
  return <main className="page"><header className="page-header"><div><span className="eyebrow">LIBRARY</span><h1>我的播客</h1></div><button className="icon-button" onClick={reload} aria-label="刷新"><RefreshIcon size={20} /></button></header>
    <section className="podcast-hero"><Cover source={feed} size="large" /><div className="podcast-hero-copy"><span className="pill"><span className="live-dot" /> 已订阅</span><h2>{feed.title}</h2><p>{feed.description}</p><span className="muted">{feed.lastUpdated ? `更新于 ${feed.lastUpdated}` : '正在读取 RSS 更新'}</span></div></section>
    <section className="content-section podcast-episodes"><SectionTitle eyebrow="EPISODES" title="全部单集" action={refreshing ? '更新中' : '刷新'} /><div className="episode-list">{episodes.map((episode, index) => <article className="long-episode" key={episode.id} onClick={() => onOpenPlayer(episode)}><span className="episode-number">{String(index + 1).padStart(2, '0')}</span><div className="episode-copy"><strong>{episode.title}</strong><span>{episode.publishedAt || '最近'}{episode.duration ? ` · ${formatTime(episode.duration)}` : ''}</span></div><PlayButton source={episode} /></article>)}</div></section>
    <div className="feed-note"><MicIcon size={18} /><span>第一版使用配置好的 RSS 地址。之后增加播客，只需在 <code>src/data.ts</code> 添加 Feed。</span></div>
  </main>
}

function MePage() {
  const { playbackRate, setPlaybackRate, sleepTimer, setSleepTimer } = usePlayer()
  const options: SleepTimer[] = [0, 15, 30, 45, 60]
  return <main className="page"><header className="page-header"><div><span className="eyebrow">PERSONAL</span><h1>我的</h1></div><div className="profile-orb">S</div></header>
    <section className="me-intro"><div className="big-orb"><MicIcon size={30} /></div><div><h2>给自己留一点空白</h2><p>所有播放记录都保存在这台设备上。</p></div></section>
    <div className="settings-list"><button><span className="setting-icon peach"><HeartIcon size={19} /></span><span>收藏广播</span><ChevronIcon size={17} /></button><button><span className="setting-icon lavender"><MicIcon size={19} /></span><span>我的播客</span><ChevronIcon size={17} /></button><button><span className="setting-icon blue"><ClockIcon size={19} /></span><span>播放历史</span><ChevronIcon size={17} /></button></div>
    <section className="preferences"><SectionTitle eyebrow="PREFERENCES" title="播放设置" /><div className="preference-row"><div><strong>默认播放速度</strong><span>播客的默认速度</span></div><div className="segmented">{[1, 1.25, 1.5, 2].map((rate) => <button className={playbackRate === rate ? 'selected' : ''} key={rate} onClick={() => setPlaybackRate(rate)}>{rate}x</button>)}</div></div><div className="preference-row"><div><strong>睡眠定时</strong><span>{sleepTimer ? `${sleepTimer} 分钟后停止` : '播放一段时间后自动停止'}</span></div><div className="timer-options">{options.map((minutes) => <button className={sleepTimer === minutes ? 'selected' : ''} key={minutes} onClick={() => setSleepTimer(minutes)}>{minutes === 0 ? '关' : `${minutes}′`}</button>)}</div></div></section>
    <section className="settings-footer"><SettingsIcon size={17} /><span>声匣 0.1.0 · 本地优先</span></section>
  </main>
}

function FullPlayer({ source, onClose }: { source: AudioSource; onClose: () => void }) {
  const { isPlaying, currentTime, duration, toggle, seek, playbackRate, setPlaybackRate, sleepTimer, setSleepTimer } = usePlayer()
  const [showSpeed, setShowSpeed] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const percent = duration ? Math.min(100, currentTime / duration * 100) : 0
  return <div className="player-screen"><div className="player-topbar"><button className="icon-button light" onClick={onClose} aria-label="关闭播放器"><BackIcon size={23} /></button><span>{source.type === 'live' ? '正在播放' : '播客单集'}</span><button className="icon-button light"><MoreIcon size={22} /></button></div><div className="player-art"><Cover source={source} size="large" /></div><div className="player-heading"><span className="player-source">{source.source || source.title}</span><h1>{source.title}</h1>{source.type === 'live' && <span className="live-badge"><span className="live-dot" /> LIVE · {source.frequency}</span>}</div>{source.type === 'podcast' && <div className="scrubber"><input type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} onChange={(event) => { const value = Number(event.target.value); seek(value - currentTime) }} /><div><span>{formatTime(currentTime)}</span><span>{formatTime(duration || source.duration || 0)}</span></div></div>}<div className="player-controls">{source.type === 'podcast' && <button onClick={() => seek(-15)}><span>↶</span><small>15</small></button>}<button className="main-play" onClick={() => toggle(source)}>{isPlaying ? <PauseIcon size={25} /> : <PlayIcon size={25} />}</button>{source.type === 'podcast' && <button onClick={() => seek(30)}><span>↷</span><small>30</small></button>}</div><div className="player-actions"><div className="popover-wrap"><button className="player-action" onClick={() => setShowSpeed(!showSpeed)}><span>{playbackRate}x</span><small>速度</small></button>{showSpeed && <div className="popover speed-popover">{[1, 1.25, 1.5, 2].map((rate) => <button className={playbackRate === rate ? 'selected' : ''} onClick={() => { setPlaybackRate(rate); setShowSpeed(false) }} key={rate}>{rate}x</button>)}</div>}</div><button className="player-action"><HeartIcon size={20} /><small>收藏</small></button><div className="popover-wrap"><button className="player-action" onClick={() => setShowTimer(!showTimer)}><MoonIcon size={20} /><small>{sleepTimer ? `${sleepTimer}′` : '定时'}</small></button>{showTimer && <div className="popover timer-popover">{([0, 15, 30, 45, 60] as SleepTimer[]).map((minutes) => <button className={sleepTimer === minutes ? 'selected' : ''} onClick={() => { setSleepTimer(minutes); setShowTimer(false) }} key={minutes}>{minutes ? `${minutes} 分钟` : '关闭定时'}</button>)}</div>}</div></div>{source.type === 'live' && <div className="live-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>}</div>
}

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [playerOpen, setPlayerOpen] = useState(false)
  const [feed, setFeed] = useState<PodcastFeed>(podcastFeeds[0])
  const [episodes, setEpisodes] = useState<AudioSource[]>(fallbackEpisodes)
  const { currentSource, toggle } = usePlayer()

  const refreshFeed = async () => {
    try {
      const { feed: nextFeed, episodes: nextEpisodes } = await fetchPodcastFeed(feed)
      setFeed(nextFeed)
      if (nextEpisodes.length) setEpisodes(nextEpisodes)
    } catch {
      setFeed((previous) => ({ ...previous, status: 'error' }))
    }
  }

  useEffect(() => { void refreshFeed() }, [])

  const openPlayer = (source?: AudioSource) => {
    if (source) toggle(source)
    setPlayerOpen(true)
  }

  return <div className="app-shell">
    {tab === 'home' && <HomePage episodes={episodes} onOpenPlayer={openPlayer} />}
    {tab === 'podcast' && <PodcastPage feed={feed} episodes={episodes} onOpenPlayer={openPlayer} onRefresh={refreshFeed} />}
    {tab === 'me' && <MePage />}
    <MiniPlayer onOpen={() => setPlayerOpen(true)} />
    <BottomNav tab={tab} setTab={setTab} />
    {playerOpen && currentSource && <FullPlayer source={currentSource} onClose={() => setPlayerOpen(false)} />}
  </div>
}

export default App
