import { useNavigate } from "react-router-dom";
import "./Home.css";

import heroImg from "../assets/hero-image.png";
import logo    from "../assets/logo-full.png";

import item1   from "../assets/lost-item-1.jpg";
import item2   from "../assets/lost-item-2.jpg";
import item3   from "../assets/lost-item-3.jpg";
import item4   from "../assets/lost-item-4.jpg";

import found1  from "../assets/found-item-1.jpg";
import found2  from "../assets/found-item-2.jpg";
import found3  from "../assets/found-item-3.jpg";
import found4  from "../assets/found-item-4.jpg";

const lostItems = [
  { id: 1, img: item1,  name: "Poncho",        location: "Building 3, FA1",  time: "1 hour ago" },
  { id: 2, img: item2,  name: "Helmet",         location: "Parking Area",     time: "3 hours ago" },
  { id: 3, img: item3,  name: "Pencil Bag",     location: "Library, Block B", time: "5 hours ago" },
  { id: 4, img: item4,  name: "Scissors",       location: "Cafeteria",        time: "2 days ago" },
];

const foundItems = [
  { id: 1, img: found1, name: "Wallet",         location: "Building 2, FA3", time: "30 mins ago" },
  { id: 2, img: found2, name: "Bracelet",       location: "Building 7, FA4", time: "2 hours ago" },
  { id: 3, img: found3, name: "Water Bottle",   location: "Building 5, FA2", time: "4 hours ago" },
  { id: 4, img: found4, name: "Leather Jacket", location: "Building 1, FA1", time: "1 day ago" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <img src={logo} alt="CampusFind" className="nav-logo" />
        <ul className="nav-links">
          <li onClick={() => navigate("/lost-items")}>Lost Items</li>
          <li onClick={() => navigate("/found-items")}>Found Items</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/faq")}>FAQ</li>
        </ul>
        <div className="nav-btns">
          <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-solid"   onClick={() => navigate("/register")}>Register</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-text">
          <h1>Lost Something?<br/>We're here to help</h1>
          <p>Find lost items on campus or report items you've found</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for object..."/>
            <button className="search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
          <div className="hero-btns">
            <button className="btn-report-lost" onClick={() => navigate("/lost-items")}>Report Lost Item</button>
            <button className="btn-report-found" onClick={() => navigate("/found-items")}>Report Found Item</button>
          </div>
        </div>
        <div className="hero-img">
          <img src={heroImg} alt="Campus"/>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stat-card">
          <h2>1,245</h2>
          <p>Items Reported</p>
        </div>
        <div className="stat-card">
          <h2>867</h2>
          <p>Items Found</p>
        </div>
        <div className="stat-card">
          <h2>2,315</h2>
          <p>Active Users</p>
        </div>
      </section>

      {/* ── RECENT LOST ITEMS ── */}
      <section className="items-section">
        <div className="section-header">
          <h2>Recent Lost Items</h2>
          <span className="view-all" onClick={() => navigate("/lost-items")}>View All</span>
        </div>
        <div className="items-grid">
          {lostItems.map(item => (
            <div className="item-card" key={item.id} onClick={() => navigate("/lost-items")}>
              <div className="item-img-wrap">
                <img src={item.img} alt={item.name}/>
              </div>
              <div className="item-info">
                <h4>{item.name}</h4>
                <p><LocationIcon/> {item.location}</p>
                <p><ClockIcon/> {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECENT FOUND ITEMS ── */}
      <section className="items-section">
        <div className="section-header">
          <h2>Recent Found Items</h2>
          <span className="view-all" onClick={() => navigate("/found-items")}>View All</span>
        </div>
        <div className="items-grid">
          {foundItems.map(item => (
            <div className="item-card" key={item.id} onClick={() => navigate("/found-items")}>
              <div className="item-img-wrap">
                <img src={item.img} alt={item.name}/>
              </div>
              <div className="item-info">
                <h4>{item.name}</h4>
                <p><LocationIcon/> {item.location}</p>
                <p><ClockIcon/> {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <span className="step-num">01</span>
            <div>
              <h4>Report</h4>
              <p>Report lost or found items in a few steps.</p>
            </div>
          </div>
          <div className="step-card">
            <span className="step-num">02</span>
            <div>
              <h4>Match</h4>
              <p>We help match items with the right people.</p>
            </div>
          </div>
          <div className="step-card">
            <span className="step-num">03</span>
            <div>
              <h4>Retrieve</h4>
              <p>Claim your item after verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-left">
          <img src={logo} alt="CampusFind" className="footer-logo"/>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => navigate("/lost-items")}>Lost Items</li>
            <li onClick={() => navigate("/found-items")}>Found Items</li>
            <li onClick={() => navigate("/about")}>About Us</li>
            <li onClick={() => navigate("/faq")}>FAQ</li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Follow us</h4>
          <div className="social-icons">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
