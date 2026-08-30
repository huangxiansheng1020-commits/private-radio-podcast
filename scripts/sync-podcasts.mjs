import { mkdir, writeFile } from 'node:fs/promises'

const feeds = [
  {
    id: 'nida-podcast',
    url: 'https://feed.xyzfm.space/xlgejk3wbj8q',
  },
  {
    id: 'whats-next',
    url: 'https://feeds.fireside.fm/guiguzaozhidao/rss',
  },
  {
    id: 'sv101',
    url: 'https://feeds.fireside.fm/sv101/rss',
  },
  {
    id: 'latetalk',
    url: 'https://podcast.latepost.com/rss',
  },
  {
    id: 'blackcat',
    url: 'https://feeds.heymeowfm.com/heymeow.xml',
  },
  {
    id: 'tsp-strange-profile',
    url: 'https://www.ximalaya.com/album/19206387.xml',
  },
]

const outputDirectory = new URL('../public/feeds/', import.meta.url)
await mkdir(outputDirectory, { recursive: true })

for (const feed of feeds) {
  try {
    const response = await fetch(feed.url, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const episodeCount = (xml.match(/<item(?:\s|>)/gi) ?? []).length
    if (!/<rss(?:\s|>)/i.test(xml) || episodeCount === 0) {
      throw new Error('response is not a valid RSS feed')
    }

    await writeFile(new URL(`${feed.id}.xml`, outputDirectory), xml, 'utf8')
    console.log(`Synced ${feed.id}: ${episodeCount} episodes`)
  } catch (error) {
    console.warn(`Skipped ${feed.id}: ${error instanceof Error ? error.message : String(error)}`)
  }
}
