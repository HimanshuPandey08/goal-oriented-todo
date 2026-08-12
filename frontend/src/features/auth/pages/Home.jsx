import { Link } from "react-router"
import "../styles/home.scss"

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4"

const BrandMark = () => (
  <svg viewBox="0 0 31.5 48.5" className="brand-mark" aria-hidden="true">
    <defs>
      <linearGradient id="bg1" x1="8" y1="0" x2="34.1" y2="28.9" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#9e9e9e" />
        <stop offset=".28" stopColor="#a6a6a6" />
        <stop offset=".34" stopColor="#a3a3a3" />
        <stop offset=".40" stopColor="#3a3a3a" />
        <stop offset=".55" stopColor="#414141" />
        <stop offset=".60" stopColor="#7a7a7a" />
        <stop offset=".68" stopColor="#8e8e8e" />
        <stop offset=".80" stopColor="#a9a9a9" />
        <stop offset=".95" stopColor="#c4c4c4" />
        <stop offset="1" stopColor="#cccccc" />
      </linearGradient>
    </defs>
    <path
      d="M21.5 0 L21.5 19.5 L31.5 19.5 L31.5 29 L10 48.5 L10 28.5 L0.5 28.5 L0.5 18.5 Z"
      fill="url(#bg1)"
    />
    <rect x="0.5" y="18.5" width="9" height="10" fill="#fdfdfd" />
    <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
  </svg>
)

const Home = () => {
  return (
    <div className="stage">
      <div className="plate">
        <video className="plate-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      <header className="topbar">
        <Link to="/" className="brand" aria-label="Home">
          <BrandMark />
        </Link>

        <nav className="links" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <Link to="/login" className="pill pill-nav">
          <span>Get Started</span>
        </Link>
      </header>

      <main className="hero">
        <h1 className="headline">
          <span>Turn Your Goals</span>
          <span>Into Progress</span>
        </h1>

        <p className="sub">
          <span>Set meaningful goals, break them into focused tasks,</span>
          <span>and move forward one step at a time.</span>
        </p>

        <div className="actions">
          <Link to="/register" className="pill pill-cta">
            <span>Get Started</span>
          </Link>
          <a href="#architecture" className="ghost">
            How It Works
          </a>
        </div>
      </main>

      <div className="logos" aria-hidden="true">
        <div className="lg lg1">
          <span className="feature-icon">
                            01
            </span>
          <span className="word">Set Goals</span>
        </div>
        <div className="lg lg2">
          <span className="feature-icon">
                            02
            </span>
          <span className="word">
            Create Tasks
          </span>
        </div>
        <div className="lg lg3">
          <span className="feature-icon">
                            03
            </span>
          <span className="word">Make Progress</span>
        </div>
        <div className="lg lg4">
          <span className="feature-icon">
                            04
            </span>
          <span className="word">Complete Goals</span>
        </div>
      </div>
    </div>
  )
}

export default Home