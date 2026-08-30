import { mkdir, writeFile } from 'node:fs/promises'

const feeds = [
  {
    id: 'nida-podcast',
    url: 'https://feed.xyzfm.space/xlgejk3wbj8q',
  },
]

const outputDirectory = new URL('../public/feeds/', import.meta.url)
await mkdir(outputDirectory, { recursive: true })

for (const feed of feeds) {
  const response = await fetch(feed.url, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  })

  if (!response.ok) {
    throw new Error(`Failed to sync ${feed.id}: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  const episodeCount = (xml.match(/<item(?:\s|>)/gi) ?? []).length
  if (!/<rss(?:\s|>)/i.test(xml) || episodeCount === 0) {
    throw new Error(`Failed to sync ${feed.id}: response is not a valid RSS feed`)
  }

  await writeFile(new URL(`${feed.id}.xml`, outputDirectory), xml, 'utf8')
  console.log(`Synced ${feed.id}: ${episodeCount} episodes`)
}
