import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import useReveal    from "../hooks/useReveal"
import StackScene   from "../components/StackScene"
import HeroText     from "../components/HeroText"
import Magnetic     from "../components/Magnetic"

/* ── Icons ──────────────────────────────────────────────── */
const IconCode   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
const IconBrain  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a4.5 4.5 0 0 1 0 9h-.5m5-9a4.5 4.5 0 0 1 0 9h.5M5 13a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4"/></svg>
const IconChart  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const IconTool   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
const IconSigma  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>
const IconCloud  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>

/* ── Data ───────────────────────────────────────────────── */
const SKILLS = [
  { icon: <IconCode  />, label: "Programming",              tags: ["Python", "SQL", "R (Basic)"] },
  { icon: <IconChart />, label: "Data Analysis & Visualization", tags: ["Microsoft Excel", "Power BI", "Tableau", "Exploratory Data Analysis"] },
  { icon: <IconBrain />, label: "Machine Learning",         tags: ["ML Fundamentals", "Deep Learning (Academic)", "Computer Vision (Project)"] },
  { icon: <IconTool  />, label: "Tools & Platforms",        tags: ["Git & GitHub", "Jupyter Notebook", "Zendesk", "MS Office Suite"] },
  { icon: <IconSigma />, label: "Foundations",              tags: ["Statistics", "Linear Algebra", "Data Modelling"] },
  { icon: <IconCloud />, label: "Systems Knowledge",        tags: ["Cloud Computing", "DBMS", "Operating Systems", "Computer Networks", "Active Directory"] },
]

const CERTS = [
  {
    num: 1,
    name: "Foundations: Data, Data, Everywhere",
    sub: "Google · Coursera",
    link: "https://www.coursera.org/account/accomplishments/verify/VHQXRLDBK8J8",
  },
  {
    num: 2,
    name: "Ask Questions to Make Data-Driven Decisions",
    sub: "Google · Coursera",
    link: "https://www.coursera.org/account/accomplishments/verify/WKZT5NX7MDB3",
  },
  {
    num: 3,
    name: "IEEE CCEM 2023: Conference Certificate",
    sub: "IEEE · Cloud Computing in Emerging Markets",
    link: null,  // no verify link — image only
  },
  {
    num: 4,
    name: "LTIMindtree Certified: Cloud & Infrastructure Services Professional",
    sub: "LTIMindtree · Oct 2024",
    link: null,  // no verify link — image only
  },
]


/* ── Cert Lightbox ───────────────────────────────────────── */
function CertLightbox({ certs, startIndex, onClose }) {
  const [active, setActive] = useState(startIndex)
  const total = certs.length
  const imgSrc = (i) => `/certificates/cert${certs[i].num}${certs[i].num === 3 ? ".jpg" : ".png"}`

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
    <div className="cert-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cert-modal">
        <button className="cert-modal-close" onClick={onClose}>✕</button>

        <img
          key={active}
          className="cert-modal-img"
          src={imgSrc(active)}
          alt={certs[active].name}
        />

        <div className="cert-modal-footer">
          <div className="cert-modal-info">
            <p className="cert-modal-name">{certs[active].name}</p>
            <p className="cert-modal-sub">{certs[active].sub}</p>
          </div>

          <div className="cert-modal-nav">
            <button className="cert-modal-btn" onClick={() => setActive(a => (a + total - 1) % total)}>←</button>
            <span className="cert-modal-counter">{active + 1} / {total}</span>
            <button className="cert-modal-btn" onClick={() => setActive(a => (a + 1) % total)}>→</button>
          </div>

          {certs[active].link && (
            <a className="cert-modal-verify" href={certs[active].link} target="_blank" rel="noreferrer">
              Verify Certificate →
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(el, document.body)
}

function Professional() {
  useReveal()
  const [certIndex, setCertIndex] = useState(null)

  /* hero name parallax */
  const heroRef = useRef(null)
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const fn = () => { el.style.transform = `translateY(${window.scrollY * 0.15}px)` }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  /* scroll to about */
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="page">

      {/* ══════════════════════════════════════════════
          LANDING — full viewport opener
      ══════════════════════════════════════════════ */}
      <section className="landing-section">
        <div className="landing-inner">

          <div ref={heroRef} className="hero-parallax">
            <HeroText lines={["Hi, I'm", "Abhishek"]} />
          </div>

          <p className="landing-tagline fade-up fade-up-2">
            Data Science Graduate&nbsp;·&nbsp;IT Professional&nbsp;·&nbsp;Aspiring Data Scientist
          </p>

          <div className="fade-up fade-up-3">
            <Magnetic strength={10}>
              <button className="scroll-down-btn" onClick={scrollToAbout}>
                About me&nbsp;&nbsp;↓
              </button>
            </Magnetic>
          </div>

        </div>

        {/* bottom fade into page */}
        <div className="landing-fade" />
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════ */}
      <section className="section about-section" id="about">
        <div className="section-content">

          <div className="section-header reveal">
            <h2 className="section-title">About</h2>
          </div>

          <div className="about-card reveal reveal-delay-1">
            <div className="about-card-inner">
            <div className="about-card-text">
            <p className="about-para">
              <strong>Cloud & Infrastructure Engineer</strong> with experience at LTIMindtree
              and a <strong>BCA in Data Science</strong> from Amrita Vishwa Vidyapeetham.
              My work so far has involved enterprise technical support, identity systems like Okta,
              and analysing operational data to improve incident resolution.
              <br />
              Alongside my professional work, I'm actively building projects and strengthening
              skills in data analytics, machine learning, and data-driven problem solving.
              Currently exploring opportunities in data analytics and data science while
              planning for a future <strong>Master's in Data Science</strong>.
            </p>

            <div className="about-pills">
              <div className="hero-pill"><span className="dot" />Open to internships in data roles</div>
              <div className="hero-pill">📍 Bengaluru, India</div>
            </div>

            <p className="hero-status">
              Currently: <span>Learning German</span> · <span>Figuring out what's next</span> · <span>Upskilling in Data</span>
              {/* ✏️ UPDATE: Change these to whatever's actually true right now */}
            </p>

            <div className="social-links">
              <Magnetic strength={8}>
                <a className="social-link" href="https://www.linkedin.com/in/abhishek-s-0b358423b/" target="_blank" rel="noreferrer">↗ LinkedIn</a>
              </Magnetic>
              <Magnetic strength={8}>
                <a className="social-link" href="https://github.com/AbhishekS2103" target="_blank" rel="noreferrer">↗ GitHub</a>
              </Magnetic>
              <Magnetic strength={8}>
                {/* ✏️ Put your resume PDF at public/resume.pdf */}
                <a className="cv-download-btn" href="/resume.pdf" download="Abhishek_Suneesh_Resume.pdf">↓ Download CV</a>
              </Magnetic>
              <Magnetic strength={8}>
                {/* ✏️ Put your Europass PDF at public/europass.pdf */}
                <a className="cv-download-btn" href="/europass.pdf" download="Abhishek_Suneesh_Europass.pdf">↓ Europass CV</a>
              </Magnetic>
            </div>
            </div>{/* end about-card-text */}

            {/* photo */}
            <div className="about-photo-wrap">
              <img src="/abhishek.jpg" alt="Abhishek Suneesh" className="about-photo" />
            </div>

            </div>{/* end about-card-inner */}
          </div>

        </div>
      </section>

      <div className="divider" />

      {/* ── EXPERIENCE ───────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Experience</h2></div>
          <div className="exp-card reveal reveal-delay-1">
            <div className="exp-header">
              <h3 className="exp-role">Engineer – Cloud & Infra Management</h3>
              <span className="exp-date">Sep 2024 – Mar 2026</span>
            </div>
            <p className="exp-company">LTIMindtree · Bengaluru, India</p>
            <ul className="exp-bullets">
              <li>Provided technical support for enterprise cloud platforms (Okta, Microsoft 365), resolving authentication, access control, and service availability issues.</li>
              <li>Analysed ticket trends and operational data using Microsoft Excel to identify recurring issues and support root cause analysis.</li>
              <li>Coordinated with stakeholders to ensure SLA compliance and timely resolution of high-impact incidents.</li>
              <li>Generated operational performance reports using Excel dashboards and presented insights through PowerPoint.</li>
              <li>Contributed to process optimisation through SOP development and technical documentation.</li>
            </ul>
            <div className="exp-tags">
              <span className="tag">Okta</span><span className="tag">Microsoft 365</span>
              <span className="tag">Zendesk</span><span className="tag">SLA Management</span>
              <span className="tag">Excel Dashboards</span><span className="tag">ITIL</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── SKILLS ───────────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Technical Skills</h2></div>
          <div className="skills-bento reveal reveal-delay-1">
            {SKILLS.map((s, i) => (
              <div className={`skill-bento-card${[1,2].includes(i) ? " span-2" : ""}`} key={s.label}>
                <span className="skill-bento-icon">{s.icon}</span>
                <span className="skill-cat-label">{s.label}</span>
                <div className="skill-tags-wrap">
                  {s.tags.map(t => <span className="skill-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── PROJECTS ─────────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Projects & Publications</h2></div>
        </div>
        <div style={{ width: "90%", maxWidth: "1100px", margin: "0 auto" }}>
          <StackScene>

            <div className="stack-card">
              <span className="project-badge badge-publication">IEEE Publication</span>
              <p className="project-num">01</p>
              <h3 className="project-title">Classification of Indian Medicinal Flowers using MobileNetV2</h3>
              <p className="project-desc">
                IEEE-published research paper presenting a lightweight deep learning model
                for medicinal flower classification. The model achieved 98.23% accuracy on
                a dataset of 3,343 images across 13 flower classes. Published at INDIACom 2024
                , 11th International Conference on Computing for Sustainable Global Development.
              </p>
              <div className="exp-tags" style={{ marginBottom: "20px" }}>
                <span className="tag">IEEE Published</span><span className="tag">MobileNetV2</span>
                <span className="tag">98.23% Accuracy</span><span className="tag">INDIACom 2024</span>
              </div>
              <a className="project-link" href="https://doi.org/10.23919/INDIACom61295.2024.10498274" target="_blank" rel="noreferrer">View on IEEE →</a>
            </div>

            <div className="stack-card">
              <span className="project-badge badge-research">BCA Research Project</span>
              <p className="project-num">02</p>
              <h3 className="project-title">Classification & Quality Grading of Medicinal Flowers</h3>
              <p className="project-desc">
                Final-year BCA research project applying computer vision and machine learning
                for medicinal flower classification and quality detection. Created a dataset of
                6,313 images across 28 classes collected from botanical and Ayurvedic gardens
                in Karnataka and Kerala. Developed and evaluated multiple ML/DL models and
                proposed a custom CNN architecture (FlowerNet) for improved classification performance.
              </p>
              <div className="exp-tags">
                <span className="tag">Computer Vision</span><span className="tag">Deep Learning</span>
                <span className="tag">Python</span><span className="tag">FlowerNet</span>
              </div>
            </div>

            <div className="stack-card">
              <span className="project-badge badge-conference">Conference</span>
              <p className="project-num">03</p>
              <h3 className="project-title">IEEE CCEM 2023: Student Project Showcase</h3>
              <p className="project-desc">
                Presented the project "Classification of Indian Medicinal Flowers Using MobileNetV1"
                at IEEE CCEM 2023, 12th International Conference on Cloud Computing in Emerging
                Markets, Mysuru. Demonstrated the application of deep learning techniques for
                efficient image classification.
              </p>
              <div className="exp-tags">
                <span className="tag">Conference Presentation</span>
                <span className="tag">IEEE CCEM 2023</span><span className="tag">MobileNetV1</span>
              </div>
            </div>

            <div className="stack-card">
              <span className="project-badge badge-project">Personal Project</span>
              <p className="project-num">04</p>
              <h3 className="project-title">This Portfolio Website</h3>
              <p className="project-desc">
                Personal portfolio website designed and structured to showcase projects,
                research, and professional experience. Built using React and modern front-end
                tools, leveraging AI-assisted development workflows to accelerate implementation.
                Focused on responsive design, component-based structure, and clean user experience.
              </p>
              <div className="exp-tags" style={{ marginBottom: "20px" }}>
                <span className="tag">React</span><span className="tag">CSS</span>
                <span className="tag">Vite</span><span className="tag">React Router</span>
              </div>
              <a className="project-link" href="https://github.com/AbhishekS2103" target="_blank" rel="noreferrer">View on GitHub →</a>
            </div>

          </StackScene>
        </div>
      </section>

      <div className="divider" />

      {/* ── CERTIFICATIONS ───────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Certifications</h2></div>
          <div className="certificate-scroll">
            {CERTS.map((c, i) => (
              <div key={c.num} className="certificate-card" onClick={() => setCertIndex(i)} style={{ cursor: "pointer" }}>
                <img src={`/certificates/cert${c.num}${c.num === 3 ? ".jpg" : ".png"}`} alt={c.name} />
                <p className="cert-name">{c.name}</p>
                <p className="cert-sub">{c.sub}</p>
                {c.link
                  ? <span className="cert-link">Verify →</span>
                  : <span className="cert-link cert-no-link">Certificate</span>
                }
              </div>
            ))}
          </div>
          {certIndex !== null && (
            <CertLightbox certs={CERTS} startIndex={certIndex} onClose={() => setCertIndex(null)} />
          )}
        </div>
      </section>

      <div className="divider" />

      {/* ── LANGUAGES ────────────────────────────────── */}
      <section className="section">
        <div className="section-content">
          <div className="section-header reveal"><h2 className="section-title">Languages</h2></div>
          <div className="languages-grid">
            <div className="lang-card reveal reveal-delay-1"><p className="lang-name">Malayalam</p><p className="lang-native">Native</p></div>
            <div className="lang-card reveal reveal-delay-2"><p className="lang-name">English</p><p className="lang-level">IELTS 7.5 Band</p></div>
            <div className="lang-card reveal reveal-delay-3"><p className="lang-name">Hindi</p><p className="lang-level">Proficient</p></div>
            <div className="lang-card reveal reveal-delay-4"><p className="lang-name">Tamil</p><p className="lang-level">Independent</p></div>
            <div className="lang-card reveal reveal-delay-1"><p className="lang-name">German</p><p className="lang-learning">Learning</p></div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CONTACT CTA ──────────────────────────────── */}
      <section className="contact-section reveal">
        <p className="contact-eyebrow">Get in touch</p>
        <h2 className="contact-heading">Let's talk.</h2>
        <p className="contact-email">
          <a href="mailto:abhisheksuneesh2103@gmail.com">abhisheksuneesh2103@gmail.com</a>
        </p>
        <div className="contact-links">
          <Magnetic strength={10}><a className="social-link" href="https://www.linkedin.com/in/abhishek-s-0b358423b/" target="_blank" rel="noreferrer">↗ LinkedIn</a></Magnetic>
          <Magnetic strength={10}><a className="social-link" href="https://github.com/AbhishekS2103" target="_blank" rel="noreferrer">↗ GitHub</a></Magnetic>
          <Magnetic strength={10}><a className="social-link" href="https://instagram.com/abhisheks_2103" target="_blank" rel="noreferrer">Instagram</a></Magnetic>
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

export default Professional