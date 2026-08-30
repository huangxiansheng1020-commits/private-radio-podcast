export type AudioSourceType = 'live' | 'podcast'

export type AudioSource = {
  id: string
  type: AudioSourceType
  title: string
  subtitle?: string
  cover?: string
  audioUrl: string
  duration?: number
  source?: string
  description?: string
  publishedAt?: string
  publishedTimestamp?: number
  frequency?: string
  stationCategory?: string
  feedId?: string
}

export type PodcastFeed = {
  id: string
  title: string
  feedUrl: string
  cover?: string
  description?: string
  lastUpdated?: string
  status?: 'ready' | 'loading' | 'error'
}

export type PlaybackSnapshot = {
  source: AudioSource
  position: number
  savedAt: number
}

export type SleepTimer = 0 | 15 | 30 | 45 | 60
