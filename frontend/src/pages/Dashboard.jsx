import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut, FiBell } from "react-icons/fi";
import "./Dashboard.css";

import logoIcon     from "../assets/logo-icon.png";
import walletImg    from "../assets/brown_wallet.jpg";
import headphoneImg from "../assets/headphone.avif";
import backpackImg  from "../assets/black_bagpack.jpg";
import bottleImg    from "../assets/silver_water_bottle.jpg";
import studentIdImg from "../assets/student_id_card.png";
import umbrellaImg  from "../assets/blue_umbrella.jpg";

// ── TEMPORARY DATA (teammate will replace with real API) ──
const TEMP_USER = {
  name: "User Name",
  stats: { lostItems: 9, foundItems: 5, activeClaims: 3, resolved: 1 },
};

const TEMP_LOST_ITEMS = [
  { id: 1, img: walletImg,    name: "Brown Leather Wallet",             date: "Lost on May 18, 2024", location: "Library Building (Ground Floor)", category: "Personal Accessories", claims: 2, status: "Under Review" },
  { id: 2, img: headphoneImg, name: "Black Headphones (Sony WH-CH520)", date: "Lost on May 15, 2024", location: "Cafeteria",                        category: "Electronics",          claims: 1, status: "Under Review" },
  { id: 3, img: backpackImg,  name: "Black Backpack",                   date: "Lost on May 10, 2024", location: "Auditorium",                       category: "Bags",                 claims: 0, status: "No Claims"    },
  { id: 4, img: bottleImg,    name: "Silver Water Bottle",              date: "Lost on May 8, 2024",  location: "Building 3, FA1",                  category: "Accessories",          claims: 1, status: "Under Review" },
];

const TEMP_FOUND_ITEMS = [
  { id: 1, img: umbrellaImg,  name: "Blue Umbrella",   date: "Found on May 20, 2024", location: "Library Entrance", category: "Accessories", claims: 1, status: "Under Review" },
  { id: 2, img: studentIdImg, name: "Student ID Card", date: "Found on May 17, 2024", location: "Cafeteria",        category: "Documents",   claims: 0, status: "No Claims"    },
];

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function statusClass(status) {
  if (status === "Under Review") return "badge--review";
  if (status === "Resolved")     return "badge--resolved";
  return "badge--noclaims";
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab,  setActiveTab]  = useState("lost");
  const [search,     setSearch]     = useState("");
  const [sortBy,     setSortBy]     = useState("latest");
  const [user,       setUser]       = useState(() => {
    const savedName = localStorage.getItem("userName");
    return { ...TEMP_USER, name: savedName || TEMP_USER.name, stats: {
      lostItems:    TEMP_LOST_ITEMS.length,
      foundItems:   TEMP_FOUND_ITEMS.length,
      activeClaims: TEMP_LOST_ITEMS.filter(i => i.status === "Under Review").length + TEMP_FOUND_ITEMS.filter(i => i.status === "Under Review").length,
      resolved:     TEMP_LOST_ITEMS.filter(i => i.status === "Resolved").length + TEMP_FOUND_ITEMS.filter(i => i.status === "Resolved").length,
    }};
  });
  const [lostItems,  setLostItems]  = useState(TEMP_LOST_ITEMS);
  const [foundItems, setFoundItems] = useState(TEMP_FOUND_ITEMS);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_BASE}/auth/me`, { headers })
      .then(r => r.json())
      .then(data => {
        const name = data.fullName || data.name;
        if (name) {
          localStorage.setItem("userName", name);
          setUser(prev => ({ ...prev, name, stats: data.stats || prev.stats }));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/items/my-lost`, { headers })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLostItems(data.map((item, i) => ({
            id:       item.id,
            img:      item.imageUrl || TEMP_LOST_ITEMS[i % TEMP_LOST_ITEMS.length].img,
            name:     item.name,
            date:     `Lost on ${new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
            location: item.location,
            category: item.category,
            claims:   item.claimCount || 0,
            status:   item.status     || "No Claims",
          })));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/items/my-found`, { headers })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFoundItems(data.map((item, i) => ({
            id:       item.id,
            img:      item.imageUrl || TEMP_FOUND_ITEMS[i % TEMP_FOUND_ITEMS.length].img,
            name:     item.name,
            date:     `Found on ${new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
            location: item.location,
            category: item.category,
            claims:   item.claimCount || 0,
            status:   item.status     || "No Claims",
          })));
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const activeItems = activeTab === "lost" ? lostItems : foundItems;
  const filtered = activeItems
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "latest" ? b.id - a.id : a.id - b.id);

  return (
    <div className="dash-layout">

      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <img src={logoIcon} alt="CampusFind" className="sidebar-logo-img" />
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          {/* Dashboard — active */}
          <button className="sidebar-btn sidebar-btn--active" onClick={() => navigate("/dashboard")} title="Dashboard">
            <HiHome size={22} color="#4B2FA0" />
          </button>

          {/* Claims */}
          <button className="sidebar-btn" onClick={() => navigate("/claims")} title="Claims">
            <span className="icon-stack">
              <BsBoxSeam size={20} color="#F59E0B" />
              <HiMiniMagnifyingGlass size={10} color="#F59E0B" className="icon-overlay" />
            </span>
          </button>

          {/* Found Items */}
          <button className="sidebar-btn" onClick={() => navigate("/found-items")} title="Found Items">
            <span className="icon-stack">
              <BsBoxSeam size={20} color="#14B8A6" />
              <span className="icon-check">✓</span>
            </span>
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          <FiLogOut size={20} color="#e53e3e" />
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="dash-main">

        <div className="dash-header">
          <div>
            <h1 className="dash-username">{user.name}</h1>
            <p className="dash-subtitle">Browse all your reported items and claims here.</p>
          </div>
          <button className="dash-bell" title="Notifications">
            <FiBell size={22} color="#555" />
          </button>
        </div>

        <div className="dash-stats">
          <div className="dash-stat-card">
            <p className="stat-label">My lost items</p>
            <h2 className="stat-num">{user.stats.lostItems}</h2>
            <span className="stat-view">View All</span>
          </div>
          <div className="dash-stat-card">
            <p className="stat-label">My found items</p>
            <h2 className="stat-num">{user.stats.foundItems}</h2>
            <span className="stat-view">View All</span>
          </div>
          <div className="dash-stat-card">
            <p className="stat-label">Active Claims</p>
            <h2 className="stat-num">{user.stats.activeClaims}</h2>
            <span className="stat-view">View All</span>
          </div>
          <div className="dash-stat-card">
            <p className="stat-label">Resolved</p>
            <h2 className="stat-num">{user.stats.resolved}</h2>
            <span className="stat-view">View All</span>
          </div>
        </div>

        <section className="dash-items">
          <h2 className="dash-section-title">My Reported Items</h2>

          <div className="dash-tabs">
            <button
              className={`dash-tab ${activeTab === "lost" ? "dash-tab--active" : ""}`}
              onClick={() => { setActiveTab("lost"); setSearch(""); }}
            >My Lost Item</button>
            <button
              className={`dash-tab ${activeTab === "found" ? "dash-tab--active" : ""}`}
              onClick={() => { setActiveTab("found"); setSearch(""); }}
            >Items I Found</button>
          </div>

          <div className="dash-controls">
            <span className="dash-count">{filtered.length} Items</span>
            <div className="dash-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder={`Search ${activeTab} items...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="dash-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="latest">Sort by: Latest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
          </div>

          <div className="dash-item-list">
            {filtered.length === 0 ? (
              <div className="dash-empty">No items found.</div>
            ) : filtered.map(item => (
              <div className="dash-item-row" key={item.id}>
                <img src={item.img} alt={item.name} className="dash-item-img" />
                <div className="dash-item-info">
                  <h4>{item.name}</h4>
                  <p className="dash-item-meta">
                    <span><CalendarIcon />{item.date}</span>
                    <span className="dot">•</span>
                    <span><LocationIcon />{item.location}</span>
                  </p>
                  <span className="dash-category">{item.category}</span>
                </div>
                <div className="dash-item-claims">
                  <p className="claims-label">Claims</p>
                  <p className="claims-num">{item.claims}</p>
                </div>
                <span className={`dash-badge ${statusClass(item.status)}`}>{item.status}</span>
                <button className="dash-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}