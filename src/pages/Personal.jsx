import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import useReveal   from "../hooks/useReveal"
import HeroText    from "../components/HeroText"
import Magnetic    from "../components/Magnetic"

/* ── Places — add your photos here ─────────────────────────
   key:    folder name under public/travel/
   label:  display name
   lat/lng: for the map pin
   photos: filenames WITHOUT extension — these become captions
   ✏️ UPDATE: add/remove photos per place as needed
─────────────────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════
   ✏️ TRAVEL — ADD / EDIT PLACES HERE
   ─────────────────────────────────────────────────────────
   To add a new place:
   1. Copy any block below and paste it at the end of the list
   2. Fill in: key, label, lat, lng, photos
   3. key   → folder name under public/travel/  e.g. "munnar"
   4. label → display name shown on screen       e.g. "Munnar"
   5. lat/lng → Google Maps coords (right-click any location → copy coords)
   6. photos → filenames WITHOUT .jpg extension  e.g. ["valley", "tea-garden"]
              these become the photo captions automatically
   7. Create the folder: public/travel/munnar/
   8. Add your photos:   public/travel/munnar/valley.jpg  etc.
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   ✏️ TRAVEL PLACES — ALL EDITS HAPPEN HERE
   ══════════════════════════════════════════════════════════
   TO ADD A NEW IMAGE to an existing place:
     → Find the place block below
     → Add the filename (without extension) to its photos array
     → Drop the file in public/travel/<key>/
     Example: photos: ["kayak-club", "vidhana-soudha", "new-photo"]

   TO ADD A NEW PLACE entirely:
     → Copy any block below, paste at the bottom before the closing ]
     → Fill in key, label, lat, lng, photos
     → key must match the folder name exactly (lowercase, no spaces)
     → lat/lng: right-click on Google Maps → copy coordinates
     → Create folder: public/travel/<key>/
     → Add photos:    public/travel/<key>/photo-name.jpg
   ══════════════════════════════════════════════════════════ */
const PLACES = [
  {
    key:    "bengaluru",
    label:  "Bengaluru",
    lat:    12.9716,
    lng:    77.5946,
    photos: ["kayak club", "vidhana soudha"],  // ✏️ ADD NEW BENGALURU PHOTOS HERE
  },
  {
    key:    "coimbatore",
    label:  "Coimbatore",
    lat:    11.0168,
    lng:    76.9558,
    photos: ["adiyogi", "kovai hill forest", "kovai hills"],  // ✏️ ADD NEW COIMBATORE PHOTOS HERE
  },
  {
    key:    "delhi",
    label:  "Delhi",
    lat:    28.6139,
    lng:    77.2090,
    photos: ["india gate", "qutb minar", "rashtrapati bhavan", "red fort"],  // ✏️ ADD NEW DELHI PHOTOS HERE
  },
  {
    key:    "ernakulam",
    label:  "Ernakulam",
    lat:    9.9816,
    lng:    76.2999,
    photos: ["hill palace tripunithura", "marine drive kochi"],  // ✏️ ADD NEW ERNAKULAM PHOTOS HERE
  },
  {
    key:    "gujarat",
    label:  "Gujarat",
    lat:    23.0225,
    lng:    72.5714,
    photos: ["atal bridge", "gandhinagar", "sabarmati ashram", "sabarmati riverfront", "the adalaj stepwell"],  // ✏️ ADD NEW GUJARAT PHOTOS HERE
  },
  {
    key:    "kollam",
    label:  "Kollam",
    lat:    8.8932,
    lng:    76.6141,
    photos: ["kollam beach", "munroe island", "thenmala"],  // ✏️ ADD NEW KOLLAM PHOTOS HERE
  },
  {
    key:    "mysuru",
    label:  "Mysuru",
    lat:    12.2958,
    lng:    76.6394,
    photos: ["meenakshipura", "mysore palace", "payana car museum", "sunflower farm", "venugopala swamy temple"],  // ✏️ ADD NEW MYSURU PHOTOS HERE
  },

  // ✏️ ADD A NEW PLACE HERE ↓ (copy the block below and fill in your details)
  // {
  //   key:    "placename",          // folder: public/travel/placename/
  //   label:  "Place Name",         // shown on chip + lightbox
  //   lat:    00.0000,              // Google Maps right-click → copy coords
  //   lng:    00.0000,
  //   photos: ["photo1", "photo2"], // filenames without extension
  // },
]

const FILMS = [
  {
    title: "Interstellar",
    year: "2014",
    credit: "Dir. Christopher Nolan",
    filmClass: "film-interstellar",
    hasBgEl: ["stars", "wormhole"],
    desc: "I've always loved space stories, and this film blends science and emotion better than almost anything else. The father–daughter dynamic and the sheer scale of it make it unforgettable. I went for the re-release screening and have rewatched it several times since — it only gets better.",
  },
  {
    title: "The Shawshank Redemption",
    year: "1994",
    credit: "Dir. Frank Darabont",
    filmClass: "film-khan",
    hasBgEl: ["rain"],
    desc: "The ending genuinely surprised me the first time I watched it. What makes the film special is the human connection — hope, friendship, and quiet resilience. Morgan Freeman's narration adds so much warmth that the whole thing just stays with you.",
  },
  {
    title: "Iruvar",
    year: "1997",
    credit: "Dir. Mani Ratnam",
    filmClass: "film-iruvar",
    hasBgEl: ["split-light"],
    desc: "A fascinating mix of cinema, politics, and friendship. Mohanlal's performance is incredible, and Mani Ratnam makes the film feel both grand and personal. The music and cinematography make it one of his most memorable works.",
  },
  {
    title: "Brooklyn Nine-Nine",
    year: "2013–2021",
    credit: "Andy Samberg · Stephanie Beatriz",
    filmClass: "film-b99",
    hasBgEl: ["city-lights"],
    desc: "Hooked me from the beginning. Andy Samberg in peak goofy form, great ensemble cast, fast-paced comedy — it's one of those shows I binge whenever I want something fun and easy. Endlessly rewatchable.",
  },
]

const SONGS = [
  { title: "Can't Take My Eyes Off You", artist: "Frankie Valli",          link: "https://youtu.be/J36z7AnhvOM?si=fx0hf0yFZHnaN_8T" },
  { title: "Can't Help Falling in Love", artist: "Elvis Presley",          link: "https://youtu.be/vGJTaP6anOU?si=Me1NLuJgLI4aG3SS" },
  { title: "Billie Jean",                artist: "Michael Jackson",         link: "https://youtu.be/Zi_XLOBDo_Y?si=W5Uf1Q2biIdAULSO" },
  { title: "Cherathukal",                artist: "Sushin Shyam · Sithara Krishnakumar", link: "https://youtu.be/kAP72G5R4H8?si=wh-O6WdH-wpjBPoj" },
  { title: "Ennavale Adi Ennavale",      artist: "A. R. Rahman",            link: "https://youtu.be/rZvhOxBWb0E?si=6pX1PELNzX5EuO8K" },
]

const BOOKS = [
  { title: "Percy Jackson Series",          author: "Rick Riordan",          status: "read" },
  { title: "The Alchemist",                 author: "Paulo Coelho",           status: "read" },
  { title: "The Immortals of Meluha",       author: "Amish Tripathi",         status: "reading" },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", status: "next" },
]
const STATUS_LABEL = { read: "Read", reading: "Reading now", next: "Up next" }
const STATUS_CLASS  = { read: "status-read", reading: "status-reading", next: "status-next" }

const IconNote = () => (
  <svg className="song-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
)
const IconPlay = () => (
  <svg className="song-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
  </svg>
)
const IconBook = () => (
  <svg className="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)




/* ── Image with jpg/png fallback ────────────────────────── */
function TravelImg({ src, alt, className, onClick }) {
  const ext = src.match(/\.(?:jpg|jpeg|png|heic)$/i) ? "" : ".jpg"
  const [imgSrc, setImgSrc] = useState(src + ext)
  useEffect(() => { setImgSrc(src + ".jpg") }, [src])
  return (
    <img
      className={className}
      src={imgSrc}
      alt={alt}
      onClick={onClick}
      onError={() => {
        if (imgSrc.endsWith(".jpg"))       setImgSrc(src + ".JPG")
        else if (imgSrc.endsWith(".JPG"))  setImgSrc(src + ".jpeg")
        else if (imgSrc.endsWith(".jpeg")) setImgSrc(src + ".png")
        else if (imgSrc.endsWith(".png"))  setImgSrc(src + ".PNG")
        else if (imgSrc.endsWith(".PNG"))  setImgSrc(src + ".heic")
      }}
    />
  )
}

/* ── Lightbox ────────────────────────────────────────────── */

function Lightbox({ place, onClose, onNextPlace }) {
  const [active, setActive] = useState(0)
  const total = place.photos.length
  const src   = (i) => `/travel/${place.key}/${encodeURIComponent(place.photos[i])}`
  const caption = place.photos[active].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

  useEffect(() => { setActive(0) }, [place])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setActive(a => (a + 1) % total)
      if (e.key === "ArrowLeft")  setActive(a => (a + total - 1) % total)
      if (e.key === "Escape")     onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [total, onClose])

  const el = (
    <div className="lightbox-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lightbox-inner">

        {/* close */}
        <button className="lightbox-close" onClick={onClose}>✕</button>

        {/* main image area */}
        <div className="lightbox-img-area">
          <TravelImg
            key={active}
            className="lightbox-main-img"
            src={src(active)}
            alt={caption}
          />

          {/* side arrows */}
          {total > 1 && <>
            <button className="lightbox-arrow lightbox-arrow-left"  onClick={() => setActive(a => (a + total - 1) % total)}>‹</button>
            <button className="lightbox-arrow lightbox-arrow-right" onClick={() => setActive(a => (a + 1) % total)}>›</button>
          </>}
        </div>

        {/* bottom bar */}
        <div className="lightbox-bar">
          <div className="lightbox-bar-info">
            <span className="lightbox-place-row">
              <span className="lightbox-place">{place.label}</span>
              <a
                className="lightbox-pin"
                href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                target="_blank"
                rel="noreferrer"
                title="View on Google Maps"
              >📍</a>
            </span>
            <span className="lightbox-photo-caption">{caption}</span>
          </div>

          <div className="lightbox-bar-center">
            <div className="lightbox-thumbs">
              {place.photos.map((name, i) => (
                <TravelImg
                  key={i}
                  className={`lightbox-thumb ${i === active ? "active" : ""}`}
                  src={src(i)}
                  alt={name}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <span className="lightbox-counter">{active + 1} / {total}</span>
          </div>

          <div className="lightbox-bar-right">
            {onNextPlace && (
              <button className="lightbox-next-place" onClick={onNextPlace}>
                Next Location ›
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )

  return createPortal(el, document.body)
}


/* ── Page ────────────────────────────────────────────────── */
function Personal() {
  useReveal()
  const [lightboxPlace, setLightboxPlace] = useState(null)

  const heroRef = useRef(null)
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const fn = () => { el.style.transform = `translateY(${window.scrollY * 0.18}px)` }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div className="page personal-page">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="section hero-section">
        <div className="section-content">

          <p className="hero-label fade-up fade-up-1" style={{ color: "var(--accent-2)" }}>
            Beyond the CV
          </p>

          <div ref={heroRef} className="hero-parallax">
            <HeroText lines={["Hey, I'm", "Abhishek"]} personal />
          </div>

          <p className="personal-intro fade-up fade-up-2">
            Originally from <em>Kerala, India</em> — I completed my schooling there before
            moving to Mysuru for my undergraduate degree. I now live and work in Bengaluru
            while exploring opportunities in data and analytics.
            <br /><br />
            Outside of work, I enjoy travelling, watching films across languages and cultures,
            and having good conversations — whether about movies, geopolitics, books, or the
            occasional conspiracy theory. I might seem a bit reserved at first, but once the
            conversation gets interesting, I can easily switch into an extrovert.
            <br /><br />
            Find me on Instagram: <em>@abhisheks_2103</em>
          </p>

          <p className="personal-status fade-up fade-up-3">
            Currently: <span>trying to catch up on Formula 1</span> · <span>learning the ukulele</span>
          </p>

        </div>
      </section>

      <div className="divider" />

      {/* ── TRAVEL ───────────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Travel</h2></div>
          <p className="travel-desc reveal">
            I love travelling — every city adds a new layer of perspective. Kerala will always
            be home, while Bengaluru is where life is currently happening. Over time, I hope to
            slowly explore all of India, discovering different cultures, landscapes, and stories
            along the way. Beyond India, Spain and Switzerland are high on my travel list.
            The bucket list is long, and every trip adds another story.
            Click a place to see it through my lens.
          </p>
          <div className="travel-chips reveal">
            {PLACES.map((place) => (
              <button
                key={place.key}
                className="travel-chip"
                onClick={() => setLightboxPlace(place)}
              >
                {place.label}
              </button>
            ))}
          </div>
          <p className="travel-hint reveal" style={{ marginTop: "12px" }}>↑ Tap any place to open photos + map</p>
        </div>
      </section>

      {lightboxPlace && (
        <Lightbox
          place={lightboxPlace}
          allPlaces={PLACES}
          onClose={() => setLightboxPlace(null)}
          onNextPlace={() => {
            const idx = PLACES.findIndex(p => p.key === lightboxPlace.key)
            const next = PLACES[(idx + 1) % PLACES.length]
            setLightboxPlace(next)
          }}
        />
      )}

      <div className="divider" />

      {/* ── FILMS & SERIES ───────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Films & Series</h2></div>
          <p className="films-desc reveal">
            I enjoy films from across the world. Language matters less to me than strong
            storytelling and good filmmaking. Filmmakers I often return to include Christopher
            Nolan, Mani Ratnam, Quentin Tarantino, Martin Scorsese, Sathyan Anthikad, and
            Priyadarshan. I also enjoy binge-watching good series and am currently finishing
            The Office. Next on the watchlist: A Knight of the Seven Kingdoms.
            A few that stayed with me —
          </p>
          <div className="films-grid">
            {FILMS.map((film, i) => (
              <div key={film.title} className={`film-card ${film.filmClass} reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="film-bg-anim" />
                {film.hasBgEl.map((el) => <div key={el} className={el} />)}
                <div className="film-content">
                  <p className="film-year">{film.year}</p>
                  <h3 className="film-title">{film.title}</h3>
                  <p className="film-credit">{film.credit}</p>
                  <p className="film-desc">{film.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a className="letterboxd-btn reveal" href="https://boxd.it/bULn9" target="_blank" rel="noreferrer">
            See everything I've watched on Letterboxd →
          </a>
        </div>
      </section>

      <div className="divider" />

      {/* ── MUSIC ────────────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Music</h2></div>
          <p className="music-desc-text reveal">
            My music taste moves across eras and languages — from classic American pop and
            rock to Indian film music. Some days it's the orchestral brilliance of Ilaiyaraaja,
            other days it's A. R. Rahman or Arijit Singh, and sometimes an old-school American
            classic. Here are a few songs that are always on repeat.
          </p>
          <div className="songs-grid">
            {SONGS.map((song, i) => (
              <a key={song.title} className={`song-card reveal reveal-delay-${(i % 4) + 1}`} href={song.link} target="_blank" rel="noreferrer">
                <IconNote />
                <div className="song-info">
                  <p className="song-title">{song.title}</p>
                  <p className="song-artist">{song.artist}</p>
                </div>
                <IconPlay />
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── BOOKS ────────────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Books</h2></div>
          <p className="books-desc reveal">
            My reading interests range across mythology, fiction, magical realism, and
            thought-provoking non-fiction. Still building the habit, but enjoying books
            that explore big ideas, culture, and human nature.
          </p>
          <div className="books-grid">
            {BOOKS.map((book, i) => (
              <div key={book.title} className={`book-card reveal reveal-delay-${(i % 4) + 1}`}>
                <IconBook />
                <span className={`book-status ${STATUS_CLASS[book.status]}`}>{STATUS_LABEL[book.status]}</span>
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CONTACT CTA ──────────────────────────────── */}
      <section className="contact-section personal-contact reveal">
        <p className="contact-eyebrow">Say hello</p>
        <h2 className="contact-heading">Let's talk.</h2>
        <p className="contact-email">
          <a href="mailto:abhisheksuneesh2103@gmail.com">abhisheksuneesh2103@gmail.com</a>
        </p>
        <div className="contact-links">
          <Magnetic strength={10}><a className="social-link" href="https://instagram.com/abhisheks_2103" target="_blank" rel="noreferrer">Instagram</a></Magnetic>
          <Magnetic strength={10}><a className="social-link" href="https://www.linkedin.com/in/abhishek-s-0b358423b/" target="_blank" rel="noreferrer">↗ LinkedIn</a></Magnetic>
          <Magnetic strength={10}><a className="social-link" href="https://github.com/AbhishekS2103" target="_blank" rel="noreferrer">↗ GitHub</a></Magnetic>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-copy">© 2025 Abhishek Suneesh. All rights reserved.</p>
          <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            ↑ &nbsp;Back to top
          </button>
        </div>
      </footer>

    </div>
  )
}

export default Personal