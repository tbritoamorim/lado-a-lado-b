import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'

type Page = 'home' | 'my-library' | 'his-library' | 'recommendations' | 'our-collection' | 'collections' | 'stats'
type Album = {
  id: number
  title: string
  artist: string
  year: number
  genre: string
  cover: string
  coverLabel: string
  myRating?: number
  hisRating?: number
  mine: boolean
  his: boolean
  listenedByMe: boolean
  listenedByHim: boolean
  recommendedBy?: 'me' | 'him'
  note?: string
}

const matheusAvatar = 'data:image/jpeg;base64,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'

const thiagoAvatar = 'data:image/jpeg;base64,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'

const catalogLyrics = [
  { text: "Just 'cause you feel it doesn't mean it's there.", song: "Weird Fishes/Arpeggi", artist: "Radiohead" },
  { text: "When the sun hits.", song: "When the Sun Hits", artist: "Slowdive" },
  { text: "I wanna be forgotten.", song: "You Only Live Once", artist: "The Strokes" },
]

const initialAlbums: Album[] = [
  { id: 1, title: 'The New Abnormal', artist: 'The Strokes', year: 2020, genre: 'Indie rock', cover: 'cover-strokes', coverLabel: 'TNA', myRating: 5, hisRating: 4.5, mine: true, his: true, listenedByMe: true, listenedByHim: true, note: 'An album that keeps revealing new details.' },
  { id: 2, title: 'In Rainbows', artist: 'Radiohead', year: 2007, genre: 'Art rock', cover: 'cover-rainbows', coverLabel: 'IN\nRAINBOWS', myRating: 5, hisRating: 4.5, mine: true, his: true, listenedByMe: true, listenedByHim: true, note: 'Weird Fishes deserves its own little universe.' },
  { id: 3, title: 'Souvlaki', artist: 'Slowdive', year: 1993, genre: 'Shoegaze', cover: 'cover-souvlaki', coverLabel: 'SOUVLAKI', myRating: 4.5, mine: true, his: false, listenedByMe: true, listenedByHim: false },
  { id: 4, title: 'Romance', artist: 'Fontaines D.C.', year: 2024, genre: 'Post-punk', cover: 'cover-romance', coverLabel: 'ROMANCE', hisRating: 4.5, mine: false, his: true, listenedByMe: false, listenedByHim: true, recommendedBy: 'him' },
  { id: 5, title: 'Bloom', artist: 'Beach House', year: 2012, genre: 'Dream pop', cover: 'cover-bloom', coverLabel: 'BLOOM', myRating: 4.5, hisRating: 4, mine: true, his: true, listenedByMe: true, listenedByHim: true },
  { id: 6, title: 'Polygondwanaland', artist: 'King Gizzard & The Lizard Wizard', year: 2017, genre: 'Psychedelic rock', cover: 'cover-poly', coverLabel: 'POLYGON\nDWANALAND', myRating: 4, mine: true, his: false, listenedByMe: true, listenedByHim: false },
  { id: 7, title: 'D E A T H M E T A L', artist: 'Panchiko', year: 2000, genre: 'Indie rock', cover: 'cover-panchiko', coverLabel: 'D E A T H\nM E T A L', mine: false, his: true, listenedByMe: false, listenedByHim: true, recommendedBy: 'him' },
  { id: 8, title: 'Is This It', artist: 'The Strokes', year: 2001, genre: 'Garage rock', cover: 'cover-isthisit', coverLabel: 'IS THIS IT', myRating: 4.5, mine: true, his: false, listenedByMe: true, listenedByHim: false },
  { id: 9, title: 'Heaven or Las Vegas', artist: 'Cocteau Twins', year: 1990, genre: 'Dream pop', cover: 'cover-heaven', coverLabel: 'HEAVEN OR\nLAS VEGAS', mine: false, his: true, listenedByMe: false, listenedByHim: false, recommendedBy: 'him' },
]

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'my-library', label: 'My library', icon: 'library' },
  { id: 'his-library', label: 'His library', icon: 'user' },
  { id: 'recommendations', label: 'Recommendations', icon: 'send' },
  { id: 'our-collection', label: 'Our collection', icon: 'disc' },
]

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const shapes: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    library: <><path d="M4 4.5h15a1 1 0 0 1 1 1V20H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" /><path d="M7 8h9M7 12h9M7 16h5" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5" /></>,
    send: <><path d="m21 3-7.5 18-3.8-7.7L2 9.5 21 3Z" /><path d="M9.7 13.3 21 3" /></>,
    disc: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.2" /><path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    shuffle: <><path d="m16 3 5 5-5 5M4 7h3c5 0 5 10 10 10h4M16 16l5 5-5-5" /><path d="M4 17h3c1.5 0 2.5-1 3.4-2.5M14 7.5c.9-1.5 1.9-2.5 3-2.5h4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-7" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...common}>{shapes[name] ?? shapes.disc}</svg>
}

function Artwork({ album, large = false }: { album: Album; large?: boolean }) {
  return (
    <div className={`artwork ${album.cover} ${large ? 'artwork-large' : ''}`} aria-label={`${album.title} artwork placeholder`}>
      <span className="artwork-grain" />
      <span className="artwork-label">{album.coverLabel}</span>
      <span className="artwork-caption">{album.artist}</span>
    </div>
  )
}

function Rating({ value }: { value?: number }) {
  if (value === undefined) return <span className="rating-empty">Not rated</span>
  return <span className="rating"><span className="rating-star">★</span> {value.toFixed(1).replace('.0', '')}</span>
}

function AlbumCard({ album, onSelect }: { album: Album; onSelect: (album: Album) => void }) {
  return (
    <button className="album-card" onClick={() => onSelect(album)} type="button">
      <Artwork album={album} />
      <span className="album-card-title">{album.title}</span>
      <span className="album-card-artist">{album.artist}</span>
      <span className="album-card-meta"><Rating value={album.myRating} /><span>{album.year}</span></span>
    </button>
  )
}

function App() {
  const [selectedUser, setSelectedUser] = useState<'Matheus' | 'Thiago' | null>(() => {
    try {
      const saved = window.localStorage.getItem('lado-ab-user')
      return saved === 'Matheus' || saved === 'Thiago' ? saved : null
    } catch { return null }
  })
  const [page, setPage] = useState<Page>('home')
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All albums')
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [randomAlbum, setRandomAlbum] = useState<Album | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try { return window.localStorage.getItem('lado-ab-theme') === 'dark' } catch { return false }
  })
  const [featuredLyric] = useState(() => catalogLyrics[Math.floor(Math.random() * catalogLyrics.length)])

  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const pageTitle = navItems.find((item) => item.id === page)?.label ?? (page === 'collections' ? 'Collections' : 'Statistics')

  const visibleAlbums = useMemo(() => {
    let result = albums
    if (page === 'my-library') result = result.filter((album) => album.mine)
    if (page === 'his-library') result = result.filter((album) => album.his)
    if (page === 'our-collection') result = result.filter((album) => album.mine && album.his)
    if (filter === 'Listened') result = result.filter((album) => page === 'his-library' ? album.listenedByHim : album.listenedByMe)
    if (filter === 'Unlistened') result = result.filter((album) => page === 'his-library' ? !album.listenedByHim : !album.listenedByMe)
    if (filter === 'Rated') result = result.filter((album) => page === 'his-library' ? album.hisRating !== undefined : album.myRating !== undefined)
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((album) => `${album.title} ${album.artist} ${album.genre}`.toLowerCase().includes(query))
    }
    return result
  }, [albums, filter, page, search])

  const navigate = (next: Page) => {
    setPage(next)
    setSearch('')
    setFilter('All albums')
    setSelectedAlbum(null)
    setMobileNavOpen(false)
  }

  const pickRandomAlbum = () => {
    const unheardByBoth = albums.filter((album) => !album.listenedByMe && !album.listenedByHim)
    const unheardByMe = albums.filter((album) => !album.listenedByMe)
    const choices = unheardByBoth.length ? unheardByBoth : unheardByMe.length ? unheardByMe : albums
    setRandomAlbum(choices[Math.floor(Math.random() * choices.length)])
  }

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current
      try { window.localStorage.setItem('lado-ab-theme', next ? 'dark' : 'light') } catch { /* storage may be unavailable */ }
      return next
    })
  }

  const addAlbum = (album: Album) => {
    setAlbums((current) => current.map((item) => item.id === album.id ? { ...item, mine: true } : item))
    setShowAdd(false)
    setToast(`“${album.title}” added to your library`)
    window.setTimeout(() => setToast(''), 2800)
  }

  const renderLibrary = () => (
    <>
      <div className="page-heading-row">
        <div><p className="eyebrow">THE RECORD SHELF</p><h1>{pageTitle}</h1><p className="page-intro">{page === 'our-collection' ? 'The records that have found a home on both sides.' : 'A growing collection of records worth keeping.'}</p></div>
        <button className="button button-dark" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} /> Add an album</button>
      </div>
      <div className="library-toolbar">
        <label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search albums, artists, genres..." /></label>
        <div className="filter-pills">{['All albums', 'Listened', 'Unlistened', 'Rated'].map((item) => <button key={item} className={filter === item ? 'filter-pill active' : 'filter-pill'} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      <div className="results-line"><span>{visibleAlbums.length} RECORDS</span><span>Recently added <span aria-hidden="true">⌄</span></span></div>
      {visibleAlbums.length ? <div className="album-grid">{visibleAlbums.map((album) => <AlbumCard key={album.id} album={album} onSelect={setSelectedAlbum} />)}</div> : <div className="empty-state"><p>No records found.</p><span>Try another search or filter.</span></div>}
    </>
  )

  const chooseUser = (user: 'Matheus' | 'Thiago') => {
    setSelectedUser(user)
    try { window.localStorage.setItem('lado-ab-user', user) } catch { /* storage may be unavailable */ }
  }

  const switchUser = () => {
    setSelectedUser(null)
    try { window.localStorage.removeItem('lado-ab-user') } catch { /* storage may be unavailable */ }
  }

  if (!selectedUser) {
    return (
      <div className={darkMode ? 'app-shell dark-mode profile-screen' : 'app-shell profile-screen'}>
        <div className="profile-picker">
          <div className="profile-brand">
            <span className="brand-mark"><span>A</span><i>/</i><span>B</span></span>
            <span className="brand-name">Lado A <span>/</span> Lado B</span>
            <span className="brand-caption">A SHARED MUSIC ARCHIVE</span>
          </div>
          <p className="eyebrow">TWO SIDES, ONE COLLECTION</p>
          <h1>Who's listening<br /><em>today?</em></h1>
          <p className="profile-intro">Choose your profile to step into the archive.</p>
          <div className="profile-options">
            {(['Matheus', 'Thiago'] as const).map((user, index) => (
              <button className="profile-card" key={user} onClick={() => chooseUser(user)} type="button">
                <span className={index === 0 ? 'profile-avatar profile-avatar-matheus profile-avatar-photo' : 'profile-avatar profile-avatar-thiago profile-avatar-photo'}>{user === 'Matheus' ? <img src={matheusAvatar} alt="" /> : <img src={thiagoAvatar} alt="" />}</span>
                <span className="profile-card-name">{user}</span>
                <span className="profile-card-caption">{index === 0 ? 'SIDE A' : 'SIDE B'}</span>
                <span className="profile-card-arrow"><Icon name="arrow" size={18} /></span>
              </button>
            ))}
          </div>
          <span className="profile-footer">A LITTLE SPACE FOR THE MUSIC YOU SHARE.</span>
        </div>
        <button className="profile-theme-toggle theme-toggle" onClick={toggleTheme} type="button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}><Icon name={darkMode ? 'sun' : 'moon'} size={18} /></button>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'app-shell dark-mode' : 'app-shell'}>
      <aside className={mobileNavOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <button className="brand-lockup" onClick={() => navigate('home')} type="button">
          <span className="brand-mark"><span>A</span><i>/</i><span>B</span></span>
          <span className="brand-name">Lado A <span>/</span> Lado B</span>
          <span className="brand-caption">A SHARED MUSIC ARCHIVE</span>
        </button>
        <div className="sidebar-rule" />
        <p className="nav-label">YOUR ARCHIVE</p>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={page === item.id ? 'nav-item active' : 'nav-item'} onClick={() => navigate(item.id)}><Icon name={item.icon} size={18} /><span>{item.label}</span>{item.id === 'recommendations' && <span className="nav-count">3</span>}</button>)}
        </nav>
        <p className="nav-label secondary-nav-label">MORE TO EXPLORE</p>
        <nav className="main-nav" aria-label="More navigation">
          <button className={page === 'collections' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('collections')}><Icon name="grid" size={18} /><span>Collections</span></button>
          <button className={page === 'stats' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('stats')}><Icon name="chart" size={18} /><span>Statistics</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="side-note"><span className="side-note-mark">✳</span><p>Good records are<br /><em>better when shared.</em></p></div>
          <span className="sidebar-foot">EST. IN GOOD TASTE · 2026</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation"><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>THE ARCHIVE</span><span className="breadcrumb-slash">/</span><strong>{pageTitle.toUpperCase()}</strong></div>
          <div className="topbar-actions"><span className="today-label">{today}</span><button className="profile-switch" onClick={switchUser} type="button" title="Switch profile"><span className="profile-avatar profile-avatar-mini profile-avatar-photo">{selectedUser === 'Matheus' ? <img src={matheusAvatar} alt="" /> : <img src={thiagoAvatar} alt="" />}</span><span>{selectedUser}</span></button><button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}><Icon name={darkMode ? 'sun' : 'moon'} size={18} /></button><button className="button button-outline top-add" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} /> Add album</button></div>
        </header>

        <div className="page-content">
          {page === 'home' && (
            <>
              <section className="home-intro">
                <div><p className="eyebrow">{today.toUpperCase()} · A NOTE FROM THE ARCHIVE</p><h1>Good music<br /><em>travels between us.</em></h1><p className="home-lede">A living collection of albums we find, pass along, and come back to.</p></div>
                <div className="intro-actions"><button className="button button-dark" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} /> Add an album</button><button className="button button-text" onClick={pickRandomAlbum}><Icon name="shuffle" size={16} /> Surprise me</button></div>
                <span className="intro-stamp">SIDE A<br /><b>✳</b><br />SIDE B</span>
              </section>

              <section className="overview-strip">
                <div><span className="metric-number">{albums.length.toString().padStart(2, '0')}</span><span className="metric-label">ALBUMS IN THE ARCHIVE</span></div>
                <div><span className="metric-number">{albums.filter((album) => album.mine && album.his).length.toString().padStart(2, '0')}</span><span className="metric-label">ON BOTH SHELVES</span></div>
                <div><span className="metric-number">{albums.filter((album) => album.recommendedBy).length.toString().padStart(2, '0')}</span><span className="metric-label">RECOMMENDATIONS</span></div>
                <div><span className="metric-number">{albums.filter((album) => album.listenedByMe && album.listenedByHim).length.toString().padStart(2, '0')}</span><span className="metric-label">LISTENED TOGETHER</span></div>
              </section>

              <div className="home-columns">
                <section className="home-section waiting-section">
                  <div className="section-heading"><div><p className="eyebrow">THE NEXT LISTEN</p><h2>Waiting for you</h2></div><button className="text-link" onClick={() => navigate('recommendations')}>All recommendations <Icon name="arrow" size={14} /></button></div>
                  <div className="recommendation-feature">
                    <Artwork album={albums[6]} large />
                    <div className="recommendation-copy"><span className="status-label"><i /> JUST IN · FROM HIM</span><h3>{albums[6].title}</h3><p className="muted">{albums[6].artist} · {albums[6].year}</p><blockquote>“I think this is right up your alley.”</blockquote><button className="button button-dark button-small" onClick={() => setSelectedAlbum(albums[6])}>Open recommendation <Icon name="arrow" size={14} /></button></div>
                  </div>
                  <div className="section-heading activity-heading"><div><p className="eyebrow">LITTLE BY LITTLE</p><h2>Recent activity</h2></div><span className="quiet-label">A SHARED TIMELINE</span></div>
                  <div className="activity-list">
                    <div className="activity-item"><Artwork album={albums[0]} /><div><p><strong>He rated</strong> The New Abnormal</p><span>Yesterday · 4.5 stars</span></div><Rating value={4.5} /></div>
                    <div className="activity-item"><Artwork album={albums[4]} /><div><p><strong>You added</strong> Bloom</p><span>2 days ago · To your library</span></div><span className="activity-dot" /></div>
                    <div className="activity-item"><Artwork album={albums[1]} /><div><p><strong>You both listened</strong> to In Rainbows</p><span>Last week · A shared favorite</span></div><span className="activity-dot" /></div>
                  </div>
                </section>

                <aside className="home-aside">
                  <section className="aside-section">
                    <div className="section-heading"><div><p className="eyebrow">FRESH ON THE SHELF</p><h2>Recently added</h2></div><button className="icon-link" onClick={() => navigate('my-library')} aria-label="Open library"><Icon name="arrow" /></button></div>
                    {[albums[5], albums[4], albums[1]].map((album, index) => <button className="recent-album" key={album.id} onClick={() => setSelectedAlbum(album)}><Artwork album={album} /><span className="recent-copy"><strong>{album.title}</strong><small>{album.artist}</small><small className="recent-added">{index === 0 ? 'ADDED BY YOU' : index === 1 ? 'ADDED BY HIM' : 'IN BOTH LIBRARIES'}</small></span><Icon name="arrow" size={15} /></button>)}
                  </section>
                  <section className="random-card">
                    <span className="random-ornament">✳</span><p className="eyebrow">NEED A PLACE TO START?</p><h2>Let the records<br /><em>decide.</em></h2><p>Pick something neither of you has heard yet.</p><button className="button button-light" onClick={pickRandomAlbum}><Icon name="shuffle" size={16} /> Find a random album</button>
                  </section>
                  <section className="aside-note"><span>“</span><p>{featuredLyric.text}</p><small>— {featuredLyric.song.toUpperCase()} · {featuredLyric.artist.toUpperCase()}</small></section>
                </aside>
              </div>
            </>
          )}

          {(page === 'my-library' || page === 'his-library' || page === 'our-collection') && renderLibrary()}

          {page === 'recommendations' && (
            <section className="subpage"><p className="eyebrow">MUSIC, PASSED BACK AND FORTH</p><h1>Recommendations</h1><p className="page-intro">Albums with a little message attached. Some are still waiting for their moment.</p><div className="recommendation-list">{albums.filter((album) => album.recommendedBy).map((album) => <button className="recommendation-row" key={album.id} onClick={() => setSelectedAlbum(album)}><Artwork album={album} /><span className="recommendation-row-copy"><strong>{album.title}</strong><small>{album.artist}</small><small>Recommended {album.recommendedBy === 'him' ? 'by him to you' : 'by you to him'}</small></span><span className={album.listenedByMe ? 'tag tag-done' : 'tag tag-pending'}>{album.listenedByMe ? 'Listened' : 'Waiting'}</span><Icon name="arrow" size={16} /></button>)}</div></section>
          )}

          {page === 'collections' && (
            <section className="subpage"><p className="eyebrow">A RECORD FOR EVERY MOOD</p><h1>Collections</h1><p className="page-intro">Little shelves within the bigger one. Gather albums around a feeling, a memory, or a passing obsession.</p><div className="collection-grid"><button className="collection-card collection-one" onClick={() => navigate('our-collection')}><span>01 / SHARED</span><h2>On repeat,<br /><em>together.</em></h2><small>Albums we've both spent time with</small></button><button className="collection-card collection-two" onClick={() => navigate('my-library')}><span>02 / YOUR SIDE</span><h2>Personal<br /><em>favorites.</em></h2><small>The records that stay with you</small></button><button className="collection-card collection-three" onClick={() => navigate('recommendations')}><span>03 / TO EXPLORE</span><h2>For a rainy<br /><em>afternoon.</em></h2><small>Things waiting to be discovered</small></button></div></section>
          )}

          {page === 'stats' && (
            <section className="subpage"><p className="eyebrow">THE NUMBERS BEHIND THE NOISE</p><h1>By the numbers</h1><p className="page-intro">A few patterns from the music we've been sharing.</p><div className="stats-grid"><div className="stat-card"><span>ALBUMS CATALOGED</span><strong>{albums.length}</strong><small>Across both libraries</small></div><div className="stat-card"><span>SHARED ALBUMS</span><strong>{albums.filter((album) => album.mine && album.his).length}</strong><small>On both shelves</small></div><div className="stat-card"><span>AVERAGE YOUR RATING</span><strong>4.6</strong><small>Out of 5 stars</small></div><div className="stat-card"><span>AVERAGE HIS RATING</span><strong>4.4</strong><small>Out of 5 stars</small></div></div><div className="genre-panel"><div className="section-heading"><div><p className="eyebrow">A SHARED SOUND</p><h2>Genres in the archive</h2></div></div>{[['Indie rock',82],['Art rock',66],['Dream pop',52],['Shoegaze',38],['Post-punk',29]].map(([genre, value]) => <div className="genre-row" key={genre as string}><span>{genre}</span><div className="genre-track"><i style={{ width: `${value}%` }} /></div><small>{value}%</small></div>)}</div></section>
          )}
        </div>
        <footer className="page-footer"><span>LADO A / LADO B</span><span>MADE OF MUSIC & MEMORY</span><span>VOL. 01 — 2026</span></footer>
      </main>

      {(selectedAlbum || randomAlbum || showAdd) && (
        <div className="modal-backdrop" onClick={() => { setSelectedAlbum(null); setRandomAlbum(null); setShowAdd(false) }}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelectedAlbum(null); setRandomAlbum(null); setShowAdd(false) }} aria-label="Close"><Icon name="close" /></button>
            {selectedAlbum && <><Artwork album={selectedAlbum} large /><p className="eyebrow modal-eyebrow">FROM THE ARCHIVE · {selectedAlbum.year}</p><h2>{selectedAlbum.title}</h2><p className="muted">{selectedAlbum.artist} · {selectedAlbum.genre}</p><div className="modal-ratings"><div><small>YOUR RATING</small><Rating value={selectedAlbum.myRating} /></div><div><small>HIS RATING</small><Rating value={selectedAlbum.hisRating} /></div></div><p className="modal-note">{selectedAlbum.note ?? 'No notes yet. A good place to remember what this album means to you.'}</p><button className="button button-dark modal-action" onClick={() => { setSelectedAlbum(null); setToast('Album details are ready for the next development phase.'); window.setTimeout(() => setToast(''), 2800) }}>Back to the archive</button></>}
            {randomAlbum && <><p className="eyebrow modal-eyebrow">THE RECORDS HAVE DECIDED</p><Artwork album={randomAlbum} large /><h2>{randomAlbum.title}</h2><p className="muted">{randomAlbum.artist} · {randomAlbum.year}</p><p className="modal-note">A little nudge toward something new. Give this one a spin.</p><button className="button button-dark modal-action" onClick={() => { setSelectedAlbum(randomAlbum); setRandomAlbum(null) }}>Take a closer look <Icon name="arrow" size={15} /></button><button className="button button-text modal-action" onClick={pickRandomAlbum}>Try another record <Icon name="shuffle" size={15} /></button></>}
            {showAdd && <><p className="eyebrow modal-eyebrow">GROW THE ARCHIVE</p><h2>Add an album</h2><p className="muted">Spotify search will arrive in the next phase. For now, try adding one of these sample records.</p><div className="add-options">{albums.filter((album) => !album.mine).slice(0, 4).map((album) => <div className="add-option" key={album.id}><Artwork album={album} /><span><strong>{album.title}</strong><small>{album.artist}</small></span><button onClick={() => addAlbum(album)} aria-label={`Add ${album.title}`}><Icon name="plus" /></button></div>)}</div></>}
          </section>
        </div>
      )}
      {toast && <div className="toast"><Icon name="check" size={16} />{toast}</div>}
    </div>
  )
}

export default App
