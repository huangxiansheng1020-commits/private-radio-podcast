import type { AudioSource, PodcastFeed } from './types'

export const podcastFeeds: PodcastFeed[] = [
  {
    id: 'nida-podcast',
    title: '霓达播客',
    feedUrl: `${import.meta.env.BASE_URL}feeds/nida-podcast.xml`,
    description: '把值得慢慢听的故事，留给一个安静的晚上。',
    status: 'loading',
  },
  {
    id: 'whats-next',
    title: "What's Next｜科技早知道",
    feedUrl: `${import.meta.env.BASE_URL}feeds/whats-next.xml`,
    description: '关注人工智能、机器人、芯片与科技商业趋势。',
    status: 'loading',
  },
  {
    id: 'sv101',
    title: '硅谷101',
    feedUrl: `${import.meta.env.BASE_URL}feeds/sv101.xml`,
    description: '从技术、知识与思想出发，理解正在发生的科技变化。',
    status: 'loading',
  },
  {
    id: 'latetalk',
    title: '晚点聊 LateTalk',
    feedUrl: `${import.meta.env.BASE_URL}feeds/latetalk.xml`,
    description: '深入聊聊中国科技公司、AI、创业与商业判断。',
    status: 'loading',
  },
  {
    id: 'blackcat',
    title: '黑猫侦探社',
    feedUrl: `${import.meta.env.BASE_URL}feeds/blackcat.xml`,
    description: '真实案件、调查叙事，以及案件背后的人性。',
    status: 'loading',
  },
  {
    id: 'tsp-strange-profile',
    title: 'TSP怪奇档案',
    feedUrl: `${import.meta.env.BASE_URL}feeds/tsp-strange-profile.xml`,
    description: '科幻、野史、神话、都市传说与奇怪事件。',
    status: 'loading',
  },
  {
    id: 'luo-crossroads',
    title: '罗永浩的十字路口',
    feedUrl: `${import.meta.env.BASE_URL}feeds/luo-crossroads.xml`,
    description: '罗永浩与科技、商业和人文领域人物展开的三到五小时深度对谈。',
    status: 'loading',
  },
]

// 电台是配置驱动的。将来只需在这里增加条目，不需要改播放器。
export const stations: AudioSource[] = [
  {
    id: 'wuhan-traffic',
    type: 'live',
    title: '武汉交通广播',
    subtitle: '一路同行，知晓每一程',
    frequency: 'FM 89.6',
    stationCategory: '交通',
    // 蜻蜓 FM 当前提供的 HTTPS HLS 播放列表，iPhone Safari 可直接播放。
    audioUrl: 'https://ls.qingting.fm/live/4665.m3u8',
    source: '湖北 · 武汉',
  },
  {
    id: 'hubei-traffic',
    type: 'live',
    title: '湖北楚天交通广播',
    subtitle: '最爱927，陪你一路同行',
    frequency: 'FM 92.7',
    stationCategory: '交通',
    // 湖北楚天交通广播当前的 HTTPS HLS 播放列表。
    audioUrl: 'https://satellitepull.cnr.cn/live/wx32hubctjtgb/playlist.m3u8',
    source: '湖北 · 武汉',
  },
  {
    id: 'hubei-voice',
    type: 'live',
    title: '湖北之声',
    subtitle: '听见湖北，连接生活',
    frequency: 'FM 104.6',
    stationCategory: '综合',
    // CNR 当前提供的 HTTPS HLS 播放列表。
    audioUrl: 'https://satellitepull.cnr.cn/live/wx32hubzsgb/playlist.m3u8',
    source: '湖北',
  },
  {
    id: 'bbc-radio',
    type: 'live',
    title: 'BBC Radio 4',
    subtitle: 'Stories, ideas and conversations',
    frequency: 'World Service',
    stationCategory: '国际',
    // BBC 面向国际访问的当前 HLS 入口；国内网络可用性取决于当地网络线路。
    audioUrl: 'https://as-hls-ww-live.akamaized.net/pool_55057080/live/ww/bbc_radio_fourfm/bbc_radio_fourfm.isml/bbc_radio_fourfm-audio=128000.norewind.m3u8',
    source: 'United Kingdom',
  },
]

// RSS 暂时无法读取时仍保留可浏览的产品骨架；加载真实 feed 后会替换这条示例数据。
export const fallbackEpisodes: AudioSource[] = [
  {
    id: 'nida-demo-episode',
    type: 'podcast',
    title: '在不确定的世界里，保留一点自己的节奏',
    subtitle: '霓达播客 · 第 201 期',
    source: '霓达播客',
    feedId: 'nida-podcast',
    publishedAt: '刚刚',
    duration: 0,
    audioUrl: '',
    description: '这一期，我们聊聊如何在信息很多、声音很杂的时候，给自己留出一点可以呼吸的空间。',
  },
]
