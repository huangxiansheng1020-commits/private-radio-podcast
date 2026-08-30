import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AudioSource, PlaybackSnapshot, SleepTimer } from './types'

type PlayerContextValue = {
  currentSource: AudioSource | null
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  sleepTimer: SleepTimer
  error: string | null
  play: (source?: AudioSource) => void
  pause: () => void
  toggle: (source?: AudioSource) => void
  seek: (seconds: number) => void
  setPlaybackRate: (rate: number) => void
  setSleepTimer: (minutes: SleepTimer) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)
const SNAPSHOT_KEY = 'shengxia-last-playback'
const PROGRESS_KEY = 'shengxia-playback-progress'

type SavedProgress = Record<string, { position: number; duration?: number; savedAt: number }>

const readSnapshot = (): PlaybackSnapshot | null => {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY)
    return raw ? JSON.parse(raw) as PlaybackSnapshot : null
  } catch { return null }
}

const readProgress = (): SavedProgress => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) as SavedProgress : {}
  } catch { return {} }
}

const resumePositionFor = (source: AudioSource, fallback = 0) => {
  if (source.type !== 'podcast') return 0
  const saved = readProgress()[source.id]
  const position = saved?.position ?? fallback
  const knownDuration = saved?.duration ?? source.duration
  if (!Number.isFinite(position) || position < 3) return 0
  if (knownDuration && knownDuration - position < 15) return 0
  return position
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const pendingSeekRef = useRef<number | null>(null)
  const [currentSource, setCurrentSource] = useState<AudioSource | null>(() => readSnapshot()?.source ?? null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => readSnapshot()?.position ?? 0)
  const [duration, setDuration] = useState(() => readSnapshot()?.source.duration ?? 0)
  const [playbackRate, setPlaybackRateState] = useState(() => Number(localStorage.getItem('shengxia-playback-rate')) || 1)
  const [sleepTimer, setSleepTimerState] = useState<SleepTimer>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.playbackRate = playbackRate
    audioRef.current = audio
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => {
      const mediaDuration = Number.isFinite(audio.duration) ? audio.duration : 0
      setDuration(mediaDuration)
      const pendingPosition = pendingSeekRef.current
      if (pendingPosition !== null) {
        const target = mediaDuration ? Math.min(pendingPosition, Math.max(0, mediaDuration - 0.25)) : pendingPosition
        try {
          audio.currentTime = target
          setCurrentTime(target)
        } catch {
          setCurrentTime(pendingPosition)
        }
        pendingSeekRef.current = null
      }
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0) }
    const onError = () => { setIsPlaying(false); setError('这个音源暂时无法播放，请检查网络或流地址。') }
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    if (!currentSource) return
    const position = currentSource.type === 'podcast' ? currentTime : 0
    const snapshotSource = currentSource.type === 'podcast' && duration
      ? { ...currentSource, duration }
      : currentSource
    const snapshot: PlaybackSnapshot = { source: snapshotSource, position, savedAt: Date.now() }
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))
    if (currentSource.type === 'podcast') {
      const progress = readProgress()
      progress[currentSource.id] = { position, duration: duration || currentSource.duration, savedAt: Date.now() }
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    }
  }, [currentSource, currentTime, duration])

  useEffect(() => {
    if ('mediaSession' in navigator && currentSource) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSource.title,
        artist: currentSource.subtitle || currentSource.source || '',
        album: currentSource.source || '声匣',
        artwork: currentSource.cover ? [{ src: currentSource.cover }] : [],
      })
      navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play())
      navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause())
      if (currentSource.type === 'podcast') {
        navigator.mediaSession.setActionHandler('seekbackward', () => seek(-15))
        navigator.mediaSession.setActionHandler('seekforward', () => seek(30))
      }
    }
  }, [currentSource])

  const play = useCallback((source?: AudioSource) => {
    const audio = audioRef.current
    if (!audio) return
    setError(null)
    const targetSource = source ?? currentSource
    if (!targetSource?.audioUrl) {
      setError('这个示例音源还没有配置播放地址。你可以在 src/data.ts 中填入 streamUrl。')
      return
    }

    const sourceChanged = targetSource.id !== currentSource?.id
    const needsLoading = audio.getAttribute('src') !== targetSource.audioUrl
    const snapshot = readSnapshot()
    const fallbackPosition = snapshot?.source.id === targetSource.id ? snapshot.position : currentTime
    const resumePosition = resumePositionFor(targetSource, sourceChanged ? 0 : fallbackPosition)

    if (source && source !== currentSource) setCurrentSource(source)
    if (sourceChanged || needsLoading) {
      setDuration(targetSource.duration ?? 0)
      setCurrentTime(resumePosition)
    }
    if (needsLoading) {
      pendingSeekRef.current = resumePosition
      audio.src = targetSource.audioUrl
      audio.load()
      if (audio.readyState >= 1 && resumePosition > 0) {
        try {
          audio.currentTime = resumePosition
          pendingSeekRef.current = null
        } catch { /* Safari 会在 loadedmetadata 后再次恢复 */ }
      }
    }
    void audio.play().catch(() => setError('播放被浏览器拦截，请再次点击播放。'))
  }, [currentSource, currentTime])

  const pause = useCallback(() => { audioRef.current?.pause() }, [])

  const toggle = useCallback((source?: AudioSource) => {
    if (source && source.id !== currentSource?.id) play(source)
    else if (isPlaying) pause()
    else play(source)
  }, [currentSource, isPlaying, pause, play])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration || duration || Infinity, audio.currentTime + seconds))
    setCurrentTime(audio.currentTime)
  }, [duration])

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate)
    localStorage.setItem('shengxia-playback-rate', String(rate))
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [])

  const setSleepTimer = useCallback((minutes: SleepTimer) => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setSleepTimerState(minutes)
    if (minutes > 0) {
      timerRef.current = window.setTimeout(() => {
        audioRef.current?.pause()
        setSleepTimerState(0)
      }, minutes * 60 * 1000)
    }
  }, [])

  const value = useMemo(() => ({ currentSource, isPlaying, currentTime, duration, playbackRate, sleepTimer, error, play, pause, toggle, seek, setPlaybackRate, setSleepTimer }), [currentSource, isPlaying, currentTime, duration, playbackRate, sleepTimer, error, play, pause, toggle, seek, setPlaybackRate, setSleepTimer])
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const value = useContext(PlayerContext)
  if (!value) throw new Error('usePlayer must be used within PlayerProvider')
  return value
}
