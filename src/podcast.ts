import type { AudioSource, PodcastFeed } from './types'

const text = (node: Element | null, selector: string) => node?.querySelector(selector)?.textContent?.trim() ?? ''

const formatPublishedAt = (raw: string) => {
  if (!raw) return '最近更新'
  const date = new Date(raw)
  if (Number.isNaN(date.valueOf())) return raw
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(date)
}

export async function fetchPodcastFeed(feed: PodcastFeed): Promise<{ feed: PodcastFeed; episodes: AudioSource[] }> {
  const response = await fetch(feed.feedUrl, {
    cache: 'no-store',
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  })
  if (!response.ok) throw new Error(`RSS request failed: ${response.status}`)

  const xml = new DOMParser().parseFromString(await response.text(), 'application/xml')
  if (xml.querySelector('parsererror')) throw new Error('RSS parse failed')

  const channel = xml.querySelector('channel')
  const feedTitle = text(channel, 'title') || feed.title
  const cover = channel?.querySelector('image > url')?.textContent?.trim()
    || channel?.querySelector('itunes\\:image')?.getAttribute('href')
    || undefined
  const episodes = [...xml.querySelectorAll('item')].map((item, index): AudioSource => {
    const enclosure = item.querySelector('enclosure')
    const itemCover = item.querySelector('itunes\\:image')?.getAttribute('href') || cover || undefined
    const rawDuration = text(item, 'itunes\\:duration')
    const durationParts = rawDuration.split(':').map(Number)
    const duration = durationParts.length === 3
      ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
      : durationParts.length === 2 ? durationParts[0] * 60 + durationParts[1] : Number(rawDuration) || undefined

    return {
      id: `${feed.id}-${text(item, 'guid') || index}`,
      type: 'podcast',
      title: text(item, 'title') || '未命名单集',
      subtitle: feedTitle,
      source: feedTitle,
      feedId: feed.id,
      cover: itemCover,
      audioUrl: enclosure?.getAttribute('url') || '',
      duration,
      publishedAt: formatPublishedAt(text(item, 'pubDate')),
      description: text(item, 'description'),
    }
  }).filter((episode) => episode.audioUrl)

  return {
    feed: { ...feed, title: feedTitle, cover, status: 'ready', lastUpdated: '刚刚' },
    episodes,
  }
}
